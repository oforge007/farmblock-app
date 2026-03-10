"use client"

import { useEffect, useState } from "react";
import { MainNav } from "@/components/main-nav";
import { FooterMenu } from "@/components/footer-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/thirdweb-client";
import { useActiveAccount } from "thirdweb/react";

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
}

export default function NFTDropPage() {
  const account = useActiveAccount();
  const address = account?.address;

  const [farmblockData, setFarmblockData] = useState<FarmblockData | null>(null);
  const [marketplaceAddress, setMarketplaceAddress] = useState("");
  const [nftDropAddress, setNftDropAddress] = useState("");
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [hasDeployed, setHasDeployed] = useState(false);

  // Load farmblock data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("pendingFarmblock");
    if (stored) {
      try {
        const data = JSON.parse(stored) as FarmblockData;
        setFarmblockData(data);
        setStatus(`Loaded farmblock: ${data.farmName}. Auto-deploying NFT drop...`);
        // Automatically deploy NFT drop when farmblock data is loaded
        deployNFTDropAuto(data);
      } catch (error) {
        console.error("Error parsing farmblock data:", error);
        setStatus("Error loading farmblock data. Please start over from Create FarmBlock.");
      }
    } else {
      setStatus("No farmblock data found. Please create a farmblock first.");
    }
  }, []);

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
      const c: any = await (client as any).getContract(addr);
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

  const handleDeployNFTDrop = async () => {
    if (!address) return setStatus("Connect your wallet to deploy an NFT drop");
    if (!farmblockData) return setStatus("No farmblock data found");
    if (!farmblockData.safeWallet) return setStatus("Safe wallet address is required");

    await deployNFTDropAuto(farmblockData);
  };

  const deployNFTDropAuto = async (fbData: FarmblockData) => {
    if (!fbData.safeWallet) {
      setStatus("Safe wallet address is required");
      return;
    }

    setStatus("Deploying NFT drop contract via thirdweb...");
    setLoading(true);
    try {
      const anyClient: any = client;
      
      // Prepare NFT metadata from the prompt file
      const nftMetadata = {
        name: `${fbData.farmName} Share NFT`,
        description: `Official NFT share of ${fbData.farmName} farm. ${fbData.description}`,
        image: fbData.nftPromptFileBase64 || undefined, // Use the uploaded prompt file as NFT image
        properties: {
          farmName: fbData.farmName,
          location: fbData.location,
          cropType: fbData.cropType,
          farmSize: fbData.size,
          mission: fbData.mission || "",
        },
      };

      // Deploy NFT drop with configuration
      const nftDropConfig = {
        name: `${fbData.farmName} NFT Drop`,
        symbol: `${fbData.farmName.substring(0, 3).toUpperCase()}NFT`,
        primary_sale_recipient: fbData.safeWallet, // Direct all proceeds to Safe wallet
        default_royalty_recipient: fbData.safeWallet,
        default_royalty_bps: 500, // 5% royalty
      };

      let deployedAddress: string;

      if (anyClient.deployer && typeof anyClient.deployer.deploy === "function") {
        const res = await anyClient.deployer.deploy("nft-drop", nftDropConfig);
        deployedAddress = res?.address || res;
      } else if (anyClient.deployer && typeof anyClient.deployer.deployContract === "function") {
        const res = await anyClient.deployer.deployContract("nft-drop", nftDropConfig);
        deployedAddress = res?.address || res;
      } else {
        setStatus("Deploy API not available on client. Please deploy manually.");
        setLoading(false);
        return;
      }

      setNftDropAddress(deployedAddress);
      setFarmblockData(fbData);

      // Now mint the initial NFT with the unique metadata
      await mintInitialNFT(deployedAddress, nftMetadata, fbData);
    } catch (err: any) {
      setStatus("Deploy failed: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const mintInitialNFT = async (dropAddress: string, metadata: any, fbData: FarmblockData) => {
    try {
      setStatus("Minting initial NFT with unique metadata from prompt file...");
      const c: any = await (client as any).getContract(dropAddress);

      if (typeof c.lazyMint === "function") {
        // Lazy mint the NFT with the unique metadata
        await c.lazyMint(1, metadata);
        setStatus(
          `✅ NFT Drop deployed successfully! Unique NFT created from your prompt file. 
          Contract: ${dropAddress.slice(0, 10)}...${dropAddress.slice(-8)}
          Proceeds go to Safe: ${fbData.safeWallet.slice(0, 10)}...`
        );
        setHasDeployed(true);
        // Clear localStorage after successful deployment
        localStorage.removeItem("pendingFarmblock");
      } else if (typeof c.call === "function") {
        await c.call("lazyMint", 1, metadata);
        setStatus(
          `✅ NFT Drop deployed and NFT minted! 
          Contract: ${dropAddress.slice(0, 10)}...${dropAddress.slice(-8)}`
        );
        setHasDeployed(true);
        localStorage.removeItem("pendingFarmblock");
      } else {
        // If lazyMint not available, just show deployment success
        setStatus(
          `✅ NFT Drop deployed! Contract: ${dropAddress.slice(0, 10)}...${dropAddress.slice(-8)}
          Ready for users to mint. Proceeds go to: ${fbData.safeWallet.slice(0, 10)}...`
        );
        setHasDeployed(true);
        localStorage.removeItem("pendingFarmblock");
      }
    } catch (err: any) {
      console.error("Error minting initial NFT:", err);
      // Still show success even if minting failed
      setStatus(
        `✅ NFT Drop deployed! (${dropAddress.slice(0, 10)}...${dropAddress.slice(-8)})
        Note: Could not auto-mint NFT. You can mint manually.`
      );
      setHasDeployed(true);
    }
  };

  const handleMintNFT = async () => {
    if (!nftDropAddress && !activeAddress) return setStatus("Load or deploy an NFT drop first");
    if (!address) return setStatus("Connect wallet to mint");
    if (!farmblockData) return setStatus("No farmblock data available");

    const dropAddress = nftDropAddress || activeAddress;
    setStatus(`Attempting to mint NFT (${farmblockData.stakeCurrency} ${farmblockData.registrationStake})...`);
    
    try {
      const c: any = await (client as any).getContract(dropAddress);
      
      // Convert registration stake to appropriate format
      const mintPrice = farmblockData.registrationStake;
      
      if (typeof c.claim === "function") {
        // claim is the typical method for NFT drops
        await c.claim(1, { price: mintPrice });
        setStatus(`NFT minted! ${farmblockData.registrationStake} ${farmblockData.stakeCurrency} sent to ${farmblockData.safeWallet}`);
        setHasDeployed(false);
      } else if (typeof c.call === "function") {
        await c.call("claim", 1, { price: mintPrice });
        setStatus("NFT minted via generic call. Check your wallet.");
      } else {
        setStatus("Claim method not available on this contract.");
      }
    } catch (err: any) {
      setStatus("Mint failed: " + (err?.message ?? String(err)));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-3xl px-4">
        <h1 className="text-2xl font-bold my-4">FarmBlock NFT Drop</h1>

        {farmblockData && (
          <Card className="mb-4 bg-green-50">
            <CardHeader>
              <CardTitle>{farmblockData.farmName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Location:</strong> {farmblockData.location}</div>
              <div><strong>Crop Type:</strong> {farmblockData.cropType}</div>
              <div><strong>Farm Size:</strong> {farmblockData.size} hectares</div>
              <div><strong>Safe Wallet:</strong> <code className="text-xs bg-white p-1 rounded">{farmblockData.safeWallet}</code></div>
              <div><strong>NFT Mint Price:</strong> {farmblockData.registrationStake} {farmblockData.stakeCurrency}</div>
              {farmblockData.nftPromptFile && (
                <div><strong>NFT Prompt File:</strong> {farmblockData.nftPromptFile.name}</div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>NFT Drop Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hasDeployed ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm font-medium text-green-900">✅ NFT Drop Active!</div>
                  <p className="text-xs text-green-800 mt-2">
                    Your unique NFT has been created from the prompt file and is ready for minting.
                  </p>
                  {nftDropAddress && (
                    <code className="text-xs bg-white p-2 rounded block mt-2 break-all text-green-700">
                      {nftDropAddress}
                    </code>
                  )}
                </div>
              ) : (
                <div>
                  <Button 
                    onClick={handleDeployNFTDrop} 
                    disabled={loading || !farmblockData}
                    className="w-full"
                  >
                    {loading ? "Deploying…" : "Deploy NFT Drop"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Deploys an NFT drop for this FarmBlock. Your prompt file becomes the unique NFT image.
                    Minting proceeds automatically go to the Safe wallet.
                  </p>
                </div>
              )}

              {nftDropAddress && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="text-sm font-medium">NFT Drop Contract Address:</div>
                  <code className="text-xs bg-white p-1 rounded block mt-1 break-all">{nftDropAddress}</code>
                </div>
              )}

              <div className="flex gap-2">
                <Input 
                  placeholder="Or paste existing NFT drop address" 
                  value={marketplaceAddress} 
                  onChange={(e: any) => setMarketplaceAddress(e.target.value)} 
                />
                <Button onClick={handleUseAddress}>Load</Button>
              </div>

              <div className="text-sm text-muted-foreground">Connected wallet: {address ?? "Not connected"}</div>
              {status ? (
                <div className={`mt-2 text-sm whitespace-pre-wrap ${status.includes("failed") || status.includes("Failed") ? "text-red-600" : "text-blue-600"}`}>
                  {status}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mint NFT Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={handleMintNFT}
                disabled={loading || (!nftDropAddress && !activeAddress)}
                className="w-full"
              >
                {loading ? "Minting…" : `Mint NFT Share (${farmblockData?.registrationStake} ${farmblockData?.stakeCurrency})`}
              </Button>
              <p className="text-xs text-muted-foreground">
                Minting a share costs {farmblockData?.registrationStake} {farmblockData?.stakeCurrency} and gives you ownership of a portion of {farmblockData?.farmName}.
                All proceeds go directly to the FarmBlock's Safe multisig wallet.
              </p>
            </div>
          </CardContent>
        </Card>

        <FooterMenu />
      </div>
    </main>
  );
}
