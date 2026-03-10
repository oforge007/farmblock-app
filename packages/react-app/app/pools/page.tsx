// packages/react-app/app/fxswap/page.tsx

<<<<<<< HEAD
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Trash2, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { parseEther } from "viem";
import { config } from "@/wagmi-config"; // Adjust path as needed
import { FX_SWAP_AGENT_ADDRESS } from "@/constants/contracts";
import { CUSD_ADDRESS, CELO_ADDRESS } from "@/constants/tokens"; // Add these if not present

interface Trigger {
  id: string;
  type: "buy" | "sell"; // buy = cUSD → CELO (accumulate for farm staking), sell = CELO → cUSD (harvest/liquidate)
  price: string; // Target CELO price in USD (e.g., "0.92")
  amount: string; // Amount in cUSD
  status: "pending" | "active" | "executed" | "cancelled";
}

const FXSwapAgentABI = [
  // Minimal ABI for executeFXSwap
  {
    name: "executeFXSwap",
    type: "function",
    inputs: [
      { name: "_user", type: "address" },
      { name: "_tokenIn", type: "address" },
      { name: "_tokenOut", type: "address" },
      { name: "_amountIn", type: "uint256" },
      { name: "_minAmountOut", type: "uint256" },
      { name: "_useMento", type: "bool" },
      { name: "_swapData", type: "bytes" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
  },
] as const;

export default function FXSwapPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const [triggers, setTriggers] = useState<Trigger[]>([
    // Sample triggers for farm users (e.g., auto-buy CELO dips for staking)
    { id: "1", type: "buy", price: "0.90", amount: "500", status: "active" },
    { id: "2", type: "sell", price: "1.10", amount: "1000", status: "pending" },
  ]);
  const [newPrice, setNewPrice] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"buy" | "sell">("buy");
  const [isLoading, setIsLoading] = useState(false);

  const addTrigger = () => {
    if (!newPrice || !newAmount || !isConnected) return;

    const trigger: Trigger = {
      id: Date.now().toString(),
      type: newType,
      price: newPrice,
      amount: newAmount,
      status: "pending",
    };

    setTriggers((prev) => [...prev, trigger]);
    setNewPrice("");
    setNewAmount("");
  };

  const removeTrigger = (id: string) => {
    setTriggers((prev) => prev.filter((t) => t.id !== id));
  };

  // AI Agent simulation: Executes when price hits target (in production, call from backend)
  const executeTrigger = async (trigger: Trigger) => {
    if (!address || (chainId !== 42220 && chainId !== 44787)) {
      alert("Connect to Celo Mainnet/Alfajores for FarmBlock swaps");
      return;
    }

    setIsLoading(true);
    try {
      const amountIn = parseEther(trigger.amount);
      const targetPrice = Number(trigger.price);
      const slippageTolerance = 0.005; // 0.5%

      // Farm-specific: Buy CELO for staking pools, sell for cUSD harvest
      const minPrice = trigger.type === "buy"
        ? targetPrice * (1 - slippageTolerance)
        : targetPrice * (1 + slippageTolerance);

      const minAmountOut = trigger.type === "buy"
        ? parseEther((Number(trigger.amount) / minPrice).toFixed(6)) // cUSD → CELO
        : parseEther((Number(trigger.amount) * minPrice).toFixed(6)); // CELO → cUSD

      const tokenIn = trigger.type === "buy" ? CUSD_ADDRESS : CELO_ADDRESS;
      const tokenOut = trigger.type === "buy" ? CELO_ADDRESS : CUSD_ADDRESS;

      const hash = await writeContract(config, {
        address: FX_SWAP_AGENT_ADDRESS,
        abi: FXSwapAgentABI,
        functionName: "executeFXSwap",
        args: [
          address,
          tokenIn,
          tokenOut,
          amountIn,
          minAmountOut,
          true, // Use Mento for best Celo rates
          "0x",
        ],
      });

      await waitForTransactionReceipt(config, { hash });

      // Update status and simulate AI execution
      setTriggers((prev) =>
        prev.map((t) => (t.id === trigger.id ? { ...t, status: "executed" } : t))
      );

      alert(
        `AI Agent Executed! ${trigger.type.toUpperCase()} ${trigger.amount} cUSD @ ~$${trigger.price} CELO\nReady for FarmBlock staking/harvest.`
      );
    } catch (error: any) {
      console.error(error);
      alert(`Swap failed: ${error.shortMessage || error.message}`);
      setTriggers((prev) =>
        prev.map((t) => (t.id === trigger.id ? { ...t, status: "pending" } : t))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FarmBlock FX Swap Triggers</h1>
          <p className="text-muted-foreground mt-2">
            Auto-swap cUSD ↔ CELO with AI agents. Buy low for farm staking, sell high for harvests.
          </p>
        </div>
        <Zap className="h-8 w-8 text-green-500 animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Triggers Setup Card */}
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">AI Trigger Setup</h2>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-600">AI Live</span>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              Your FarmBlock AI monitors CELO prices 24/7 via oracles. Triggers execute via Mento for optimal rates on Celo.
            </div>
          </div>

          {/* Active Triggers */}
          {triggers.length > 0 && (
            <div className="mb-6 space-y-4">
              {triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-bold flex-shrink-0 ${
                        trigger.type === "buy"
                          ? "bg-green-500/20 text-green-600"
                          : "bg-red-500/20 text-red-600"
                      }`}
                    >
                      {trigger.type.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono font-semibold text-foreground">
                        ${trigger.price} CELO
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Amount: {trigger.amount} cUSD
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        Status: {trigger.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {trigger.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => executeTrigger(trigger)}
                        disabled={isLoading}
                        variant="outline"
                      >
                        Test AI Trigger
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrigger(trigger.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Trigger Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Add Farm Trigger</h3>
            {!isConnected ? (
              <p className="text-sm text-destructive text-center py-4">
                Connect your Celo wallet (Valora) to set triggers
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Action
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as "buy" | "sell")}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      disabled={isLoading}
                    >
                      <option value="buy">Buy CELO (Stake in Pools)</option>
                      <option value="sell">Sell CELO (Harvest to cUSD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Target Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.1"
                      placeholder="0.92"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">
                      Amount (cUSD)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="10"
                      placeholder="500"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  onClick={addTrigger}
                  disabled={!newPrice || !newAmount || isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Trigger
                </Button>
              </>
            )}
          </div>

          {triggers.length > 0 && (
            <div className="mt-6 p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{triggers.length} Triggers Active</p>
                  <p className="text-xs text-muted-foreground">AI monitoring for FarmBlock optimization</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          )}
        </Card>

        {/* Info Card: How it Works for Farmers */}
        <Card className="border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">How AI Triggers Boost Your FarmBlock</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Auto-Buy on Dips</h3>
                <p className="text-muted-foreground">
                  When CELO drops to your target, AI swaps cUSD to CELO instantly. Stake the CELO in FarmBlock pools for higher yields.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingDown className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Auto-Sell on Peaks</h3>
                <p className="text-muted-foreground">
                  Harvest profits: Swap CELO back to cUSD when prices rise, funding seeds, tools, or community shares.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Powered by Celo & Mento</h3>
                <p className="text-muted-foreground">
                  Low fees, fast execution. Ready for ZK Celo and Mento v3. Your triggers sync with FarmBlock staking dashboard.
                </p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6">
            Learn More About FarmBlock Pools
          </Button>
        </Card>
      </div>
    </div>
  );
=======
import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, Vote, Search, ArrowRight, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"
import { Progress } from "@/components/ui/progress"

interface TaskProposal {
  id: string
  taskId: number
  title: string
  description: string
  beneficiary: string
  amount: number
  currency: string
  proposedBy: string
  createdAt: string
  votingDeadline: string
  status: "active" | "passed" | "failed"
  votes: {
    for: number
    against: number
  }
  userVoted?: boolean
  minimumSupport: number
}

interface FarmBlockTask {
  id: number
  title: string
  farm: string
  location: string
  reward: number
  currency: string
  status: "open" | "in-progress" | "completed"
  deadline: string
  description: string
  skills: string[]
  createdBy: string
  minSupport: number
  proposals: TaskProposal[]
}

// Initial task data synchronized with tasks page
const initialTasks: FarmBlockTask[] = [
  {
    id: 1,
    title: "Plant Quinoa Seeds",
    farm: "Sunshine Farms",
    location: "Kenya",
    reward: 50,
    currency: "cUSD",
    status: "open",
    deadline: "2023-06-15",
    description: "Plant 2 hectares of quinoa seeds following organic farming practices.",
    skills: ["planting", "organic"],
    createdBy: "Guardian",
    minSupport: 15,
    proposals: [
      {
        id: "prop-1-1",
        taskId: 1,
        title: "Quinoa Planting - John's Team",
        description: "John Kipchoge and his team will plant 2 hectares of quinoa seeds with premium organic methods",
        beneficiary: "0x1234567890123456789012345678901234567890",
        amount: 50,
        currency: "cUSD",
        proposedBy: "0xabcd1234...",
        createdAt: "2023-06-01",
        votingDeadline: "2023-06-08",
        status: "active",
        votes: { for: 35, against: 8 },
        minimumSupport: 15,
      },
    ],
  },
  {
    id: 2,
    title: "Harvest Millet",
    farm: "Green Valley",
    location: "Ethiopia",
    reward: 75,
    currency: "cUSD",
    status: "open",
    deadline: "2023-06-10",
    description: "Harvest 1 hectare of golden millet and prepare for processing.",
    skills: ["harvesting"],
    createdBy: "Guardian",
    minSupport: 15,
    proposals: [],
  },
  {
    id: 3,
    title: "Irrigation System Maintenance",
    farm: "Mountain Heights",
    location: "Tanzania",
    reward: 30,
    currency: "cUSD",
    status: "open",
    deadline: "2023-05-30",
    description: "Check and repair the drip irrigation system for the goji berry field.",
    skills: ["maintenance", "irrigation"],
    createdBy: "Guardian",
    minSupport: 15,
    proposals: [],
  },
]


export default function PoolsPage() {
  const [tasks, setTasks] = useState<FarmBlockTask[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { connected, connect } = useWallet()

  const handleVoteProposal = async (proposalId: string, vote: "for" | "against") => {
    alert(`You voted ${vote === "for" ? "for" : "against"} this proposal!`)
  }

  const handleInitiatePayment = async (proposal: TaskProposal) => {
    alert(`Opening Safe wallet manager to initiate payment to ${proposal.beneficiary.slice(0, 10)}...`)
  }

  // Get active proposals for voting
  const allActiveProposals = tasks
    .flatMap((task) =>
      task.proposals.map((proposal) => ({
        ...proposal,
        taskTitle: task.title,
        taskReward: task.reward,
        taskCurrency: task.currency,
      })),
    )
    .filter((p) => p.status === "active")

  // Get passed proposals ready for payment
  const passedProposals = tasks
    .flatMap((task) =>
      task.proposals.map((proposal) => ({
        ...proposal,
        taskTitle: task.title,
        taskReward: task.reward,
        taskCurrency: task.currency,
      })),
    )
    .filter((p) => {
      const totalVotes = p.votes.for + p.votes.against
      const forPercentage = totalVotes > 0 ? (p.votes.for / totalVotes) * 100 : 0
      return forPercentage >= p.minimumSupport
    })

  // Filter tasks based on search
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "open" && task.status === "open") ||
      (activeTab === "with-proposals" && task.proposals.length > 0) ||
      (activeTab === "no-proposals" && task.proposals.length === 0)
    return matchesSearch && matchesTab
  })

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Task Pools & Voting</h1>
          <p className="text-muted-foreground">
            Browse available tasks, view proposals, and vote with your farmblock NFT
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks by name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Voting Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Active Proposals</p>
              <p className="text-3xl font-bold text-blue-600">{allActiveProposals.length}</p>
              <p className="text-xs text-muted-foreground mt-2">Awaiting your vote</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Ready for Payment</p>
              <p className="text-3xl font-bold text-green-600">{passedProposals.length}</p>
              <p className="text-xs text-muted-foreground mt-2">Voting threshold met</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Open Tasks</p>
              <p className="text-3xl font-bold text-orange-600">{tasks.filter((t) => t.status === "open").length}</p>
              <p className="text-xs text-muted-foreground mt-2">Available for proposals</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="with-proposals">With Proposals ({tasks.filter((t) => t.proposals.length > 0).length})</TabsTrigger>
            <TabsTrigger value="no-proposals">Need Proposals ({tasks.filter((t) => t.proposals.length === 0).length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tasks and Proposals */}
        <div className="space-y-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.farm} • {task.location} • Deadline: {task.deadline}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          task.status === "open"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-yellow-50 text-yellow-700"
                        }
                      >
                        {task.status}
                      </Badge>
                      <p className="text-sm font-bold mt-2">
                        {task.reward} {task.currency}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">REQUIRED SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                      {task.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Proposals Section */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="font-semibold text-sm mb-4">Proposals ({task.proposals.length})</p>

                    {task.proposals.length > 0 ? (
                      <div className="space-y-3">
                        {task.proposals.map((proposal) => {
                          const totalVotes = proposal.votes.for + proposal.votes.against
                          const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0
                          const passed = forPercentage >= proposal.minimumSupport

                          return (
                            <Card key={proposal.id} className="bg-muted/50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{proposal.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Proposed by {proposal.proposedBy.slice(0, 10)}... •{" "}
                                      <code className="text-xs bg-white px-1 rounded">
                                        {proposal.beneficiary.slice(0, 8)}...
                                      </code>
                                    </p>
                                  </div>
                                  {proposal.status === "active" && (
                                    <Badge className="bg-blue-100 text-blue-700">
                                      <Vote className="w-3 h-3 mr-1" />
                                      Voting
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground mb-3">{proposal.description}</p>

                                {/* Voting Progress */}
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between text-xs">
                                    <span>
                                      {proposal.votes.for} FOR • {proposal.votes.against} AGAINST
                                    </span>
                                    <span className="font-semibold">
                                      {forPercentage.toFixed(1)}% / {proposal.minimumSupport}% needed
                                    </span>
                                  </div>
                                  <Progress value={forPercentage} className="h-2" />
                                </div>

                                {/* Voting Actions */}
                                {proposal.status === "active" && !proposal.userVoted && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 h-8"
                                      onClick={() => handleVoteProposal(proposal.id, "for")}
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      Vote For
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 h-8"
                                      onClick={() => handleVoteProposal(proposal.id, "against")}
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      Vote Against
                                    </Button>
                                  </div>
                                )}

                                {passed && (
                                  <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200 text-xs text-green-700">
                                    <span>✓ Threshold met - Ready for guardian payout</span>
                                    <Button
                                      size="sm"
                                      className="h-6 bg-green-600 hover:bg-green-700 text-xs"
                                      onClick={() => handleInitiatePayment(proposal)}
                                    >
                                      Initiate Payment
                                      <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                  </div>
                                )}

                                {proposal.userVoted && (
                                  <div className="text-xs text-muted-foreground p-2 bg-white rounded border">
                                    ✓ You have voted on this proposal
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4 bg-blue-50 rounded border border-blue-200">
                        <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-900">No proposals yet for this task</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Go to the Tasks page to create a proposal for this opportunity
                        </p>
                        <Link href="/tasks">
                          <Button size="sm" className="mt-3" variant="outline">
                            Visit Tasks Page
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No tasks match your search</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Link to Tasks Page */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-blue-900">Want to submit your own proposal?</p>
              <p className="text-sm text-blue-700 mt-1">Go to the Tasks page to create proposals and compete for task rewards</p>
            </div>
            <Link href="/tasks">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Go to Tasks
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <FooterMenu />
    </main>
  )
>>>>>>> 74181d5 (Add search/filter and i18n support)
}
