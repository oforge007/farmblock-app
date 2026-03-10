"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
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
import { useWallet } from "@/hooks/use-minipay"
import { RegenerativeImage } from "@/components/regenerative-image"
import { Users, Database, Coins, Shield, Plus } from "lucide-react"
import { createThirdwebClient } from "thirdweb";
import { useActiveAccount, ConnectButton } from "thirdweb/react";


const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Sample task pools data
const taskPools = [
  {
    id: 46,
    name: "Infrastructure",
    votingWeight: "Fixed",
    proposalsCount: 2, // Renamed to avoid duplicate key
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
    proposalsCount: 1, // Renamed to avoid duplicate key
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
    proposalsCount: 1, // Renamed to avoid duplicate key
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

interface FarmBlockPageProps {
  params: {
    id: string;
  };
}

interface FarmblockData {
  farmName: string;
  location: string;
  size: string;
  cropType: string;
  description: string;
  safeWallet: string;
  registrationStake: string;
  stakeCurrency: string;
  mission?: string;
  governanceRules?: string;
  nftPromptFile?: {
    name: string;
    size: number;
    type: string;
  };
  nftPromptFileBase64?: string;
  createdAt: string;
  creatorAddress?: string;
  nftDropAddress?: string;
}

export default function FarmBlockPage({ params }: FarmBlockPageProps) {
  const [farmblock, setFarmblock] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview")
  const [newTransactionDialogOpen, setNewTransactionDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState("task-pool")
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false)
  const [createProposalDialogOpen, setCreateProposalDialogOpen] = useState(false)
  const [createPoolDialogOpen, setCreatePoolDialogOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState(null)
  const [poolType, setPoolType] = useState("task")
  const [guardianOnly, setGuardianOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [farmblockData, setFarmblockData] = useState<FarmblockData | null>(null);

  // Router for navigation
  const router = useRouter();

  // Thirdweb hooks - now properly inside component
  const account = useActiveAccount();
  const address = account?.address;

  useEffect(() => {
    if (!params.id) {
      setError("Invalid FarmBlock ID.");
      setIsLoading(false);
      return;
    }

    // Check for farmblock data from create-farmblock page
    const storedFarmblock = localStorage.getItem("pendingFarmblock");
    const storedCreatedFarmblock = localStorage.getItem(`farmblock_${params.id}`);

    if (storedFarmblock) {
      try {
        const data: FarmblockData = JSON.parse(storedFarmblock);
        setFarmblockData(data);

        // Create farmblock object from the data
        const fetchedFarmblock = {
          id: params.id,
          name: data.farmName,
          location: data.location,
          image: "/images/sustainable-farm.jpeg", // Default image, could be enhanced later
          members: 0,
          pools: 1,
          staked: "0",
          registrationStake: data.registrationStake,
          stakeCurrency: data.stakeCurrency,
          description: data.description,
          mission: data.mission || "Empowering communities through sustainable agriculture and transparent governance.",
          governanceRules: data.governanceRules ||
            "1. All community decisions require a minimum of 15% support to pass.\n2. Task proposals must include clear deliverables and timelines.\n3. Funding requests must specify exact amounts and beneficiaries.\n4. Guardians are elected by community vote and serve 6-month terms.\n5. All financial transactions are executed through the community Safe and require multi-signature approval.",
          safeWallet: data.safeWallet,
          nftDropAddress: data.nftDropAddress,
          guardians: [], // Will be populated from Safe contract
          pendingTransactions: [], // Will be populated from Safe contract
        };

        setFarmblock(fetchedFarmblock);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing farmblock data:", err);
        setError("Failed to load FarmBlock data from creation.");
        setIsLoading(false);
      }
    } else if (storedCreatedFarmblock) {
      try {
        const data: FarmblockData = JSON.parse(storedCreatedFarmblock);
        setFarmblockData(data);

        const fetchedFarmblock = {
          id: params.id,
          name: data.farmName,
          location: data.location,
          image: "/images/sustainable-farm.jpeg",
          members: 0,
          pools: 1,
          staked: "0",
          registrationStake: data.registrationStake,
          stakeCurrency: data.stakeCurrency,
          description: data.description,
          mission: data.mission || "Empowering communities through sustainable agriculture and transparent governance.",
          governanceRules: data.governanceRules ||
            "1. All community decisions require a minimum of 15% support to pass.\n2. Task proposals must include clear deliverables and timelines.\n3. Funding requests must specify exact amounts and beneficiaries.\n4. Guardians are elected by community vote and serve 6-month terms.\n5. All financial transactions are executed through the community Safe and require multi-signature approval.",
          safeWallet: data.safeWallet,
          nftDropAddress: data.nftDropAddress,
          guardians: [],
          pendingTransactions: [],
        };

        setFarmblock(fetchedFarmblock);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing stored farmblock data:", err);
        setError("Failed to load FarmBlock data.");
        setIsLoading(false);
      }
    } else {
      // Fallback to mock data if no real data exists
      const fetchedFarmblock = {
        id: params.id,
        name: "OxFarmBlock",
        location: "Kenya",
        image: "/images/sustainable-farm.jpeg",
        members: 0,
        pools: 1,
        staked: "0",
        registrationStake: "5.1",
        stakeCurrency: "cUSD",
        description: "A community of farmers in Kenya focused on sustainable agriculture and transparent governance.",
        mission:
          "Our mission is to empower local farmers through sustainable agricultural practices, transparent governance, and fair trade. We aim to combat hunger and drought by implementing innovative farming techniques and fostering community collaboration.",
        governanceRules:
          "1. All community decisions require a minimum of 15% support to pass.\n2. Task proposals must include clear deliverables and timelines.\n3. Funding requests must specify exact amounts and beneficiaries.\n4. Guardians are elected by community vote and serve 6-month terms.\n5. All financial transactions are executed through the community Safe and require multi-signature approval.",
        safeWallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        guardians: [],
        pendingTransactions: [],
      };
      setFarmblock(fetchedFarmblock);
      setIsLoading(false);
    }
  }, [params.id]);

  const handleRegisterInCommunity = async () => {
    if (!connected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      alert("Registration successful! You are now a member of this community.");
      setRegistrationDialogOpen(false);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleCreateTransaction = async () => {
    if (!connected) {
      alert("Please connect your wallet first.");
      return;
    }

    alert("Transaction proposal created! Please confirm in your wallet.");
    setNewTransactionDialogOpen(false);
  };

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      alert("Please connect your wallet first.");
      return;
    }

    alert("Pool created successfully! Please confirm the transaction in your wallet.");
    setCreatePoolDialogOpen(false);
  };

  const connected = true; // Mocked connection status for now

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!farmblock) {
    return <div>No FarmBlock data available.</div>;
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

            <Button className="w-full" onClick={() => router.push('/nft-store')}>
              Register in community - Buy NFT
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4 flex overflow-x-auto pb-px">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
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
                      <CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
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
                          {farmblock.governanceRules.split("\n").map((rule: string, index: number) => (
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

          <TabsContent value="donate">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Support {farmblock.name}</CardTitle>
                    <CardDescription>Directly fund the FarmBlock Safe wallet to support community initiatives</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-lg mb-3">Donation Options</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Support {farmblock.name} by donating directly to the community Safe wallet. Your contribution will help fund community initiatives, tasks, and governance activities.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card className="border-blue-100 hover:border-blue-300 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">cUSD Donation</CardTitle>
                          <CardDescription>US Dollar Stablecoin</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Safe Balance</span>
                            <span className="font-medium">0.00 cUSD</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Directly fund the community Safe wallet in US Dollar equivalent stablecoin.
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full">Donate cUSD</Button>
                        </CardFooter>
                      </Card>

                      <Card className="border-purple-100 hover:border-purple-300 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">cEUR Donation</CardTitle>
                          <CardDescription>Euro Stablecoin</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Safe Balance</span>
                            <span className="font-medium">0.00 cEUR</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Support community initiatives with Euro equivalent stablecoin.
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full">Donate cEUR</Button>
                        </CardFooter>
                      </Card>

                      <Card className="border-green-100 hover:border-green-300 transition-colors">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">cKES Donation</CardTitle>
                          <CardDescription>Kenyan Shilling Stablecoin</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm">Safe Balance</span>
                            <span className="font-medium">0.00 cKES</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Donate in local currency equivalent to support community growth.
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full">Donate cKES</Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2">Why Donate?</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Support community farming initiatives and sustainability</li>
                      <li>Fund task payouts and community rewards</li>
                      <li>Enable community members to earn through governance participation</li>
                      <li>Help expand the farmblock network across regions</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-medium text-lg mb-3">My Donations</p>
                    <p className="text-muted-foreground">You have no active donations</p>
                    <Button variant="outline" className="mt-4">
                      View Donation History
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
                    <CardDescription>Community-driven multisig wallet for funding and governance</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Safe Wallet Address */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-blue-900">Safe Multisig Wallet</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          All community funds and NFT proceeds are managed through this secure multisig wallet
                        </p>
                      </div>
                      <div className="text-right">
                        <code className="text-xs bg-white px-2 py-1 rounded text-blue-800 break-all">
                          {farmblock.safeWallet}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Safe Balance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0.00 {farmblock.stakeCurrency || 'cUSD'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          From NFT minting proceeds
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Awaiting guardian signatures
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Guardians</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Multisig signatories
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Guardians Section */}
                  <div>
                    <h3 className="font-medium mb-3">Community Guardians</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Guardians are the elected multisig signatories who can initiate and approve transactions.
                      They are responsible for executing community decisions and managing funds securely.
                    </p>
                    <div className="space-y-2">
                      {farmblock.guardians && farmblock.guardians.length > 0 ? (
                        farmblock.guardians.map((guardian: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Shield className="h-4 w-4 text-green-700" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">Guardian #{index + 1}</p>
                                <code className="text-xs text-muted-foreground">{guardian.address}</code>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No guardians configured yet</p>
                          <p className="text-xs">Guardians will be elected through community governance</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pending Transactions */}
                  <div>
                    <h3 className="font-medium mb-3">Pending Transactions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Transactions that have been proposed but need guardian signatures to execute.
                    </p>
                    <div className="space-y-2">
                      {farmblock.pendingTransactions && farmblock.pendingTransactions.length > 0 ? (
                        farmblock.pendingTransactions.map((tx: any, index: number) => (
                          <Card key={index} className="border-orange-200 bg-orange-50">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium text-sm">{tx.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {tx.amount} {tx.currency} • Proposed by {tx.proposer}
                                  </p>
                                </div>
                                <Badge className="bg-orange-100 text-orange-700 text-xs">
                                  {tx.signatures}/{tx.requiredSignatures} signatures
                                </Badge>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="outline">
                                  Review & Sign
                                </Button>
                                <Button size="sm" variant="ghost">
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No pending transactions</p>
                          <p className="text-xs">All transactions are up to date</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h3 className="font-medium mb-3">Recent Transactions</h3>
                    <div className="space-y-2">
                      <div className="text-center py-6 text-muted-foreground">
                        <Coins className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No transactions yet</p>
                        <p className="text-xs">Transaction history will appear here</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Dialog open={newTransactionDialogOpen} onOpenChange={setNewTransactionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Propose Transaction
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Propose New Transaction</DialogTitle>
                          <DialogDescription>
                            Create a transaction proposal that requires guardian approval through the Safe multisig.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
                            <p className="text-sm text-amber-800">
                              <strong>Note:</strong> This transaction will be submitted to the Safe multisig wallet and requires
                              approval from the community guardians before execution.
                            </p>
                          </div>

                          <div className="grid gap-4 mb-4">
                            <Label>Transaction Type</Label>
                              <Button
                                variant={transactionType === "task-pool" ? "default" : "outline"}
                                className="justify-start h-auto py-3"
                                onClick={() => setTransactionType("task-pool")}
                              >
                                <div className="flex flex-col items-start text-left">
                                  <span className="font-medium">Task Pool Payout</span>
                                  <span className="text-xs font-normal text-muted-foreground">
                                    Payout funds to task completion beneficiary
                                  </span>
                                </div>
                              </Button>
                          </div>

                          {transactionType === "task-pool" && (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="task-proposal">Select Approved Task Proposal</Label>
                                <Select>
                                  <SelectTrigger id="task-proposal">
                                    <SelectValue placeholder="Select a task that passed voting" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* Tasks will be populated from approved proposals */}
                                    <SelectItem value="task-1">Harvest Millet - Ethiopia (23 cUSD)</SelectItem>
                                    <SelectItem value="task-2">Plant Quinoa - Kenya (50 cUSD)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                  Only task proposals that have passed voting threshold appear here
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="payout-amount">Payout Amount</Label>
                                  <Input id="payout-amount" type="number" placeholder="0.00" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="payout-currency">Currency</Label>
                                  <Select defaultValue={farmblock.stakeCurrency || "cUSD"}>
                                    <SelectTrigger id="payout-currency">
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
                                <Label htmlFor="beneficiary-address">Beneficiary Address</Label>
                                <Input id="beneficiary-address" placeholder="0x..." />
                                <p className="text-xs text-muted-foreground">
                                  The address from the approved task proposal that will receive the funds
                                </p>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="task-description">Transaction Details</Label>
                                <Textarea
                                  id="task-description"
                                  placeholder="Describe this payout (task completion reference, etc)"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {transactionType === "nft-royalty" && (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="royalty-action">Distribution Action</Label>
                                <Select>
                                  <SelectTrigger id="royalty-action">
                                    <SelectValue placeholder="Select action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="distribute">Distribute to Community</SelectItem>
                                    <SelectItem value="reinvest">Reinvest in FarmBlock</SelectItem>
                                    <SelectItem value="reserve">Add to Reserve Fund</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="royalty-amount">Amount to Distribute</Label>
                                <Input id="royalty-amount" type="number" placeholder="0.00" />
                                <p className="text-xs text-muted-foreground">
                                  Available royalty balance: Check Safe balance above
                                </p>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="royalty-description">Distribution Details</Label>
                                <Textarea
                                  id="royalty-description"
                                  placeholder="Describe how the royalty funds will be distributed"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {transactionType === "task-pool" && (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="approved-proposal">Select Approved Proposal</Label>
                                <Select>
                                  <SelectTrigger id="approved-proposal">
                                    <SelectValue placeholder="Select a proposal with voting threshold met" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="prop-1">Plant Quinoa Seeds - John's Team</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="payout-beneficiary">Beneficiary Address</Label>
                                <Input id="payout-beneficiary" type="text" placeholder="0x1234..." value="0x1234567890123456789012345678901234567890" readOnly />
                                <p className="text-xs text-muted-foreground">
                                  Address from the approved proposal
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="payout-amount">Amount</Label>
                                  <Input id="payout-amount" type="number" placeholder="50" readOnly value="50" />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="payout-currency">Currency</Label>
                                  <Input id="payout-currency" type="text" placeholder="cUSD" readOnly value="cUSD" />
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="payout-description">Transaction Details</Label>
                                <Textarea
                                  id="payout-description"
                                  placeholder="Payment for approved task proposal"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {transactionType === "nft-royalty" && (
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="royalty-action">Distribution Action</Label>
                                <Select>
                                  <SelectTrigger id="royalty-action">
                                    <SelectValue placeholder="Select action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="distribute">Distribute to Community</SelectItem>
                                    <SelectItem value="reinvest">Reinvest in FarmBlock</SelectItem>
                                    <SelectItem value="reserve">Add to Reserve Fund</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="royalty-amount">Amount to Distribute</Label>
                                <Input id="royalty-amount" type="number" placeholder="0.00" />
                                <p className="text-xs text-muted-foreground">
                                  Available royalty balance: Check Safe balance above
                                </p>
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="royalty-description">Distribution Details</Label>
                                <Textarea
                                  id="royalty-description"
                                  placeholder="Describe how the royalty funds will be distributed"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}

                          {transactionType === "saving-strategy" && (
                            <div className="space-y-4">
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-sm text-yellow-800">
                                  <strong>Note:</strong> Saving strategy funding is currently suspended. 
                                  Please use Task Pool Payout for community payouts.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleCreateTransaction}>
                            {connected ? "Propose Transaction" : "Connect Wallet to Propose"}
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
                <Checkbox
                  id="guardian-only"
                  checked={guardianOnly}
                  onCheckedChange={(checked) => setGuardianOnly(checked === true)}
                />
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