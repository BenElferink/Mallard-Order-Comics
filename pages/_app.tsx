import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { MeshProvider } from '@meshsdk/react'
import { DataProvider } from '@/contexts/DataContext'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import '@/styles/globals.css'

const inter = Inter({ weight: '300', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className={`max-w-[1400px] mx-auto ${inter.className}`}>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <title>TMO - Comics</title>
        </Head>

        <Toaster />

        <MeshProvider>
          <DataProvider>
            <Header />
            <Component {...pageProps} />
          </DataProvider>
        </MeshProvider>
      </div>

      <Footer />
    </div>
  )
}
