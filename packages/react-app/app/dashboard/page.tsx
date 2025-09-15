"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Leaf, Plus, ShoppingBag, Sprout, Map, Shield, Coins, ListTodo, MessageSquare, Users } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"
import { MainNav } from "@/components/main-nav"
import { WarpcastFeed } from "@/components/warpcast-feed"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { connected, connect, address, balance } = useWallet()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const connectWallet = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  if (!connected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your MiniPay wallet to access your FarmBlock dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Leaf className="h-24 w-24 text-green-600" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={connectWallet} className="w-full max-w-xs">
              Connect with MiniPay
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <MainNav />

      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Manage your farms, crops, tasks, and transactions</p>
          </div>
          <div className="flex gap-4">
            <Link href="/create-farmblock">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New FarmBlock
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Marketplace
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : `${balance?.cUSD || "0.00"} cUSD`}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active FarmBlocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : "2"}</div>
              <p className="text-xs text-muted-foreground mt-1">2 farms registered on blockchain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : "324.50 cUSD"}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 mr-1">+12.5%</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="farms" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="farms">My FarmBlocks</TabsTrigger>
                <TabsTrigger value="products">My Products</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="farms">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sunshine Valley Farm</CardTitle>
                      <CardDescription>Nairobi, Kenya • 5.2 hectares</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Quinoa</span>
                            <span>75% to harvest</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Millet</span>
                            <span>40% to harvest</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div className="pt-4">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">NFT ID:</span> #1234
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Created:</span> April 15, 2023
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Green Hills Plantation</CardTitle>
                      <CardDescription>Mombasa, Kenya • 3.8 hectares</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Goji Berries</span>
                            <span>90% to harvest</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Amaranth</span>
                            <span>20% to harvest</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                        <div className="pt-4">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">NFT ID:</span> #2345
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Created:</span> June 3, 2023
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Organic Quinoa</CardTitle>
                      <CardDescription>50 kg available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">
                          5.99 cUSD <span className="text-sm font-normal">per kg</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Listed on: April 28, 2023</p>
                        <p className="text-sm text-muted-foreground">Farm: Sunshine Valley Farm</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delist</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Golden Millet</CardTitle>
                      <CardDescription>100 kg available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">
                          3.49 cUSD <span className="text-sm font-normal">per kg</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Listed on: May 12, 2023</p>
                        <p className="text-sm text-muted-foreground">Farm: Sunshine Valley Farm</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delist</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your recent sales and purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <ShoppingBag className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Sale: Organic Quinoa</p>
                            <p className="text-sm text-muted-foreground">April 30, 2023</p>
                          </div>
                        </div>
                        <p className="font-medium text-green-600">+59.90 cUSD</p>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <ShoppingBag className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Sale: Golden Millet</p>
                            <p className="text-sm text-muted-foreground">April 28, 2023</p>
                          </div>
                        </div>
                        <p className="font-medium text-green-600">+34.90 cUSD</p>
                      </div>

                      <div className="flex justify-between items-center pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Sprout className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Farm Registration</p>
                            <p className="text-sm text-muted-foreground">April 15, 2023</p>
                          </div>
                        </div>
                        <p className="font-medium text-red-600">-5.00 cUSD</p>
                      </div>

                      <div className="flex justify-between items-center pb-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-100 p-2 rounded-full">
                            <ShoppingBag className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Sale: Goji Berries</p>
                            <p className="text-sm text-muted-foreground">April 10, 2023</p>
                          </div>
                        </div>
                        <p className="font-medium text-green-600">+129.90 cUSD</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key features of FarmBlock</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Link href="/tasks">
                  <Button variant="outline" className="w-full flex flex-col h-auto py-4 gap-2">
                    <ListTodo className="h-6 w-6" />
                    <span>Tasks</span>
                  </Button>
                </Link>
                <Link href="/nft-store">
                  <Button variant="outline" className="w-full flex flex-col h-auto py-4 gap-2">
                    <Coins className="h-6 w-6" />
                    <span>NFT Store</span>
                  </Button>
                </Link>
                <Link href="/safe">
                  <Button variant="outline" className="w-full flex flex-col h-auto py-4 gap-2">
                    <Shield className="h-6 w-6" />
                    <span>Safe</span>
                  </Button>
                </Link>
                <Link href="/yield">
                  <Button variant="outline" className="w-full flex flex-col h-auto py-4 gap-2">
                    <Sprout className="h-6 w-6" />
                    <span>Yield</span>
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="w-full flex flex-col h-auto py-4 gap-2">
                    <Users className="h-6 w-6" />
                    <span>Community</span>
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button variant="outline" className="w-full flex flex-col h-auto py-4 gap-2">
                    <Map className="h-6 w-6" />
                    <span>Discover</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Warpcast Updates
                </CardTitle>
                <CardDescription>Latest updates from the FarmBlock community</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <WarpcastFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
