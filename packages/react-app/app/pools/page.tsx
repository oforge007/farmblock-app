// packages/react-app/app/fxswap/page.tsx

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
}
