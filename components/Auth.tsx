import Image from 'next/image'
import { Antonio } from 'next/font/google'
import { Fragment, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useWallet, useWalletList } from '@meshsdk/react'
import { useAuth } from '@/contexts/AuthContext'
import truncateStringInMiddle from '@/functions/truncateStringInMiddle'
import StarIcon from '@/icons/Star'
import Modal from './Modal'
import { LS_KEYS } from '@/constants'

const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Auth = () => {
  const installedWallets = useWalletList()
  const { connect, disconnect, connecting, connected, name, error } = useWallet()
  const { populatingWallet, populatedWallet, openConnectModal, toggleConnectModal } = useAuth()

  const mountRef = useRef(false)

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true

      const lsValue = localStorage.getItem(LS_KEYS['WALLET_PROVIDER'])
      if (lsValue) connect(lsValue)
    } else {
      if (connected) {
        localStorage.setItem(LS_KEYS['WALLET_PROVIDER'], name)
        toggleConnectModal(false)
      } else {
        localStorage.removeItem(LS_KEYS['WALLET_PROVIDER'])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, name])

  return (
    <Fragment>
      <div className='flex flex-col'>
        <button
          type='button'
          disabled={openConnectModal}
          onClick={() => toggleConnectModal(true)}
          className='w-[220px] m-1 p-3 flex items-center justify-center rounded-lg border border-transparent hover:border-neutral-50 focus:border-neutral-50 bg-gradient-to-b from-sky-900 via-teal-950 to-sky-900 disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {connected ? (
            <Image
              src={installedWallets.find((item) => item.name === name)?.icon || ''}
              alt={name}
              width={35}
              height={35}
              className='w-6 h-6 mr-2 drop-shadow-[0_0_1px_rgba(0,0,0,1)]'
              priority
              unoptimized
            />
          ) : null}

          {connected && !!populatedWallet
            ? populatedWallet.handle || truncateStringInMiddle(populatedWallet.stakeKey, 7)
            : connecting || populatingWallet
            ? 'CONNECTING...'
            : 'CONNECT WALLET'}
        </button>

        {connected && !!populatedWallet ? (
          <div className={`w-[220px] m-1 p-3 flex items-center justify-center rounded-lg border border-transparent bg-red-800 ${antonio.className}`}>
            <StarIcon className='w-6 h-6 mr-2' />
            <span>COLLECTOR&apos;S POINTS: {populatedWallet.points}</span>
          </div>
        ) : null}
      </div>

      <Modal open={openConnectModal} onClose={() => toggleConnectModal(false)}>
        {connected ? (
          <div className='sm:py-10 sm:px-20 mx-auto text-center'>
            <h2 className={`mb-8 text-xl ${antonio.className}`}>DISCONNECT YOUR WALLET?</h2>

            <button
              type='button'
              disabled={!connected || connecting}
              onClick={() => {
                disconnect()
                toast.success('DISCONNECTED')
              }}
              className='py-4 px-12 text-center rounded-lg border border-transparent hover:border-zinc-400 focus:border-zinc-400 disabled:border-transparent bg-red-900 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed'
            >
              CONFIRM
            </button>
          </div>
        ) : !installedWallets.length ? (
          <div className='sm:py-10 sm:px-20 mx-auto text-center'>
            <h2 className={`text-xl ${antonio.className}`}>NO WALLETS INSTALLED</h2>
          </div>
        ) : (
          <div className='sm:px-8 mx-auto text-center'>
            <h2 className={`mb-8 text-xl ${antonio.className}`}>CONNECT YOUR WALLET</h2>

            {/* @ts-ignore */}
            {error ? <p className='text-red-400'>{error?.message || error?.toString()}</p> : null}

            <div className='max-w-[420px] mx-auto flex flex-wrap items-center justify-center'>
              {installedWallets.map((item) => {
                const walletName = item.name.toUpperCase().replace('WALLET', '').trim()

                return (
                  <button
                    key={item.name}
                    onClick={() => connect(item.name)}
                    disabled={connected || connecting}
                    className='w-[200px] m-1 p-2 flex items-center rounded-lg border border-transparent hover:border-zinc-400 focus:border-zinc-400 disabled:border-transparent bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed'
                  >
                    <Image
                      src={item.icon}
                      alt={walletName}
                      width={35}
                      height={35}
                      className='mx-4 drop-shadow-[0_0_1px_rgba(0,0,0,1)]'
                      priority
                      unoptimized
                    />
                    {walletName}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </Modal>
    </Fragment>
  )
}

export default Auth
