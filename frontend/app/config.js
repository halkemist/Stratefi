import { http, createPublicClient } from "viem";
import { hardhat } from "viem/chains";

export const config = createPublicClient({
    chain: hardhat,
    transport: http()
})