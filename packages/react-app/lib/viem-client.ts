import { createPublicClient, http } from "viem"
import { celoSepolia } from "viem/chains"

export const celoSepoliaClient = createPublicClient({
  chain: celoSepolia,
  transport: http(process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC || "https://forno.celo.org"),
})

export const MENTO_ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_CELO_SEPOLIA_MENTO_ROUTER || "0x0000000000000000000000000000000000000000"

export const CUSD_ADDRESS =
  process.env.NEXT_PUBLIC_CELO_SEPOLIA_CUSD || "0x0000000000000000000000000000000000000000"

export const CELO_ADDRESS =
  process.env.NEXT_PUBLIC_CELO_SEPOLIA_CELO || "0x0000000000000000000000000000000000000000"
