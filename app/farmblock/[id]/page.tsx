"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMiniPay } from "@/hooks/use-minipay"
import { RegenerativeImage } from "@/components/regenerative-image"
import { Users, Database, Coins, Shield, Plus } from "lucide-react"

// Sample task pools data
const taskPools = [
  {
    id: 46,
    name: "Infrastructure",
    votingWeight: "Fixed",
    proposals: 2,
    funds: "0.7",
    minSupport: 10.55,
    collateralDeposit: 5,
    proposals: [
      {
        id: 4,
        title: "Gardens Discourse Instance",
        date: "26 Apr 2025",
        requestedAmount: 2700,
        currency: "cUSD",
        status: "active",
        support: 17.88,
        minSupport: 10.55,
        beneficiary: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        description: "Fund a Discourse instance for community discussions and governance proposals.",
        borderColor: "border-green-400",
      },
    ],
  },
  {
    id: 47,
    name: "Seed Purchase",
    votingWeight: "Fixed",
    proposals: 1,
    funds: "1.2",
    minSupport: 6.68,
    collateralDeposit: 10,
    proposals: [
      {
        id: 1,
        title: "DeVouch - Reputation System",
        date: "17 Apr 2025",
        requestedAmount: 3000,
        currency: "cUSD",
        status: "active",
        support: 23,
        minSupport: 6.68,
        beneficiary: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
        description: "Fund the development of a reputation system for farmers in the community.",
        borderColor: "border-orange-400",
      },
    ],
  },
]

// Sample proposal pools data
const proposalPools = [
  {
    id: 48,
    name: "Community Governance",
    votingWeight: "Fixed",
    proposals: 1,
    funds: "0.0",
    minSupport: 15.0,
    proposals: [
      {
        id: 2,
        title: "Add New Crop Categories",
        date: "20 Apr 2025",
        status: "active",
        support: 45,
        minSupport: 15.0,
        description: "Proposal to add new crop categories to the marketplace for better organization.",
        borderColor: "border-blue-400",
      },
    ],
  },
]

// Sample review pools data
const reviewPools = []

// Sample tasks from the Task page
const tasks = [
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
  },
  {
    id: 2,
    title: "Harvest Millet",
    farm: "Green Valley",
    location: "Ethiopia",
    reward: 75,
    currency: "cUSD",
    status: "in-progress",
    deadline: "2023-06-10",
    description: "Harvest 1 hectare of golden millet and prepare for processing.",
    skills: ["harvesting"],
    createdBy: "Farmer",
  },
]

export default function FarmBlockPage({ params }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newTransactionDialogOpen, setNewTransactionDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState("task-pool")
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false)
  const [createProposalDialogOpen, setCreateProposalDialogOpen] = useState(false)
  const [createPoolDialogOpen, setCreatePoolDialogOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState(null)
  const [poolType, setPoolType] = useState("task")
  const [guardianOnly, setGuardianOnly] = useState(false)
  const { connected, connect, pay } = useMiniPay()

  // In a real app, you would fetch the farmblock data based on the ID
  const farmblock = {
    id: params.id,
    name: "OxFarmBlock",
    location: "Kenya",
    image: "/images/sustainable-farm.jpeg",
    members: 0,
    pools: 1,
    staked: "0",
    registrationStake: "5.1",
    description: "A community of farmers in Kenya focused on sustainable agriculture and transparent governance.",
    mission:
      "Our mission is to empower local farmers through sustainable agricultural practices, transparent governance, and fair trade. We aim to combat hunger and drought by implementing innovative farming techniques and fostering community collaboration.",
    governanceRules:
      "1. All community decisions require a minimum of 15% support to pass.\n2. Task proposals must include clear deliverables and timelines.\n3. Funding requests must specify exact amounts and beneficiaries.\n4. Guardians are elected by community vote and serve 6-month terms.\n5. All financial transactions are executed through the community Safe and require multi-signature approval.",
  }

  const handleRegisterInCommunity = async () => {
    if (!connected) {
      await connect()
      return
    }

    try {
      // Here you would integrate with MiniPay to process the registration stake payment
      await pay({
        amount: Number.parseFloat(farmblock.registrationStake),
        currency: "cUSD",
        recipient: "0x123...", // Community's wallet address
        description: `Registration stake for ${farmblock.name}`,
      })

      alert("Registration successful! You are now a member of this community.")
      setRegistrationDialogOpen(false)
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    }
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

  const handleCreateProposal = async (e) => {
    e.preventDefault()
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with the blockchain to create a new proposal
    alert("Proposal created successfully! Please confirm the transaction in your wallet.")
    setCreateProposalDialogOpen(false)
  }

  const handleCreatePool = async (e) => {
    e.preventDefault()
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with the blockchain to create a new pool
    alert("Pool created successfully! Please confirm the transaction in your wallet.")
    setCreatePoolDialogOpen(false)
  }

  const openCreateProposalDialog = (pool, type) => {
    setSelectedPool(pool)
    setPoolType(type)
    setCreateProposalDialogOpen(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <RegenerativeImage src={farmblock.image} alt={farmblock.name} className="w-full h-full" />
            </div>
          </div>

          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{farmblock.name}</h1>
            <p className="text-muted-foreground mb-4">{farmblock.location}</p>

            <p className="mb-4">{farmblock.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Members: {farmblock.members}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <span>Pools: {farmblock.pools}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-muted-foreground" />
                <span>Staked tokens: {farmblock.staked} cUSD</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Registration stake: {farmblock.registrationStake} cUSD</span>
              </div>
            </div>

            <Dialog open={registrationDialogOpen} onOpenChange={setRegistrationDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Register in community</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register in {farmblock.name}</DialogTitle>
                  <DialogDescription>
                    Join this community by depositing the registration stake of {farmblock.registrationStake} cUSD.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="rounded-lg bg-muted p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Registration Stake:</span>
                      <span className="font-bold">{farmblock.registrationStake} cUSD</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This stake is required to join the community and participate in governance decisions. It helps
                      ensure commitment and prevent spam.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By registering, you agree to abide by the community's governance rules and participate in a
                    constructive manner.
                  </p>
                </div>
                <DialogFooter>
                  <Button onClick={handleRegisterInCommunity}>
                    {connected ? "Confirm Registration" : "Connect Wallet to Register"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4 flex overflow-x-auto pb-px">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="yield">Yield</TabsTrigger>
            <TabsTrigger value="safe">Safe</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>About {farmblock.name}</CardTitle>
                <CardDescription>Community overview and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This FarmBlock community is focused on sustainable agriculture practices and transparent governance.
                  Members can participate in funding decisions, task creation, and stablecoin saving strategies.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0.00 cUSD</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{tasks.length}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">NFTs Minted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-lg font-semibold mb-3">Recent Tasks</h3>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {task.farm} • Deadline: {task.deadline}
                            </p>
                          </div>
                          <Badge
                            className={
                              task.status === "open"
                                ? "bg-blue-100 text-blue-700"
                                : task.status === "in-progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2 line-clamp-2">{task.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex flex-wrap gap-1">
                            {task.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="bg-green-50 text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="font-medium">
                            {task.reward} {task.currency}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Mission & Governance</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-lg mb-2">Mission Statement</h4>
                      <p className="text-muted-foreground">{farmblock.mission || "No mission statement provided."}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-lg mb-2">Governance Rules</h4>
                      {farmblock.governanceRules ? (
                        <div className="bg-muted rounded-md p-4">
                          {farmblock.governanceRules.split("\n").map((rule, index) => (
                            <p key={index} className="mb-2 last:mb-0">
                              {rule}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No governance rules provided.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="yield">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Stablecoin Saving Strategies</CardTitle>
                    <CardDescription>Earn returns on stablecoin deposits through various strategies</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-lg mb-3">Available Strategies</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <Card className="border-green-100 hover:border-green-300 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Conservative Strategy</CardTitle>
                          <CardDescription>cUSD Yield Pool • 5.2% APY</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Risk Level</span>
                            <div className="flex">
                              <span className="bg-green-500 w-3 h-3 rounded-full mr-1"></span>
                              <span className="bg-gray-200 w-3 h-3 rounded-full mr-1"></span>
                              <span className="bg-gray-200 w-3 h-3 rounded-full"></span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Total Deposited</span>
                            <span className="font-medium">0.00 cUSD</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Low-risk strategy focusing on stable returns through Mento stablecoin yield pools.
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full">Deposit</Button>
                        </CardFooter>
                      </Card>

                      <Card className="border-yellow-100 hover:border-yellow-300 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Balanced Strategy</CardTitle>
                          <CardDescription>cEUR Yield Pool • 7.8% APY</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Risk Level</span>
                            <div className="flex">
                              <span className="bg-yellow-500 w-3 h-3 rounded-full mr-1"></span>
                              <span className="bg-yellow-500 w-3 h-3 rounded-full mr-1"></span>
                              <span className="bg-gray-200 w-3 h-3 rounded-full"></span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Total Deposited</span>
                            <span className="font-medium">0.00 cEUR</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Medium-risk strategy with higher returns through diversified stablecoin pools.
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full">Deposit</Button>
                        </CardFooter>
                      </Card>

                      <Card className="border-orange-100 hover:border-orange-300 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Growth Strategy</CardTitle>
                          <CardDescription>cKES Yield Pool • 9.1% APY</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Risk Level</span>
                            <div className="flex">
                              <span className="bg-orange-500 w-3 h-3 rounded-full mr-1"></span>
                              <span className="bg-orange-500 w-3 h-3 rounded-full mr-1"></span>
                              <span className="bg-orange-500 w-3 h-3 rounded-full"></span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Total Deposited</span>
                            <span className="font-medium">0.00 cKES</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Higher-risk strategy aiming for maximum returns through innovative yield mechanisms.
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full">Deposit</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-lg mb-3">My Active Strategies</p>
                    <p className="text-muted-foreground">You have no active saving strategies</p>
                    <Button variant="outline" className="mt-4">
                      View All Strategies
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safe">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>FarmBlock Safe</CardTitle>
                    <CardDescription>Community-driven peer bank for funding and governance</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Safe Balance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0.00 cUSD</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Guardians</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <p className="font-medium">Recent Transactions</p>
                    <p className="text-muted-foreground">No transactions available</p>
                  </div>

                  <div className="flex justify-end">
                    <Dialog open={newTransactionDialogOpen} onOpenChange={setNewTransactionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          New Transaction
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create New Transaction</DialogTitle>
                          <DialogDescription>
                            Create a new transaction proposal for the FarmBlock Safe multisig wallet.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="grid gap-4 mb-4">
                            <Label>Transaction Type</Label>
                            <div className="grid grid-cols-1 gap-2">
                              <Button
                                variant={transactionType === "task-pool" ? "default" : "outline"}
                                className="justify-start h-auto py-3"
                                onClick={() => setTransactionType("task-pool")}
                              >
                                <div className="flex flex-col items-start text-left">
                                  <span className="font-medium">Fund Task Pool</span>
                                  <span className="text-xs font-normal text-muted-foreground">
                                    Allocate funds to a task reward pool
                                  </span>
                                </div>
                              </Button>
                              <Button
                                variant={transactionType === "saving-strategy" ? "default" : "outline"}
                                className="justify-start h-auto py-3"
                                onClick={() => setTransactionType("saving-strategy")}
                              >
                                <div className="flex flex-col items-start text-left">
                                  <span className="font-medium">Saving Strategy</span>
                                  <span className="text-xs font-normal text-muted-foreground">
                                    Create or fund a stablecoin saving strategy
                                  </span>
                                </div>
                              </Button>
                            </div>
                          </div>

                          {transactionType === "task-pool" && (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="pool-select">Select Task Pool</Label>
                                <Select>
                                  <SelectTrigger id="pool-select">
                                    <SelectValue placeholder="Select a task pool" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {taskPools.map((pool) => (
                                      <SelectItem key={pool.id} value={pool.id.toString()}>
                                        {pool.name} (#{pool.id})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input id="amount" type="number" placeholder="0.00" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="currency">Currency</Label>
                                  <Select defaultValue="cUSD">
                                    <SelectTrigger id="currency">
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cUSD">cUSD</SelectItem>
                                      <SelectItem value="cEUR">cEUR</SelectItem>
                                      <SelectItem value="cKES">cKES</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  placeholder="Describe the purpose of this transaction"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {transactionType === "saving-strategy" && (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="strategy-type">Action</Label>
                                <Select>
                                  <SelectTrigger id="strategy-type">
                                    <SelectValue placeholder="Select action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="create">Create New Saving Strategy</SelectItem>
                                    <SelectItem value="fund">Fund Existing Strategy</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="strategy-select">Strategy Type</Label>
                                <Select>
                                  <SelectTrigger id="strategy-select">
                                    <SelectValue placeholder="Select a strategy" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="conservative">Conservative (5.2% APY)</SelectItem>
                                    <SelectItem value="balanced">Balanced (7.8% APY)</SelectItem>
                                    <SelectItem value="growth">Growth (9.1% APY)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="strategy-amount">Amount</Label>
                                  <Input id="strategy-amount" type="number" placeholder="0.00" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="strategy-currency">Currency</Label>
                                  <Select defaultValue="cUSD">
                                    <SelectTrigger id="strategy-currency">
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cUSD">cUSD</SelectItem>
                                      <SelectItem value="cEUR">cEUR</SelectItem>
                                      <SelectItem value="cKES">cKES</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="strategy-description">Description</Label>
                                <Textarea
                                  id="strategy-description"
                                  placeholder="Describe the purpose of this strategy"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleCreateTransaction}>
                            {connected ? "Create Transaction" : "Connect Wallet to Create"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <FooterMenu />

      {/* Create Pool Dialog with Task Pool / Proposal Pool options */}
      <Dialog open={createPoolDialogOpen} onOpenChange={setCreatePoolDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Pool</DialogTitle>
            <DialogDescription>Create a new pool for your community governance</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePool}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Pool Type</Label>
                <RadioGroup defaultValue="task" onValueChange={setPoolType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="task" id="task" />
                    <Label htmlFor="task" className="cursor-pointer">
                      Task Pool
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="proposal" id="proposal" />
                    <Label htmlFor="proposal" className="cursor-pointer">
                      Proposal Pool
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pool-name">Pool Name</Label>
                <Input id="pool-name" placeholder="Enter a descriptive name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pool-description">Description</Label>
                <Textarea id="pool-description" placeholder="Describe the purpose of this pool" rows={3} required />
              </div>

              {poolType === "task" && (
                <div className="grid gap-2">
                  <Label htmlFor="token-address">Pool Token (ERC20) Address</Label>
                  <Input id="token-address" placeholder="0x..." />
                  <p className="text-xs text-muted-foreground">
                    The ERC20 token address that will receive funding for rewards from the FarmBlock Safe
                  </p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="min-support">Minimum Support (%)</Label>
                <Input id="min-support" type="number" placeholder="15" min="1" max="100" required />
                <p className="text-xs text-muted-foreground">
                  The minimum percentage of support required for a proposal to pass
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="collateral">Collateral Deposit (cUSD)</Label>
                <Input id="collateral" type="number" placeholder="5" min="0" step="0.1" required />
                <p className="text-xs text-muted-foreground">
                  The amount of cUSD required to create a proposal in this pool
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="guardian-only" checked={guardianOnly} onCheckedChange={setGuardianOnly} />
                <Label htmlFor="guardian-only" className="text-sm">
                  Guardian-only voting (restrict voting to community guardians)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{connected ? "Create Pool" : "Connect Wallet to Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
