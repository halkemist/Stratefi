'use client';

// Style
import '@rainbow-me/rainbowkit/styles.css';

// Wagmi and react query config
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider } from 'wagmi'

// RainbowKit config
import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

// Chains
import { baseSepolia } from 'wagmi/chains';

const config = getDefaultConfig({
    appName: 'Stratefi',
    projectId: process.env.WALLET_CONNECT_ID,
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(process.env.BASE_SEPOLIA_URL_ALCHEMY)
    },
    ssr: true,
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme({
              accentColor:"#000000",
              borderRadius: "small",
            })}>
            { children }
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndWagmiProvider