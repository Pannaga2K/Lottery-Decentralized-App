import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return <ThirdwebProvider desiredChainId={ChainId.Mumbai} >
    <Component {...pageProps} />
    <Toaster toastOptions={{
      className: '',
      style: {
        border: '1px solid #004337',
        color: 'white',
        backgroundColor: "black"
      },
    }} />
  </ThirdwebProvider>
}

export default MyApp
