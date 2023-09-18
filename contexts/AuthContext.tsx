import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useWallet } from '@meshsdk/react'
import api from '@/utils/api'
import populateLeaderboard from '@/functions/populateLeaderboard'
import type { PopulatedWallet } from '@/@types'
import { POLICY_IDS } from '@/constants'

interface AuthContext {
  populatingWallet: boolean
  populatedWallet: PopulatedWallet | null
  openConnectModal: boolean
  toggleConnectModal: (bool?: boolean) => void
}

const initContext: AuthContext = {
  populatingWallet: false,
  populatedWallet: null,
  openConnectModal: false,
  toggleConnectModal: () => {},
}

const AuthContext = createContext(initContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = (props: PropsWithChildren) => {
  const { children } = props
  const { connected, name, wallet, disconnect } = useWallet()

  const [openConnectModal, setOpenConnectModal] = useState(false)
  const toggleConnectModal = (bool?: boolean) => setOpenConnectModal((prev) => bool ?? !prev)

  const [populatingWallet, setPopulatingWallet] = useState(false)
  const [populatedWallet, setPopulatedWallet] = useState<PopulatedWallet | null>(null)

  const populate = useCallback(async (): Promise<void> => {
    try {
      setPopulatingWallet(true)

      const stakeKey = (await wallet.getRewardAddresses())[0]
      const assets = await wallet.getPolicyIdAssets(POLICY_IDS['COMICS_ISSUE_ONE'])
      const populatedTokens = await Promise.all(assets.map(({ unit }) => api.token.getData(unit)) || [])
      const points = populateLeaderboard(populatedTokens, stakeKey)[stakeKey] || 0

      setPopulatedWallet({
        stakeKey,
        points,
        tokens: populatedTokens,
      })
    } catch (error: any) {
      setPopulatedWallet(null)
      disconnect()

      toast.dismiss()
      toast.error(error.message || error.toString())
    } finally {
      setPopulatingWallet(false)
    }
  }, [wallet, disconnect])

  useEffect(() => {
    if (connected) {
      toast.dismiss()
      toast.loading('CONNECTING WALLET')

      populate().then(() => {
        const walletName = name.toUpperCase().replace('WALLET', '').trim()

        toast.dismiss()
        toast.success(`${walletName} CONNECTED`)
      })
    } else {
      setPopulatedWallet(null)
    }
  }, [connected, populate, name])

  return (
    <AuthContext.Provider
      value={{
        populatingWallet,
        populatedWallet,
        openConnectModal,
        toggleConnectModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
