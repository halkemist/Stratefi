import { http, createPublicClient } from "viem";
import { baseSepolia } from "viem/chains";

export const config = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_URL_ALCHEMY)
})