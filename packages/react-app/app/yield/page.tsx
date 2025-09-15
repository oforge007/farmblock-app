"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"

// Sample yield pool data
const yieldPools = [
  {
    id: 1,
    name: "cUSD Yield Pool",
    currency: "cUSD",
    apy: 5.2,
    totalDeposited: 25000,
    myDeposit: 1000,
    description: "Earn yield on your cUSD deposits through Mento stablecoin yield pools.",
  },
  {
    id: 2,
    name: "cEUR Yield Pool",
    currency: "cEUR",
    apy: 4.8,
    totalDeposited: 15000,
    myDeposit: 500,
    description: "Earn yield on your cEUR deposits through Mento stablecoin yield pools.",
  },
  {
    id: 3,
    name: "cKES Yield Pool",
    currency: "cKES",
    apy: 6.1,
    totalDeposited: 10000,
    myDeposit: 0,
    description: "Earn yield on your cKES deposits through Mento stablecoin yield pools.",
  },
]

// Sample transaction history
const transactions = [
  {
    id: 1,
    type: "deposit",
    amount: 500,
    currency: "cUSD",
    date: "2023-05-15",
    status: "completed",
  },
  {
    id: 2,
    type: "deposit",
    amount: 500,
    currency: "cUSD",
    date: "2023-04-30",
    status: "completed",
  },
  {
    id: 3,
    type: "deposit",
    amount: 500,
    currency: "cEUR",
    date: "2023-04-15",
    status: "completed",
  },
  {
    id: 4,
    type: "withdrawal",
    amount: 200,
    currency: "cEUR",
    date: "2023-03-20",
    status: "completed",
  },
]

export default function YieldGeneration() {
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState(null)
  const { connected, connect } = useWallet()

  const handleDeposit = (pool) => {
    setSelectedPool(pool)
    setDepositDialogOpen(true)
  }

  const handleWithdraw = (pool) => {
    setSelectedPool(pool)
    setWithdrawDialogOpen(true)
  }

  const submitDeposit = async () => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with the blockchain to deposit funds
    alert("Deposit submitted! Please confirm the transaction in your wallet.")
    setDepositDialogOpen(false)
  }

  const submitWithdrawal = async () => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with Gardens V2 signal pools for withdrawal approval
    alert("Withdrawal request submitted! It will be processed after community approval through Gardens V2.")
    setWithdrawDialogOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm flex mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <p className="font-bold text-xl">FarmBlock</p>
        </Link>
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Yield Generation</h1>
        <p className="text-muted-foreground mb-8">
          Guardians can deposit funds into Mento stablecoin yield pools to earn returns, with withdrawals approved via
          Gardens V2 signal pools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Value Deposited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,500.00 cUSD</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 mr-1">+12.5%</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Yield Earned (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.75 cUSD</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 mr-1">+5.2%</span>
                <span className="text-xs text-muted-foreground">APY</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">cUSD, cEUR</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pools" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="pools">Yield Pools</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-6">
            {yieldPools.map((pool) => (
              <Card key={pool.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pool.name}</CardTitle>
                      <CardDescription>{pool.description}</CardDescription>
                    </div>
                    <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {pool.apy}% APY
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Total Deposited</span>
                        <span>
                          {pool.totalDeposited.toLocaleString()} {pool.currency}
                        </span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>My Deposit</span>
                        <span>
                          {pool.myDeposit.toLocaleString()} {pool.currency}
                        </span>
                      </div>
                      <Progress value={(pool.myDeposit / pool.totalDeposited) * 100} className="h-2" />
                    </div>
                    {pool.myDeposit > 0 && (
                      <div className="pt-2">
                        <p className="text-sm">
                          <span className="font-medium">Estimated Yield (30d):</span>{" "}
                          {((pool.myDeposit * pool.apy) / 100 / 12).toFixed(2)} {pool.currency}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleWithdraw(pool)} disabled={pool.myDeposit === 0}>
                    Withdraw
                  </Button>
                  <Button onClick={() => handleDeposit(pool)}>Deposit</Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your deposit and withdrawal history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className={`${tx.type === "deposit" ? "bg-green-100" : "bg-red-100"} p-2 rounded-full`}>
                          {tx.type === "deposit" ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-medium ${tx.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "deposit" ? "+" : "-"}
                        {tx.amount} {tx.currency}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit to {selectedPool?.name}</DialogTitle>
            <DialogDescription>
              Deposit funds to earn {selectedPool?.apy}% APY on your {selectedPool?.currency}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue={selectedPool?.currency}>
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
          <DialogFooter>
            <Button type="submit" onClick={submitDeposit}>
              {connected ? "Deposit" : "Connect Wallet to Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw from {selectedPool?.name}</DialogTitle>
            <DialogDescription>
              Withdrawal requests are processed after community approval through Gardens V2 signal pools.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="withdraw-amount">Amount</Label>
              <Input id="withdraw-amount" type="number" placeholder="0.00" max={selectedPool?.myDeposit} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="withdraw-currency">Currency</Label>
              <Select defaultValue={selectedPool?.currency}>
                <SelectTrigger id="withdraw-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cUSD">cUSD</SelectItem>
                  <SelectItem value="cEUR">cEUR</SelectItem>
                  <SelectItem value="cKES">cKES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                Current deposit: {selectedPool?.myDeposit} {selectedPool?.currency}
              </p>
              <p className="mt-2">
                Note: Withdrawals require community approval through Gardens V2 governance. This process typically takes
                24-48 hours.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={submitWithdrawal}>
              {connected ? "Request Withdrawal" : "Connect Wallet to Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
