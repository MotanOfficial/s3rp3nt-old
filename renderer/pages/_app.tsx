import '../styles/globals.css'
import '../styles/colors.css' // Import colors.css here
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
