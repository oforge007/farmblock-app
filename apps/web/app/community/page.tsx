"use client"

import { useState } from "react"
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
import { Users, Plus, Check, Clock, Shield, X } from "lucide-react"
import { useMiniPay } from "@/hooks/use-minipay"
import { MainNav } from "@/components/main-nav"

// Sample community data
const communities = [
  {
    id: 1,
    name: "Nairobi Farmers Circle",
    location: "Kenya",
    members: 24,
    guardians: 3,
    description: "A community of farmers in Nairobi focused on sustainable quinoa and millet farming.",
    values: ["Sustainability", "Transparency", "Community Empowerment"],
    status: "active",
  },
  {
    id: 2,
    name: "Addis Ababa Growers",
    location: "Ethiopia",
    members: 18,
    guardians: 3,
    description: "Ethiopian farmers specializing in traditional grains and sustainable agriculture.",
    values: ["Sustainability", "Transparency", "Community Empowerment"],
    status: "active",
  },
  {
    id: 3,
    name: "Arusha Mountain Farmers",
    location: "Tanzania",
    members: 15,
    guardians: 3,
    description: "High-altitude farmers producing specialty crops with unique flavor profiles.",
    values: ["Sustainability", "Transparency", "Community Empowerment"],
    status: "active",
  },
]

// Sample proposals data
const proposals = [
  {
    id: 1,
    title: "Fund Irrigation System for Sunshine Farms",
    community: "Nairobi Farmers Circle",
    description: "Proposal to fund a new drip irrigation system for Sunshine Farms to improve water efficiency.",
    amount: 500,
    currency: "cUSD",
    status: "active",
    votes: { yes: 15, no: 2 },
    deadline: "2023-06-15",
  },
  {
    id: 2,
    title: "Withdraw from Yield Pool for Seed Purchase",
    community: "Nairobi Farmers Circle",
    description: "Proposal to withdraw 200 cUSD from the yield pool to purchase drought-resistant seeds.",
    amount: 200,
    currency: "cUSD",
    status: "active",
    votes: { yes: 12, no: 5 },
    deadline: "2023-06-10",
  },
  {
    id: 3,
    title: "Elect New Guardian for Addis Ababa Growers",
    community: "Addis Ababa Growers",
    description: "Proposal to elect Sarah as a new Guardian for the Addis Ababa Growers community.",
    status: "completed",
    votes: { yes: 14, no: 1 },
    deadline: "2023-05-30",
    result: "approved",
  },
]

export default function Community() {
  const [newCommunityDialogOpen, setNewCommunityDialogOpen] = useState(false)
  const [newProposalDialogOpen, setNewProposalDialogOpen] = useState(false)
  const { connected, connect } = useMiniPay()

  const handleCreateCommunity = async () => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with Gardens V2 to create a new community
    alert("Community creation initiated! Please confirm the transaction in your wallet.")
    setNewCommunityDialogOpen(false)
  }

  const handleCreateProposal = async () => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with Gardens V2 to create a new proposal
    alert("Proposal creation initiated! Please confirm the transaction in your wallet.")
    setNewProposalDialogOpen(false)
  }

  const handleVote = async (proposalId, vote) => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with Gardens V2 to vote on a proposal
    alert(`Vote ${vote} on proposal ${proposalId} recorded! Please confirm the transaction in your wallet.`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <MainNav />

      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">FarmBlock Communities</h1>
        <p className="text-muted-foreground mb-8">
          Create and join FarmBlock communities using Gardens V2's Circles governance model. Communities are governed by
          elected Guardians and operate based on shared values of sustainability, transparency, and community
          empowerment.
        </p>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Gardens V2 Governance</h2>
          <Dialog open={newCommunityDialogOpen} onOpenChange={setNewCommunityDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Community
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
                <DialogDescription>
                  Create a new FarmBlock community using Gardens V2's Circles governance model.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="community-name">Community Name</Label>
                  <Input id="community-name" placeholder="Enter community name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="community-location">Location</Label>
                  <Input id="community-location" placeholder="City, Country" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="community-description">Description</Label>
                  <Textarea id="community-description" placeholder="Describe your community and its goals" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="community-values">Values</Label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Sustainability</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Transparency</Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Community Empowerment</Badge>
                    <Button variant="outline" size="sm" className="h-6">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Value
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="community-guardians">Initial Guardians (addresses)</Label>
                  <Textarea
                    id="community-guardians"
                    placeholder="Enter wallet addresses of initial guardians (one per line)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateCommunity}>
                  {connected ? "Create Community" : "Connect Wallet to Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="communities" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="proposals">Governance Proposals</TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="space-y-4">
            {communities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription>{community.location}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{community.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{community.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Members</p>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{community.members} members</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Guardians</p>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{community.guardians} guardians</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Values</p>
                    <div className="flex flex-wrap gap-2">
                      {community.values.map((value) => (
                        <Badge key={value} variant="outline" className="bg-green-50">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">View Details</Button>
                  <Button>Join Community</Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="proposals" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={newProposalDialogOpen} onOpenChange={setNewProposalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Proposal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Proposal</DialogTitle>
                    <DialogDescription>
                      Create a new governance proposal for your FarmBlock community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="proposal-title">Proposal Title</Label>
                      <Input id="proposal-title" placeholder="Enter proposal title" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proposal-community">Community</Label>
                      <Select>
                        <SelectTrigger id="proposal-community">
                          <SelectValue placeholder="Select community" />
                        </SelectTrigger>
                        <SelectContent>
                          {communities.map((community) => (
                            <SelectItem key={community.id} value={community.id.toString()}>
                              {community.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proposal-description">Description</Label>
                      <Textarea id="proposal-description" placeholder="Describe your proposal in detail" rows={3} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="proposal-type">Proposal Type</Label>
                      <Select>
                        <SelectTrigger id="proposal-type">
                          <SelectValue placeholder="Select proposal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="funding">Funding Request</SelectItem>
                          <SelectItem value="withdrawal">Yield Pool Withdrawal</SelectItem>
                          <SelectItem value="guardian">Guardian Election</SelectItem>
                          <SelectItem value="parameter">Parameter Change</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="proposal-amount">Amount (if applicable)</Label>
                        <Input id="proposal-amount" type="number" placeholder="0.00" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="proposal-currency">Currency</Label>
                        <Select defaultValue="cUSD">
                          <SelectTrigger id="proposal-currency">
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
                      <Label htmlFor="proposal-deadline">Voting Deadline</Label>
                      <Input id="proposal-deadline" type="date" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateProposal}>
                      {connected ? "Create Proposal" : "Connect Wallet to Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{proposal.title}</CardTitle>
                      <CardDescription>{proposal.community}</CardDescription>
                    </div>
                    <Badge
                      className={
                        proposal.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : proposal.result === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {proposal.status === "active" ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : proposal.result === "approved" ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      {proposal.status === "active" ? "Active" : proposal.result}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{proposal.description}</p>
                  {proposal.amount && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-lg font-bold">
                          {proposal.amount} {proposal.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm">{proposal.deadline}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Votes</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Yes</span>
                          <span>{proposal.votes.yes}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${(proposal.votes.yes / (proposal.votes.yes + proposal.votes.no)) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>No</span>
                          <span>{proposal.votes.no}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-red-600 h-2.5 rounded-full"
                            style={{
                              width: `${(proposal.votes.no / (proposal.votes.yes + proposal.votes.no)) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {proposal.status === "active" && (
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleVote(proposal.id, "no")}
                    >
                      Vote No
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleVote(proposal.id, "yes")}>
                      Vote Yes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
