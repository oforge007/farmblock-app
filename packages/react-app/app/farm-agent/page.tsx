"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { celoSepoliaClient, MENTO_ROUTER_ADDRESS, CUSD_ADDRESS, CELO_ADDRESS } from "@/lib/viem-client"
import { useActiveAccount } from "thirdweb/react"
import { ethers } from "ethers"

const MENTO_ROUTER_ABI = [
  "function getSwapOutput(address from, uint256 amount, address to) view returns (uint256)",
  "function swap(address from, address to, uint256 amount, uint256 minReceived) payable returns (uint256)",
]

interface FarmblockData {
  id: string
  farmName: string
  location?: string
  safeWallet?: string
  registrationStake?: string
  stakeCurrency?: string
  nftDropAddress?: string
}

export default function FarmAgentPage() {
  const account = useActiveAccount()
  const address = account?.address || ""

  const [farmblocks, setFarmblocks] = useState<FarmblockData[]>([])
  const [selectedFarmblock, setSelectedFarmblock] = useState<FarmblockData | null>(null)
  const [swapAmount, setSwapAmount] = useState("10")
  const [quote, setQuote] = useState<string>("")
  const [log, setLog] = useState<string[]>([])
  const [memo, setMemo] = useState<string>("")

  const safeOwnerScore = useMemo(() => {
    if (!selectedFarmblock?.safeWallet || !address) return "unknown"
    return selectedFarmblock.safeWallet.toLowerCase() === address.toLowerCase()
      ? "owner"
      : "observer"
  }, [selectedFarmblock, address])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = localStorage.getItem("farmblocks")
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setFarmblocks(parsed)
        if (parsed.length > 0) setSelectedFarmblock(parsed[0])
      }
    } catch (e) {
      console.warn("FarmAgent: could not parse farmblocks", e)
    }
  }, [])

  const appendLog = (message: string) => {
    setLog((prev) => [...prev.slice(-30), `${new Date().toISOString()}: ${message}`])
  }

  const fetchMentoQuote = async () => {
    if (!selectedFarmblock) return
    const fromToken = CUSD_ADDRESS
    const toToken = CELO_ADDRESS
    const amount = ethers.parseUnits(swapAmount || "0", 18)

    try {
      const result = await celoSepoliaClient.readContract({
        address: MENTO_ROUTER_ADDRESS as `0x${string}`,
        abi: MENTO_ROUTER_ABI,
        functionName: "getSwapOutput",
        args: [fromToken as `0x${string}`, amount, toToken as `0x${string}`],
      })
      const quoteAmount = ethers.formatUnits(result as bigint, 18)
      setQuote(quoteAmount)
      appendLog(`Quote: ${swapAmount} cUSD -> ${quoteAmount} CELO`)
    } catch (error) {
      console.error("Mento quote error", error)
      setQuote("")
      appendLog(`Quote fetch failed: ${(error as Error).message}`)
    }
  }

  const executeSwap = async () => {
    const ethereum = typeof window !== "undefined" ? (window as any).ethereum : undefined
    if (!selectedFarmblock || !ethereum) {
      appendLog("MetaMask/Ethereum provider is required")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()

      const router = new ethers.Contract(MENTO_ROUTER_ADDRESS, MENTO_ROUTER_ABI, signer)
      const amount = ethers.parseUnits(swapAmount || "0", 18)
      const minReceived = "0" // conservative, for quick demo (should use slippage guard)

      if (address.toLowerCase() !== selectedFarmblock.safeWallet?.toLowerCase()) {
        appendLog("Not a safe owner: algorithmic action queued for monitoring.")
      }

      appendLog(`Submitting swap: ${swapAmount} cUSD to CELO via Mento router`)
      const tx = await router.swap(CUSD_ADDRESS, CELO_ADDRESS, amount, minReceived, {
        value: ethers.parseEther("0"),
      })
      appendLog(`txHash: ${tx.hash}`)
      const receipt = await tx.wait()
      appendLog(`Swap complete (block ${receipt.blockNumber})`)

      if (receipt.status === 1) {
        appendLog(`Agent: unlocking farm deployment trigger for FarmBlock ${selectedFarmblock.id}`)
      }
    } catch (error) {
      console.error("Swap failed", error)
      appendLog(`Swap failed: ${(error as Error).message}`)
    }
  }

  const dispatchAgronomistAgentReport = async () => {
    if (!selectedFarmblock) return
    appendLog(`Agent verdict for ${selectedFarmblock.farmName}:`)
    appendLog(`- Risk based on sanctity checks: ${safeOwnerScore}`)
    appendLog(`- Suggested next action: deploy liquidity to Mento stable pools and mint governance tokens.`)
    if (memo.trim()) appendLog(`- Notes: ${memo.trim()}`)
    setMemo("")
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-2xl font-bold mt-4">Farm Agent (Celo Sepolia Mento)</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Underwriting and FX assistant for FarmBlock treasury. This agent uses viem for on-chain price exploration and an actionable swap workflow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">FarmBlocks</h2>
            {farmblocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No local farmblocks found yet.</p>
            ) : (
              <ul className="space-y-2">
                {farmblocks.map((item) => (
                  <li key={item.id}>
                    <button
                      className={
                        "text-left w-full rounded p-2 border " +
                        (selectedFarmblock?.id === item.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white")
                      }
                      onClick={() => setSelectedFarmblock(item)}
                    >
                      <div className="font-medium">{item.farmName}</div>
                      <div className="text-xs text-muted-foreground">{item.location || "unknown"}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Agent Health & Action</h2>
            <div className="text-sm mb-2">
              Connected wallet: <strong>{address || "not connected"}</strong>
            </div>
            <div className="text-sm mb-2">Current safe relationship: <strong>{safeOwnerScore}</strong></div>
            <div className="text-sm mb-2">Selected farmblock ID: <strong>{selectedFarmblock?.id || "none"}</strong></div>
            <div className="mb-3">
              <Input
                value={swapAmount}
                onChange={(e: any) => setSwapAmount(e.target.value)}
                placeholder="cUSD amount"
              />
              <Button className="mt-2 w-full" onClick={fetchMentoQuote}>
                Get Mento quote
              </Button>
              {quote && <p className="text-sm mt-2 text-green-700">Estimated CELO output: {quote}</p>}
            </div>
            <Button className="w-full" onClick={executeSwap}>
              Execute Mento swap
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Agent Notes</h2>
          <Textarea
            value={memo}
            onChange={(e: any) => setMemo(e.target.value)}
            placeholder="Write a farm agent memorandum for this farmblock..."
          />
          <Button className="mt-2" onClick={dispatchAgronomistAgentReport}>
            Save Agent Report
          </Button>
        </div>

        <div className="mt-4 rounded-lg border p-4 bg-slate-50">
          <h2 className="text-lg font-semibold">Activity log</h2>
          <div className="max-h-72 overflow-y-auto text-xs font-mono whitespace-pre-wrap">
            {log.length > 0 ? log.map((entry, idx) => <div key={idx}>{entry}</div>) : <div>No events yet.</div>}
          </div>
        </div>

        <div className="mt-4">
          <Link href="/farmblock">Back to FarmBlocks</Link>
        </div>
      </div>
      <FooterMenu />
    </main>
  )
}
