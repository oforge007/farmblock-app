"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Card, CardContent } from "@/components/ui/card"
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
import { ExpandablePool } from "@/components/expandable-pool"
import { useWallet } from "@/hooks/use-minipay"
import { Plus, Search } from "lucide-react"

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

export default function PoolsPage() {
  const [createProposalDialogOpen, setCreateProposalDialogOpen] = useState(false)
  const [createPoolDialogOpen, setCreatePoolDialogOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState(null)
  const [poolType, setPoolType] = useState("task")
  const [guardianOnly, setGuardianOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { connected, connect } = useWallet()

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

  // Filter pools based on search query
  const filteredTaskPools = taskPools.filter((pool) => pool.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredProposalPools = proposalPools.filter((pool) =>
    pool.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Pools</h1>
            <p className="text-muted-foreground">Create and manage task pools and proposals for your community</p>
          </div>
          <Dialog open={createPoolDialogOpen} onOpenChange={setCreatePoolDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Pool
              </Button>
            </DialogTrigger>
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
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search pools..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">Task Pools ({filteredTaskPools.length})</h2>
            {filteredTaskPools.length > 0 ? (
              filteredTaskPools.map((pool) => (
                <ExpandablePool key={pool.id} pool={pool} type="task" onCreateProposal={openCreateProposalDialog} />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No task pools found</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-blue-500 mb-4">Proposal Pools ({filteredProposalPools.length})</h2>
            {filteredProposalPools.length > 0 ? (
              filteredProposalPools.map((pool) => (
                <ExpandablePool key={pool.id} pool={pool} type="proposal" onCreateProposal={openCreateProposalDialog} />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No proposal pools found</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-green-500 mb-4">Recent Tasks</h2>
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
          </div>
        </div>

        {/* Create Proposal Dialog */}
        <Dialog open={createProposalDialogOpen} onOpenChange={setCreateProposalDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create {poolType === "task" ? "Task" : "Signal"} Proposal</DialogTitle>
              <DialogDescription>
                {poolType === "task"
                  ? `Create a new funding proposal in the ${selectedPool?.name} pool. A collateral deposit of ${selectedPool?.collateralDeposit} cUSD is required.`
                  : `Create a new signal proposal in the ${selectedPool?.name} pool.`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProposal}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="proposal-title">Proposal Title</Label>
                  <Input id="proposal-title" placeholder="Enter a clear, descriptive title" required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="proposal-description">Proposal Description</Label>
                  <Textarea
                    id="proposal-description"
                    placeholder="Describe your proposal in detail"
                    rows={4}
                    required
                  />
                </div>

                {poolType === "task" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="requested-amount">Requested Amount</Label>
                        <Input id="requested-amount" type="number" placeholder="0.00" required />
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
                      <Label htmlFor="beneficiary">Beneficiary Address</Label>
                      <Input id="beneficiary" placeholder="0x..." required />
                      <p className="text-xs text-muted-foreground">
                        The address that will receive the funds if the proposal passes
                      </p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Collateral Deposit:</span>
                        <span className="text-sm font-bold">{selectedPool?.collateralDeposit} cUSD</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This deposit is required to create a proposal and will be returned if the proposal passes.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">{connected ? "Create Proposal" : "Connect Wallet to Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <FooterMenu />
    </main>
  )
}
