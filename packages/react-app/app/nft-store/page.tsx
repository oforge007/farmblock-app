"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { FooterMenu } from "@/components/footer-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { client } from "@/lib/thirdweb-client";
import { useActiveAccount } from "thirdweb/react";
import { ethers } from "ethers";

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
  safeOwners?: string[];
  nftPromptFile?: {
    name: string;
    size: number;
    type: string;
  };
  nftPromptFileBase64?: string;
  createdAt: string;
  creatorAddress?: string;
  id?: string;
  nftDropAddress?: string;
}

const farmBlockRegistryAbi = [
  "function registerFarmBlock(bytes32 id, address safeWallet, address nftDrop, string name)",
  "function updateNFTDrop(bytes32 id, address nftDrop)",
  "function verifyFarmBlock(bytes32 id)",
  "function rejectFarmBlock(bytes32 id, string reason)",
  "event FarmBlockRegistered(bytes32 indexed id, address indexed safeWallet, address nftDrop, string name)",
  "event FarmBlockVerified(bytes32 indexed id, address indexed owner)",
  "event FarmBlockRejected(bytes32 indexed id, address indexed owner, string reason)",
]

const registryAddress = process.env.NEXT_PUBLIC_FARMBLOCK_REGISTRY_ADDRESS || ""

function farmblockIdHash(id: string) {
  return ethers.id(id)
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
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadFarmblockData = async () => {
      const farmblockId = searchParams?.get("farmblockId")
      let dataString: string | null = null

      if (farmblockId) {
        dataString = localStorage.getItem(farmblockId)
        if (!dataString) {
          dataString = localStorage.getItem("pendingFarmblock")
        }
      } else {
        dataString = localStorage.getItem("pendingFarmblock")
      }

      if (!dataString) {
        setStatus("No farmblock data found. Please create a farmblock first.")
        return
      }

      try {
        const data = JSON.parse(dataString) as FarmblockData

        // live chain owner refresh for robust safety
        if (data.safeWallet) {
          try {
            const rpc = process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC || "https://forno.celo.org"
            const provider = new ethers.JsonRpcProvider(rpc)
            const safeAbi = ["function getOwners() view returns (address[])"]
            const safe = new ethers.Contract(data.safeWallet, safeAbi, provider)
            const liveOwners = await safe.getOwners()
            data.safeOwners = liveOwners
          } catch (chainErr) {
            console.warn("Failed to read safe owners on chain", chainErr)
          }
        }

        setFarmblockData(data)

        const owners = data.safeOwners || []
        if (owners.length === 0) {
          setStatus("No Safe owners found for this farmblock. Confirm safe wallet valid on Celo Sepolia.")
          return
        }

        const current = address?.toLowerCase() || ""
        const isCurrentSigner = owners.map((s: string) => s.toLowerCase()).includes(current)

        if (!isCurrentSigner) {
          setStatus("Warning: Current wallet is not a Safe owner; connect an owner to proceed.")
          return
        }

        setStatus(`Loaded farmblock: ${data.farmName}. Auto-deploying NFT drop...`)
        deployNFTDropAuto(data)
      } catch (error) {
        console.error("Error parsing farmblock data:", error)
        setStatus("Error loading farmblock data. Please start over from Create FarmBlock.")
      }
    }

    loadFarmblockData()
  }, [address, searchParams])

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

    const owners = farmblockData.safeOwners || []
    const isCurrentSigner = owners.map((s: string) => s.toLowerCase()).includes(address.toLowerCase())

    if (!isCurrentSigner) {
      setStatus("You must connect a multisig owner wallet listed on this FarmBlock Safe to deploy the drop.")
      return
    }

    await deployNFTDropAuto(farmblockData)
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

      // Save mapping of farmblock -> NFT drop contract on client and local storage
      if (fbData.id) {
        const existingMappings = JSON.parse(localStorage.getItem("nftDropMappings") || "{}")
        existingMappings[fbData.id] = deployedAddress
        localStorage.setItem("nftDropMappings", JSON.stringify(existingMappings))
        localStorage.setItem(`farmblock_${fbData.id}_nftDrop`, deployedAddress)

        // On-chain registry update (Celo Sepolia)
        if (registryAddress && typeof window !== "undefined" && (window as any).ethereum) {
          try {
            const provider = new ethers.BrowserProvider((window as any).ethereum)
            const signer = await provider.getSigner()
            const registry = new ethers.Contract(registryAddress, farmBlockRegistryAbi, signer)
            const onchainId = farmblockIdHash(fbData.id)
            await registry.registerFarmBlock(onchainId, fbData.safeWallet, deployedAddress, fbData.farmName)
            setStatus(`✅ FarmBlock registered on-chain (${registryAddress})`)
          } catch (registryErr) {
            console.warn("Failed to register farmblock on chain", registryErr)
            setStatus("Warning: Could not register FarmBlock to on-chain registry (check wallet and network)")
          }
        }
      }

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

    const owners = farmblockData.safeOwners || []
    const isCurrentSigner = owners.map((s: string) => s.toLowerCase()).includes(address.toLowerCase())

    if (!isCurrentSigner) {
      setStatus("You must connect a multisig owner wallet listed for this FarmBlock Safe to mint.")
      return
    }

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

  const handleVerifyFarmblock = async () => {
    if (!registryAddress) {
      setStatus("Registry address is not configured")
      return
    }
    if (!address) {
      setStatus("Connect wallet to verify")
      return
    }
    if (!farmblockData?.id) {
      setStatus("FarmBlock ID missing")
      return
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const registry = new ethers.Contract(registryAddress, farmBlockRegistryAbi, signer)
      await registry.verifyFarmBlock(farmblockIdHash(farmblockData.id))
      setStatus("FarmBlock verified on-chain")
    } catch (err: any) {
      setStatus("Failed to verify: " + (err?.message ?? String(err)))
    }
  }

  const handleRejectFarmblock = async (reason = "Not approved") => {
    if (!registryAddress) {
      setStatus("Registry address is not configured")
      return
    }
    if (!address) {
      setStatus("Connect wallet to reject")
      return
    }
    if (!farmblockData?.id) {
      setStatus("FarmBlock ID missing")
      return
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const registry = new ethers.Contract(registryAddress, farmBlockRegistryAbi, signer)
      await registry.rejectFarmBlock(farmblockIdHash(farmblockData.id), reason)
      setStatus("FarmBlock reject signal stored on-chain")
    } catch (err: any) {
      setStatus("Failed to reject: " + (err?.message ?? String(err)))
    }
  }

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

              <div className="flex items-center gap-2">
                <Button onClick={handleVerifyFarmblock} variant="outline" size="sm">
                  Verify on-chain
                </Button>
                <Button onClick={() => handleRejectFarmblock("Owner rejection")} variant="ghost" size="sm">
                  Reject on-chain
                </Button>
              </div>

              <div className="flex gap-2">
                <Input 
                  placeholder="Or paste existing NFT drop address" 
                  value={marketplaceAddress} 
                  onChange={(e: any) => setMarketplaceAddress(e.target.value)} 
                />
                <Button onClick={handleUseAddress}>Load</Button>
              </div>

              <div className="text-sm text-muted-foreground">Connected wallet: {address ?? "Not connected"}</div>
              <div className="text-sm text-muted-foreground">Safe owners: {farmblockData?.safeOwners?.join(", ") || "None"}</div>
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
