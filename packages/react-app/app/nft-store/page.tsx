"use client"

import { useEffect, useState } from "react";
import { MainNav } from "@/components/main-nav";
import { FooterMenu } from "@/components/footer-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/thirdweb-client";
import { useActiveAccount } from "thirdweb/react";

export default function NFTDropPage() {
  const account = useActiveAccount();
  const address = account?.address;

  const [marketplaceAddress, setMarketplaceAddress] = useState("");
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (activeAddress) {
      loadListings(activeAddress);
    }
  }, [activeAddress]);

  const loadListings = async (addr: string) => {
    setLoading(true);
    setStatus(null);
    setListings([]);
    try {
      // getContract returns a thirdweb contract instance; we treat it as any to call common marketplace methods
  const c: any = await (client as any).getContract(addr);
      // try common method names used by thirdweb marketplace
      let items: any = [];
      try {
        items = await c.getAllListings();
      } catch (e) {
        try {
          items = await c.call("getAllListings");
        } catch (e2) {
          setStatus("Could not fetch listings from this contract (method not found).");
        }
      }
      setListings(items || []);
    } catch (err: any) {
      setStatus("Failed to load contract: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleUseAddress = () => {
    if (!marketplaceAddress) return setStatus("Enter a marketplace address first");
    setActiveAddress(marketplaceAddress.trim());
  };

  const handleDeploy = async () => {
    if (!address) return setStatus("Connect your wallet to deploy a marketplace");
    setStatus("Deploying marketplace (wallet will prompt)...");
    setLoading(true);
    try {
      // Attempt browser-side deploy using thirdweb client deployer if available
      const anyClient: any = client;
      if (anyClient.deployer && typeof anyClient.deployer.deploy === "function") {
        const res = await anyClient.deployer.deploy("marketplace", {});
        const deployedAddress = res?.address || res;
        setStatus("Deployed marketplace: " + deployedAddress);
        setMarketplaceAddress(deployedAddress);
        setActiveAddress(deployedAddress);
      } else if (anyClient.deployer && typeof anyClient.deployer.deployContract === "function") {
        const res = await anyClient.deployer.deployContract("marketplace", {});
        const deployedAddress = res?.address || res;
        setStatus("Deployed marketplace: " + deployedAddress);
        setMarketplaceAddress(deployedAddress);
        setActiveAddress(deployedAddress);
      } else {
        setStatus("Deploy API not available on client. You can enter an existing marketplace address instead.");
      }
    } catch (err: any) {
      setStatus("Deploy failed: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId: string | number) => {
    if (!activeAddress) return setStatus("Load a marketplace first");
    if (!address) return setStatus("Connect wallet to buy");
    setStatus("Attempting buy (wallet will prompt)...");
    try {
  const c: any = await (client as any).getContract(activeAddress);
      if (typeof c.buy === "function") {
        await c.buy(listingId, 1);
        setStatus("Buy tx submitted — check your wallet/tx history.");
      } else if (typeof c.call === "function") {
        await c.call("buy", listingId, 1);
        setStatus("Buy tx submitted (via generic call).");
      } else {
        setStatus("Buy method not available on this contract.");
      }
    } catch (err: any) {
      setStatus("Buy failed: " + (err?.message ?? String(err)));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-3xl px-4">
        <h1 className="text-2xl font-bold my-4">Thirdweb Marketplace</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Marketplace Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center mb-2">
              <Input placeholder="Paste marketplace address" value={marketplaceAddress} onChange={(e: any) => setMarketplaceAddress(e.target.value)} />
              <Button onClick={handleUseAddress}>Load</Button>
              <Button variant="secondary" onClick={handleDeploy} disabled={loading}>{loading ? "Deploying…" : "Deploy (wallet)"}</Button>
            </div>
            <div className="text-sm text-muted-foreground">Connected wallet: {address ?? "Not connected"}</div>
            {status ? <div className="mt-2 text-sm text-red-600">{status}</div> : null}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading listings…</div>
            ) : listings?.length ? (
              <div className="space-y-3">
                {listings.map((l: any) => (
                  <div key={l.id ?? l.listingId ?? JSON.stringify(l)} className="p-3 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{l.title ?? l.name ?? `Listing ${l.id ?? l.listingId}`}</div>
                        <div className="text-sm text-muted-foreground">Price: {String(l.price ?? l.buyoutPrice ?? l.currency?.value ?? "n/a")}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleBuy(l.id ?? l.listingId)}>Buy</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No listings found. Try deploying a marketplace or loading a different address.</div>
            )}
          </CardContent>
        </Card>

        <FooterMenu />
      </div>
    </main>
  );
}
