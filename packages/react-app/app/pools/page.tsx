// packages/react-app/app/fxswap/page.tsx

=======



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
