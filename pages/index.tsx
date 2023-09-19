import Link from 'next/link'
import Image from 'next/image'
import { Antonio, Imbue } from 'next/font/google'
import { FormEvent, useMemo, useState } from 'react'
import { useData } from '@/contexts/DataContext'
import Api from '@/utils/api'
import formatHex from '@/functions/formatHex'
import Loader from '@/components/Loader'
import { POLICY_IDS } from '@/constants'

const api = new Api()
const imbue = Imbue({ weight: '300', subsets: ['latin'] })
const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Page = () => {
  const { populatedWallet, populatedTokens } = useData()
  const [loading, setLoading] = useState(false)
  const [serialToCheck, setSerialToCheck] = useState('')
  const [checkedClaims, setCheckedClaims] = useState<{ serial: number; claimed: boolean }[]>([])

  const getSerialStringFromSerialNumber = (num: number) => {
    let str = num.toString()

    while (str.length < 4) {
      str = `0${str}`
    }

    return `#${str}`
  }

  const checkClaim = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const serial = Number(serialToCheck)

    try {
      const policyId = POLICY_IDS['COMICS_ISSUE_ONE']
      const cip68NftPrefix = '000de140'
      const tokenName = formatHex.toHex(`TMO Comics - Issue One ${getSerialStringFromSerialNumber(serial)}`)

      const token = await api.token.populateData(`${policyId}${cip68NftPrefix}${tokenName}`)

      setCheckedClaims((prev) => [...prev, { serial, claimed: token.isClaimed }])
      setSerialToCheck('')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const myClaimedCount = useMemo(() => populatedWallet?.tokens.reduce((prev, curr) => prev + (curr.isClaimed ? 1 : 0), 0) || 0, [populatedWallet])
  const totalClaimedCount = useMemo(() => populatedTokens.reduce((prev, curr) => prev + (curr.isClaimed ? 1 : 0), 0), [populatedTokens])

  return (
    <main className='min-h-screen mb-12 px-4 flex flex-col items-center'>
      <div className='flex'>
        {['common', 'rare', 'super_rare', 'mythic'].map((rarity) => (
          <div key={rarity} className='mx-2 sm:mx-4'>
            <Image
              src={`/media/cover_varients/${rarity}.jpeg`}
              alt={rarity}
              width={220}
              height={340}
              className='w-[220px] border-2 border-yellow-900 drop-shadow-[0_0_0.5rem_rgba(0,0,0,1)]'
              priority
              unoptimized
            />
            <div className={`mt-2 text-center text-sm sm:text-xl font-normal ${antonio.className}`}>{rarity.toUpperCase().replaceAll('_', ' ')}</div>
          </div>
        ))}
      </div>

      <div className='mt-8 sm:mt-12'>
        <p className={`text-center text-4xl sm:text-6xl font-normal ${imbue.className}`}>GAIN POINTS FOR COLLECTING EDITIONS OF TMO COMICS!</p>
      </div>

      <div className='max-w-[750px] mt-8 sm:mt-12'>
        <div className='w-full mt-8 sm:mt-12 p-8 sm:p-12 text-center border border-sky-500 bg-stone-950'>
          <p className={`text-4xl sm:text-6xl font-normal ${imbue.className}`}>THE MALLARD ORDER COMIC ISSUE ONE</p>

          <p className={`my-5 sm:my-10 text-xl sm:text-3xl ${antonio.className}`}>
            ISSUE ONE MUST BE <span className='text-yellow-400'>LEVEL 2</span> TO UNLOCK REDEMPTION
          </p>

          <button
            type='button'
            disabled={true}
            className={`py-2 px-4 sm:py-4 sm:px-8 text-lg sm:text-2xl rounded-lg border border-sky-500 bg-gradient-to-b from-[#0081AA] to-[#00121C] disabled:opacity-40 disabled:cursor-not-allowed ${antonio.className}`}
          >
            REDEMPTION COMING SOON
          </button>

          {/* <Link
            href='/redeem'
            className={`py-2 px-4 sm:py-4 sm:px-8 text-lg sm:text-2xl rounded-lg border border-sky-500 bg-gradient-to-b from-[#0081AA] to-[#00121C] hover:bg-gradient-to-b hover:from-[#009FD1] hover:to-[#00121C] ${antonio.className}`}
          >
            REDEEM YOUR COPY
          </Link> */}
        </div>

        <div className='w-full mt-8 sm:mt-12 p-8 sm:p-10 text-center border border-sky-500 bg-gradient-to-b from-[#430000] to-[#110000]'>
          <p className={`text-4xl sm:text-6xl font-normal ${imbue.className}`}>CHECK FOR PHYSICAL REDEMPTION</p>

          <form onSubmit={checkClaim} className={`w-full mt-4 sm:mt-8 flex items-end justify-center text-lg sm:text-2xl ${antonio.className}`}>
            <div className='w-2/3 mr-4'>
              <p className='mb-2 sm:mb-4'>SERIAL #:</p>
              <input
                placeholder='#0000, #0001, #0002...'
                disabled={loading}
                value={serialToCheck}
                onChange={(e) => {
                  const v = e.target.value.match(/\d+/g)?.join('') || ''

                  if (Number(v) >= 0 && Number(v) <= 2000) {
                    setSerialToCheck(v)
                  }
                }}
                className='w-full py-2 px-4 sm:py-4 sm:px-8 text-center text-neutral-400 placeholder:text-neutral-700 rounded-lg border border-sky-500 bg-stone-950'
              />
            </div>

            {loading ? (
              <Loader label='CHECKING' withLabel />
            ) : (
              <button
                type='submit'
                disabled={!serialToCheck || loading}
                className={`py-2 px-4 sm:py-4 sm:px-8 rounded-lg border border-transparent bg-red-900 disabled:opacity-40 disabled:cursor-not-allowed ${antonio.className}`}
              >
                CHECK
              </button>
            )}
          </form>

          <div className={`mt-4 sm:mt-8 flex flex-wrap justify-center ${antonio.className}`}>
            {checkedClaims.map((item, idx) => (
              <div
                key={`claim-status-${idx}`}
                className={
                  'w-[85px] m-1 py-1 flex flex-col items-center text-sm sm:text-unset rounded-lg border bg-gradient-to-b ' +
                  (item.claimed ? 'border-sky-900 from-[#05445F] to-black' : 'border-red-800 from-[#531010] to-black')
                }
              >
                <span className='whitespace-nowrap'>{getSerialStringFromSerialNumber(item.serial)}</span>
                <div className='w-4/5 h-[1px] my-1 bg-white rounded-full' />
                <span className='whitespace-nowrap'>{item.claimed ? 'CLAIMED' : 'NOT CLAIMED'}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`w-full mt-8 sm:mt-12 p-4 sm:p-10 flex flex-wrap items-center justify-evenly text-center rounded-lg border border-sky-500 bg-gradient-to-b from-[#0E2637] to-[#101010] ${antonio.className}`}
        >
          <div className='m-4 flex flex-col items-center'>
            <span className='text-xl sm:text-2xl whitespace-nowrap'>MY CLAIMED PHYSICALS</span>
            <div className='w-[111%] h-[1px] my-2 bg-white rounded-full' />
            <span className='text-2xl sm:text-4xl text-sky-500 whitespace-nowrap'>{myClaimedCount}</span>
          </div>

          <div className='m-4 flex flex-col items-center'>
            <span className='text-xl sm:text-2xl whitespace-nowrap'>TOTAL CLAIMED PHYSICALS</span>
            <div className='w-[111%] h-[1px] my-2 bg-white rounded-full' />
            <span className='text-2xl sm:text-4xl text-sky-500 whitespace-nowrap'>{totalClaimedCount}</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Page
