'use client';

// Style
import '@rainbow-me/rainbowkit/styles.css';

// Wagmi and react query config
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

// RainbowKit config
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

// Chains
import { hardhat, arbitrum } from 'wagmi/chains';

const config = getDefaultConfig({
    appName: 'Stratefi',
    projectId: 'YOUR_PROJECT_ID', // todo: create a dotenv file and get id from wallet connect
    chains: [arbitrum, hardhat],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const RainbowKitAndWagmiProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
            { children }
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  )
}

export default RainbowKitAndWagmiProvider