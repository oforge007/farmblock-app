"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Plus, CheckCircle, Clock, AlertCircle, ThumbsUp, ThumbsDown, Vote } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"
import { useActiveAccount } from "thirdweb/react"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"

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

// Initial task data with proposals
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

export default function TaskManager() {
  const [tasks, setTasks] = useState<FarmBlockTask[]>(initialTasks)
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
  const [newProposalDialogOpen, setNewProposalDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<FarmBlockTask | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isGuardian, setIsGuardian] = useState(false)
  const { connected, connect } = useWallet()
  const thirdwebAccount = useActiveAccount()

  useEffect(() => {
    // Check if user is a guardian (mock implementation)
    setIsGuardian(true) // For demo purposes
  }, [thirdwebAccount])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return null
    }
  }

  const getProposalStatus = (proposal: TaskProposal) => {
    const totalVotes = proposal.votes.for + proposal.votes.against
    const supportPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0

    if (proposal.status === "passed") {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Passed
        </Badge>
      )
    }
    if (proposal.status === "failed") {
      return (
        <Badge className="bg-red-100 text-red-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-100 text-blue-700">
        <Vote className="w-3 h-3 mr-1" />
        Voting ({supportPercentage.toFixed(0)}%)
      </Badge>
    )
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isGuardian) {
      alert("Only guardians can create tasks")
      return
    }
    alert("Task created successfully! It will appear in the task list.")
    setNewTaskDialogOpen(false)
  }

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) {
      await connect()
      return
    }
    alert("Proposal created! NFT holders and guardians can now vote on this proposal.")
    setNewProposalDialogOpen(false)
  }

  const handleVoteProposal = async (proposalId: string, vote: "for" | "against") => {
    alert(`You voted ${vote === "for" ? "for" : "against"} this proposal!`)
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "open") return task.status === "open"
    if (activeTab === "in-progress") return task.status === "in-progress"
    if (activeTab === "completed") return task.status === "completed"
    return true
  })

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">FarmBlock Tasks & Governance</h1>
            <p className="text-muted-foreground">Create tasks, propose candidates, and vote with your NFT</p>
          </div>
          {isGuardian && (
            <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    As a guardian, create a new task for the community to complete
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input id="task-title" placeholder="e.g., Plant Quinoa Seeds" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        placeholder="Detailed task description and requirements"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="task-reward">Reward Amount</Label>
                        <Input id="task-reward" type="number" placeholder="50" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="task-currency">Currency</Label>
                        <Select defaultValue="cUSD">
                          <SelectTrigger id="task-currency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cUSD">cUSD</SelectItem>
                            <SelectItem value="cEUR">cEUR</SelectItem>
                            <SelectItem value="cKES">cKES</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="task-location">Location</Label>
                        <Input id="task-location" placeholder="Kenya" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="task-deadline">Deadline</Label>
                        <Input id="task-deadline" type="date" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="min-support">Minimum Support Required (%)</Label>
                      <Input id="min-support" type="number" placeholder="15" min="1" max="100" required />
                      <p className="text-xs text-muted-foreground">
                        Percentage of votes needed for a proposal to be approved
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>
                        {task.farm} • {task.location} • {task.deadline}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(task.status)}
                      <p className="text-sm font-bold mt-2">
                        {task.reward} {task.currency}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{task.description}</p>

                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-muted-foreground">REQUIRED SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                      {task.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Task Proposals Section */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-sm">Proposals ({task.proposals.length})</h4>
                      {task.status === "open" && (
                        <Dialog open={newProposalDialogOpen} onOpenChange={setNewProposalDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTask(task)}
                              className="h-7"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Propose
                            </Button>
                          </DialogTrigger>
                          {selectedTask?.id === task.id && (
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Propose Candidate for {task.title}</DialogTitle>
                                <DialogDescription>
                                  Submit your proposal to complete this task. NFT holders and guardians will vote.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleCreateProposal}>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="proposal-title">Proposal Title</Label>
                                    <Input
                                      id="proposal-title"
                                      placeholder={`${task.title} - Your Name`}
                                      required
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="proposal-description">Description</Label>
                                    <Textarea
                                      id="proposal-description"
                                      placeholder="Why you're qualified and how you'll complete this task"
                                      rows={4}
                                      required
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="beneficiary">Payment Address</Label>
                                    <Input id="beneficiary" placeholder="0x..." required />
                                    <p className="text-xs text-muted-foreground">
                                      Wallet address to receive payment if approved
                                    </p>
                                  </div>
                                  <div className="p-3 bg-blue-50 rounded border border-blue-200 text-xs">
                                    <p className="text-blue-900">
                                      <strong>Voting Details:</strong> This proposal requires{" "}
                                      <strong>{task.minSupport}%</strong> support from NFT holders and guardians to pass.
                                      Voting period: 7 days.
                                    </p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">{connected ? "Submit Proposal" : "Connect to Propose"}</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          )}
                        </Dialog>
                      )}
                    </div>

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
                                  {getProposalStatus(proposal)}
                                </div>

                                <p className="text-xs text-muted-foreground mb-3">{proposal.description}</p>

                                {/* Voting Progress */}
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between text-xs">
                                    <span>
                                      Votes: {proposal.votes.for} FOR • {proposal.votes.against} AGAINST
                                    </span>
                                    <span className="font-semibold">
                                      {forPercentage.toFixed(1)}% / {proposal.minimumSupport}% needed
                                    </span>
                                  </div>
                                  <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200">
                                    <div
                                      className="bg-green-500"
                                      style={{ width: `${Math.min(forPercentage, 100)}%` }}
                                    />
                                    <div
                                      className="bg-red-500"
                                      style={{ width: `${Math.max(0, 100 - forPercentage)}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Voting Buttons */}
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

                                {proposal.userVoted && (
                                  <div className="text-xs text-muted-foreground p-2 bg-white rounded border">
                                    ✓ You have voted on this proposal
                                  </div>
                                )}

                                {passed && proposal.status === "active" && (
                                  <div className="text-xs text-green-700 p-2 bg-green-50 rounded border border-green-200">
                                    ✓ Voting threshold met! Guardians can now initiate payment from Safe.
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-3">No proposals yet. Be the first to propose!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No tasks found in this category</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {isGuardian && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Guardian Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800 mb-4">
                As a guardian, you can create tasks and initiate payments from the FarmBlock Safe for approved proposals.
              </p>
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-100">
                Go to Safe Wallet Manager
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <FooterMenu />
    </main>
  )
}
