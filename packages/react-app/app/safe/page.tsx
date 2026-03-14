"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, ArrowLeft, Plus, Check, X, Clock, Shield } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"

// Sample transaction data
const pendingTransactions = [
  {
    id: 1,
    title: "Fund Task Rewards Pool",
    description: "Transfer 500 cUSD to the task rewards funding pool for June 2023.",
    amount: 500,
    currency: "cUSD",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    approvals: 2,
    requiredApprovals: 3,
    proposer: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
    date: "2023-06-01",
  },
  {
    id: 2,
    title: "Withdraw from Yield Pool",
    description: "Withdraw 200 cEUR from the cEUR yield pool for community development.",
    amount: 200,
    currency: "cEUR",
    recipient: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
    approvals: 1,
    requiredApprovals: 3,
    proposer: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    date: "2023-05-30",
  },
]

const completedTransactions = [
  {
    id: 3,
    title: "Fund NFT Rewards",
    description: "Transfer 300 cUSD to the NFT rewards pool for May 2023.",
    amount: 300,
    currency: "cUSD",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    approvals: 3,
    requiredApprovals: 3,
    proposer: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
    date: "2023-05-15",
    executed: "2023-05-16",
  },
  {
    id: 4,
    title: "Purchase Farm Equipment",
    description: "Transfer 450 cUSD to purchase irrigation equipment for Sunshine Farms.",
    amount: 450,
    currency: "cUSD",
    recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    approvals: 3,
    requiredApprovals: 3,
    proposer: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
    date: "2023-05-10",
    executed: "2023-05-11",
  },
]

// Sample guardian data
const guardians = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    name: "Alice",
    role: "Lead Guardian",
    transactions: 15,
  },
  {
    address: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
    name: "Bob",
    role: "Financial Guardian",
    transactions: 12,
  },
  {
    address: "0x3a45C9D5456C2f6F0a7F5b9C83f9974450F41234",
    name: "Carol",
    role: "Community Guardian",
    transactions: 10,
  },
]

export default function FarmBlockSafe() {
  const [newTransactionDialogOpen, setNewTransactionDialogOpen] = useState(false)
  const [safeAddress, setSafeAddress] = useState("")
  const [safeOwners, setSafeOwners] = useState<string[]>([])
  const [safeThreshold, setSafeThreshold] = useState<number | null>(null)
  const [safeEvents, setSafeEvents] = useState<any[]>([])
  const [safeStatus, setSafeStatus] = useState<string | null>(null)
  const { connected, connect, address } = useWallet()

  const loadSafeData = async () => {
    if (!safeAddress || !ethers.isAddress(safeAddress)) {
      setSafeStatus("Invalid Safe address")
      return
    }

    try {
      setSafeStatus("Connecting to Safe on Celo Sepolia...")
      const rpc = process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC || "https://forno.celo.org"
      const provider = new ethers.JsonRpcProvider(rpc)
      const safeAbi = [
        "function getOwners() view returns (address[])",
        "function getThreshold() view returns (uint256)",
        "function isOwner(address) view returns (bool)",
        "event ExecutionSuccess(bytes32 txHash)",
        "event ExecutionFailure(bytes32 txHash)",
        "event ApproveHash(address owner, bytes32 approvedHash)",
      ]
      const safe = new ethers.Contract(safeAddress, safeAbi, provider)
      const owners: string[] = await safe.getOwners()
      const threshold: number = Number(await safe.getThreshold())

      setSafeOwners(owners)
      setSafeThreshold(threshold)
      setSafeStatus(`Safe loaded. Owners: ${owners.length}, Threshold: ${threshold}`)

      const now = Math.floor(Date.now() / 1000)
      const oneWeekAgo = now - 7 * 24 * 3600
      const executionSuccessTopic = ethers.id("ExecutionSuccess(bytes32)")
      const executionFailTopic = ethers.id("ExecutionFailure(bytes32)")
      const approvalTopic = ethers.id("ApproveHash(address,bytes32)")

      const logs = await provider.getLogs({
        address: safeAddress,
        fromBlock: "earliest",
        toBlock: "latest",
        topics: [ [executionSuccessTopic, executionFailTopic, approvalTopic] ],
      })

      setSafeEvents(logs.map((log) => ({
        transactionHash: log.transactionHash,
        eventName:
          log.topics[0] === executionSuccessTopic
            ? "ExecutionSuccess"
            : log.topics[0] === executionFailTopic
            ? "ExecutionFailure"
            : "ApproveHash",
        data: log.data,
        blockNumber: log.blockNumber,
      })))
    } catch (error) {
      console.error("Safe load error", error)
      setSafeStatus("Failed to load Safe data")
    }
  }

  const handleApprove = async (transactionHash: string | number) => {
    const hashValue = transactionHash.toString()
    if (!connected) {
      await connect()
      return
    }

    if (!safeAddress || !ethers.isAddress(safeAddress)) {
      alert("Invalid Safe address")
      return
    }

    try {
      const rpc = process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC || "https://forno.celo.org"
      const provider = new ethers.JsonRpcProvider(rpc)
      const signer = await provider.getSigner(address || "")
      const safeAbi = ["function approveHash(bytes32 hash)"]
      const safe = new ethers.Contract(safeAddress, safeAbi, signer)
      await safe.approveHash(hashValue)
      alert(`Approved hash ${hashValue} on Safe`)
      loadSafeData()
    } catch (err) {
      console.error(err)
      alert("Approve failed, make sure wallet is connected as Safe owner")
    }
  }

  const handleReject = async (transactionHash: string | number) => {
    const hashValue = transactionHash.toString()
    if (!connected) {
      await connect()
      return
    }

    // For Gnosis Safe, rejection is normally an absence of approval; track locally
    alert(`Recorded rejection for hash ${transactionHash}. No on-chain action was taken.`)
  }

  const handleCreateTransaction = async () => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with the blockchain to create a new transaction
    alert("Transaction proposal created! Please confirm in your wallet.")
    setNewTransactionDialogOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm flex mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <p className="font-bold text-xl">FarmBlock</p>
        </Link>
      </div>

      <Card className="mb-6 w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-base">Safe Multisig Inspector</CardTitle>
          <CardDescription>Read owners, threshold and confirm transactions from the on-chain Gnosis Safe.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <Input
              placeholder="Safe contract address"
              value={safeAddress}
              onChange={(e) => setSafeAddress(e.target.value)}
            />
            <Button onClick={loadSafeData}>Load Safe</Button>
          </div>
          <p className="text-xs text-muted-foreground">{safeStatus || "Enter a Safe address and load to fetch data."}</p>
          {safeOwners.length > 0 && (
            <p className="text-xs mt-2 text-green-700">Owners: {safeOwners.map((o) => o).join(", ")}</p>
          )}
          {safeThreshold !== null && (
            <p className="text-xs mt-1 text-green-700">Threshold: {safeThreshold}</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6 w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Safe Activity</CardTitle>
          <CardDescription>Recent Safe events (ExecutionSuccess, ExecutionFailure, ApproveHash) from chain logs.</CardDescription>
        </CardHeader>
        <CardContent>
          {safeEvents.length > 0 ? (
            <div className="space-y-2">
              {safeEvents.map((event, idx) => (
                <div key={idx} className="p-2 border rounded">
                  <p className="text-xs font-medium">{event.eventName}</p>
                  <p className="text-xs">Block: {event.blockNumber}</p>
                  <p className="text-xs">Tx {event.transactionHash}</p>
                  {event.eventName === "ApproveHash" && (
                    <div className="mt-1 flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(event.data)}>Verify</Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(event.data)}>Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No Safe events captured.</p>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Button onClick={() => setNewTransactionDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">FarmBlock Safe</h1>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
            Farm Agent Ready
          </span>
        </div>
        <p className="text-muted-foreground mb-8">
          A community-driven multisig wallet that funds task rewards and yield trading, managed by Guardians through
          decentralized governance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Safe Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,250.00 cUSD</div>
              <div className="flex flex-col mt-1 space-y-1">
                <p className="text-xs text-muted-foreground">750.00 cEUR</p>
                <p className="text-xs text-muted-foreground">2,500.00 cKES</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTransactions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requiring guardian approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Guardians</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guardians.length}</div>
              <p className="text-xs text-muted-foreground mt-1">3 of {guardians.length} required for approval</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 w-full">
          <CardHeader>
            <CardTitle>Farm Agent</CardTitle>
            <CardDescription>
              Keep Safe assets working by enabling scheduled FX swaps and automated yield actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Guardians can configure swap thresholds and automation in the Farm Agent cockpit, then monitor performance directly from the Safe.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/farm-agent">
              <Button variant="secondary" className="gap-2">
                Go to Farm Agent
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Transactions</TabsTrigger>
            <TabsTrigger value="completed">Completed Transactions</TabsTrigger>
            <TabsTrigger value="guardians">Guardians</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingTransactions.map((tx) => (
              <Card key={tx.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{tx.title}</CardTitle>
                      <CardDescription>Proposed on {tx.date}</CardDescription>
                    </div>
                    <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{tx.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-lg font-bold">
                        {tx.amount} {tx.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Recipient</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Approvals</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${(tx.approvals / tx.requiredApprovals) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm ml-2">
                        {tx.approvals}/{tx.requiredApprovals}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleReject(tx.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(tx.id)}>
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTransactions.map((tx) => (
              <Card key={tx.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{tx.title}</CardTitle>
                      <CardDescription>Executed on {tx.executed}</CardDescription>
                    </div>
                    <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md">
                      <Check className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{tx.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-lg font-bold">
                        {tx.amount} {tx.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Recipient</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Approvals</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${(tx.approvals / tx.requiredApprovals) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm ml-2">
                        {tx.approvals}/{tx.requiredApprovals}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">View on Explorer</Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="guardians">
            <Card>
              <CardHeader>
                <CardTitle>FarmBlock Guardians</CardTitle>
                <CardDescription>Guardians manage the FarmBlock Safe through multisig governance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guardians.map((guardian) => (
                    <div key={guardian.address} className="flex justify-between items-center pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Shield className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{guardian.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {guardian.address.slice(0, 6)}...{guardian.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{guardian.role}</p>
                        <p className="text-sm text-muted-foreground">{guardian.transactions} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Propose New Guardian
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
