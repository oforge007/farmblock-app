"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code, Copy, ExternalLink } from "lucide-react"
import { MainNav } from "@/components/main-nav"

export default function Contracts() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  // Read deployed contract addresses from environment variables.
  // Set these in packages/react-app/.env.local (NEXT_PUBLIC_...)
  const FUNDING_POOL_ADDRESS = process.env.NEXT_PUBLIC_FUNDING_POOL_ADDRESS ?? "[not set]"
  const YIELD_DEPOSITOR_ADDRESS = process.env.NEXT_PUBLIC_YIELD_DEPOSITOR_ADDRESS ?? "[not set]"
  const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ?? "[not set]"

  const explorerBase = "https://explorer.celo.org/sepolia/address"

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <MainNav />

      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Smart Contracts</h1>
        <p className="text-muted-foreground mb-8">
          FarmBlock is powered by a suite of smart contracts deployed on the Celo blockchain. These contracts handle
          task rewards, yield generation, and NFT minting.
        </p>

        <Tabs defaultValue="funding-pool" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="funding-pool">FundingPool.sol</TabsTrigger>
            <TabsTrigger value="yield-depositor">FarmBlockYieldDepositor.sol</TabsTrigger>
            <TabsTrigger value="nft-contract">NFT Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="funding-pool">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>FundingPool.sol</CardTitle>
                    <CardDescription>Manages task rewards, restricted to Mento stablecoins</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Deployed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Contract Address</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
                        {FUNDING_POOL_ADDRESS}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(FUNDING_POOL_ADDRESS)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm mt-1">
                      The FundingPool contract manages task rewards for the FarmBlock ecosystem. It is restricted to
                      Mento stablecoins (cUSD, cKES, cEUR) and integrates with Gardens V2 for governance approval of
                      fund allocations.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Key Functions</p>
                    <div className="mt-2 space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">
                          function createTask(string memory _description, uint256 _reward)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Creates a new task with a description and reward amount.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">function completeTask(uint256 _taskId, address _recipient)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Marks a task as complete and transfers the reward to the recipient.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">function depositFunds(uint256 _amount)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deposits funds into the funding pool for task rewards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  View Source Code
                </Button>
                <a
                  href={FUNDING_POOL_ADDRESS && FUNDING_POOL_ADDRESS !== "[not set]" ? `${explorerBase}/${FUNDING_POOL_ADDRESS}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="yield-depositor">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>FarmBlockYieldDepositor.sol</CardTitle>
                    <CardDescription>
                      Handles deposits and withdrawals to/from Mento stablecoin yield pools
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Deployed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Contract Address</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
                        {YIELD_DEPOSITOR_ADDRESS}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(YIELD_DEPOSITOR_ADDRESS)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm mt-1">
                      The FarmBlockYieldDepositor contract handles deposits and withdrawals to/from Mento stablecoin
                      yield pools. Withdrawals are triggered by Gardens V2 signal pool approvals, ensuring community
                      consensus.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Key Functions</p>
                    <div className="mt-2 space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">function deposit(uint256 _amount, string memory _currency)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deposits funds into the specified Mento stablecoin yield pool.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">
                          function requestWithdrawal(uint256 _amount, string memory _currency, address _recipient)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requests a withdrawal from the yield pool, subject to community approval.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">function executeWithdrawal(uint256 _requestId)</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Executes an approved withdrawal request, transferring funds to the recipient.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  View Source Code
                </Button>
                <a
                  href={YIELD_DEPOSITOR_ADDRESS && YIELD_DEPOSITOR_ADDRESS !== "[not set]" ? `${explorerBase}/${YIELD_DEPOSITOR_ADDRESS}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="nft-contract">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>NFT Contract</CardTitle>
                    <CardDescription>Deployed via thirdweb for minting agro-product NFTs</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Deployed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Contract Address</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
                        {NFT_CONTRACT_ADDRESS}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(NFT_CONTRACT_ADDRESS)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm mt-1">
                      The NFT Contract is deployed via thirdweb for minting agro-product NFTs. Each NFT represents a
                      real agricultural product, such as quinoa, millet, or goji berries, and can be traded on the
                      FarmBlock marketplace.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Key Functions</p>
                    <div className="mt-2 space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">
                          function mintNFT(string memory _tokenURI, uint256 _quantity)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mints a new NFT representing an agricultural product.
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">function transferNFT(uint256 _tokenId, address _recipient)</p>
                        <p className="text-xs text-muted-foreground mt-1">Transfers an NFT to a new owner.</p>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <p className="font-mono text-sm">function getNFTMetadata(uint256 _tokenId)</p>
                        <p className="text-xs text-muted-foreground mt-1">Retrieves the metadata for a specific NFT.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  View Source Code
                </Button>
                <a
                  href={NFT_CONTRACT_ADDRESS && NFT_CONTRACT_ADDRESS !== "[not set]" ? `${explorerBase}/${NFT_CONTRACT_ADDRESS}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 btn"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </a>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Contract Interactions</h2>
          <p className="text-muted-foreground mb-6">
            The FarmBlock smart contracts interact with each other and with external protocols to provide a seamless
            experience for users.
          </p>

          <div className="bg-muted p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {`
User
  ↓
FarmBlock dApp
  ↓
  ├── FundingPool.sol ←→ Gardens V2 (Funding Pools)
  │     ↓
  ├── FarmBlockYieldDepositor.sol ←→ Gardens V2 (Signal Pools)
  │     ↓                            ↓
  │     └─────────────────→ Mento Router (Stablecoin Yield Pools)
  │
  └── NFT Contract (thirdweb) ←→ MiniPay (Payments)
        ↓
        └─────────────────→ Warpcast (Transparency Updates)
              `}
            </pre>
          </div>
        </div>
      </div>
    </main>
  )
}
