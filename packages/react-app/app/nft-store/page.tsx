"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, FileImage, Wallet } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"

// Sample NFT data
const nfts = [
  {
    id: 1,
    name: "Organic Quinoa Harvest 2023",
    farm: "Sunshine Farms",
    location: "Kenya",
    price: 150,
    currency: "cUSD",
    image: "/placeholder.svg?height=300&width=300",
    description: "This NFT represents 50kg of certified organic quinoa from Sunshine Farms' 2023 harvest.",
    attributes: [
      { trait_type: "Crop", value: "Quinoa" },
      { trait_type: "Certification", value: "Organic" },
      { trait_type: "Harvest Year", value: "2023" },
      { trait_type: "Quantity", value: "50kg" },
    ],
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  {
    id: 2,
    name: "Golden Millet Premium Batch",
    farm: "Green Valley",
    location: "Ethiopia",
    price: 120,
    currency: "cUSD",
    image: "/placeholder.svg?height=300&width=300",
    description: "This NFT represents 40kg of premium golden millet, grown using sustainable farming practices.",
    attributes: [
      { trait_type: "Crop", value: "Millet" },
      { trait_type: "Certification", value: "Pesticide-free" },
      { trait_type: "Harvest Year", value: "2023" },
      { trait_type: "Quantity", value: "40kg" },
    ],
    owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  },
  {
    id: 3,
    name: "Superfood Goji Berries",
    farm: "Mountain Heights",
    location: "Tanzania",
    price: 200,
    currency: "cUSD",
    image: "/placeholder.svg?height=300&width=300",
    description: "This NFT represents 20kg of hand-picked goji berries, known for their exceptional nutritional value.",
    attributes: [
      { trait_type: "Crop", value: "Goji Berries" },
      { trait_type: "Certification", value: "Organic" },
      { trait_type: "Harvest Year", value: "2023" },
      { trait_type: "Quantity", value: "20kg" },
    ],
    owner: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
  },
  {
    id: 4,
    name: "Amaranth Grain Special Reserve",
    farm: "Riverside Plots",
    location: "Uganda",
    price: 180,
    currency: "cUSD",
    image: "/placeholder.svg?height=300&width=300",
    description: "This NFT represents 30kg of gluten-free amaranth grain, grown using traditional farming methods.",
    attributes: [
      { trait_type: "Crop", value: "Amaranth" },
      { trait_type: "Certification", value: "Gluten-free" },
      { trait_type: "Harvest Year", value: "2023" },
      { trait_type: "Quantity", value: "30kg" },
    ],
    owner: "0x8a21C9D5456C2f6F0a7F5b9C83f9974450F4168d",
  },
]

export default function NFTStore() {
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [mintDialogOpen, setMintDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [mintFormData, setMintFormData] = useState({
    name: "",
    description: "",
    farm: "",
    price: "",
    currency: "cUSD",
    quantity: "",
    unit: "kg",
    certification: "",
    harvestYear: new Date().getFullYear().toString(),
    recipientSafe: "", // New field for recipient Safe wallet
  })
  const { connected, connect, pay, address } = useWallet()

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft)
  }

  const handlePurchase = async () => {
    if (!connected) {
      await connect()
      return
    }

    if (!selectedNFT) return

    try {
      // Here you would integrate with MiniPay to process the payment
      await pay({
        amount: selectedNFT.price,
        currency: selectedNFT.currency,
        recipient: selectedNFT.owner,
        description: `Purchase of NFT: ${selectedNFT.name}`,
      })

      alert("NFT purchase successful! The NFT has been transferred to your wallet.")
      setSelectedNFT(null)
    } catch (error) {
      console.error("NFT purchase failed:", error)
      alert("NFT purchase failed. Please try again.")
    }
  }

  const handleMintFormChange = (e) => {
    const { name, value } = e.target
    setMintFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleMintNFT = async () => {
    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with thirdweb to mint the NFT
    console.log("Minting NFT with data:", mintFormData)
    console.log("Selected image:", selectedImage)

    alert("NFT minting initiated. Please confirm the transaction in your wallet.")
    setMintDialogOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">NFT Store</h1>
            <p className="text-muted-foreground">
              Mint and trade NFTs tied to real agricultural products using thirdweb
            </p>
          </div>
          <Dialog open={mintDialogOpen} onOpenChange={setMintDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Mint NFT
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Mint New NFT</DialogTitle>
                <DialogDescription>
                  Create a new NFT tied to your agricultural product using thirdweb.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">NFT Details</TabsTrigger>
                  <TabsTrigger value="attributes">Attributes & Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nft-name">NFT Name</Label>
                      <Input
                        id="nft-name"
                        name="name"
                        value={mintFormData.name}
                        onChange={handleMintFormChange}
                        placeholder="Enter NFT name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="nft-description">Description</Label>
                      <Textarea
                        id="nft-description"
                        name="description"
                        value={mintFormData.description}
                        onChange={handleMintFormChange}
                        placeholder="Describe your agricultural product"
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="nft-farm">Farm</Label>
                      <Select
                        value={mintFormData.farm}
                        onValueChange={(value) => setMintFormData((prev) => ({ ...prev, farm: value }))}
                      >
                        <SelectTrigger id="nft-farm">
                          <SelectValue placeholder="Select farm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunshine">Sunshine Farms</SelectItem>
                          <SelectItem value="green">Green Valley</SelectItem>
                          <SelectItem value="mountain">Mountain Heights</SelectItem>
                          <SelectItem value="riverside">Riverside Plots</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nft-price">Price</Label>
                        <Input
                          id="nft-price"
                          name="price"
                          value={mintFormData.price}
                          onChange={handleMintFormChange}
                          type="number"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nft-currency">Currency</Label>
                        <Select
                          defaultValue="cUSD"
                          value={mintFormData.currency}
                          onValueChange={(value) => setMintFormData((prev) => ({ ...prev, currency: value }))}
                        >
                          <SelectTrigger id="nft-currency">
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
                      <Label htmlFor="nft-image">Upload Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        {selectedImage ? (
                          <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                              <Image
                                src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                                alt="Selected NFT image"
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedImage(null)}>
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <>
                            <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Drag and drop an image here, or click to select
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              Supported formats: PNG, JPG, WEBP (Max 5MB)
                            </p>
                            <Input
                              id="nft-image"
                              type="file"
                              className="hidden"
                              onChange={handleImageChange}
                              accept="image/*"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("nft-image")?.click()}
                            >
                              Select Image
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attributes" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nft-quantity">Quantity</Label>
                        <Input
                          id="nft-quantity"
                          name="quantity"
                          value={mintFormData.quantity}
                          onChange={handleMintFormChange}
                          type="number"
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nft-unit">Unit</Label>
                        <Input
                          id="nft-unit"
                          name="unit"
                          value={mintFormData.unit}
                          onChange={handleMintFormChange}
                          placeholder="e.g., kg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nft-certification">Certification</Label>
                        <Input
                          id="nft-certification"
                          name="certification"
                          value={mintFormData.certification}
                          onChange={handleMintFormChange}
                          placeholder="e.g., Organic"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nft-harvest-year">Harvest Year</Label>
                        <Input
                          id="nft-harvest-year"
                          name="harvestYear"
                          value={mintFormData.harvestYear}
                          onChange={handleMintFormChange}
                          placeholder="e.g., 2023"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="recipient-safe">Recipient Safe Wallet (Optional)</Label>
                      <div className="relative">
                        <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recipient-safe"
                          name="recipientSafe"
                          value={mintFormData.recipientSafe}
                          onChange={handleMintFormChange}
                          placeholder="0x..."
                          className="pl-9"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If provided, proceeds from NFT sales will be sent to this Gnosis Safe multisig wallet
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label>Additional Attributes</Label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Trait Name" />
                          <Input placeholder="Value" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Trait Name" />
                          <Input placeholder="Value" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Attribute
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button type="submit" onClick={handleMintNFT}>
                  {connected ? "Mint NFT" : "Connect Wallet to Mint"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="marketplace" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <Card
                key={nft.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNFTClick(nft)}
              >
                <div className="aspect-square relative">
                  <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{nft.name}</CardTitle>
                      <CardDescription>
                        {nft.farm} • {nft.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {nft.price} {nft.currency}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm line-clamp-2 mb-2">{nft.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {nft.attributes.slice(0, 2).map((attr) => (
                      <Badge key={attr.trait_type} variant="outline" className="bg-green-50">
                        {attr.trait_type}: {attr.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="my-nfts" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {connected ? (
              nfts
                .filter((nft) => nft.owner === address)
                .map((nft) => (
                  <Card
                    key={nft.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleNFTClick(nft)}
                  >
                    <div className="aspect-square relative">
                      <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{nft.name}</CardTitle>
                          <CardDescription>
                            {nft.farm} • {nft.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {nft.price} {nft.currency}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm line-clamp-2 mb-2">{nft.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {nft.attributes.slice(0, 2).map((attr) => (
                          <Badge key={attr.trait_type} variant="outline" className="bg-green-50">
                            {attr.trait_type}: {attr.value}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Connect your wallet to view your NFTs</p>
                <Button onClick={connect} className="mt-4">
                  Connect Wallet
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedNFT && (
        <Dialog open={!!selectedNFT} onOpenChange={(open) => !open && setSelectedNFT(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedNFT.name}</DialogTitle>
              <DialogDescription>
                {selectedNFT.farm} • {selectedNFT.location}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square relative">
                <Image
                  src={selectedNFT.image || "/placeholder.svg"}
                  alt={selectedNFT.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedNFT.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Attributes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNFT.attributes.map((attr) => (
                      <div key={attr.trait_type} className="bg-muted rounded-md p-2 text-center">
                        <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                        <p className="text-sm font-medium">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Price</h4>
                  <p className="text-xl font-bold">
                    {selectedNFT.price} {selectedNFT.currency}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Owner</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedNFT.owner.slice(0, 6)}...{selectedNFT.owner.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              {selectedNFT.owner !== address ? (
                <Button onClick={handlePurchase} className="w-full">
                  {connected ? "Purchase NFT" : "Connect Wallet to Purchase"}
                </Button>
              ) : (
                <Button variant="outline" className="w-full">
                  List for Sale
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <FooterMenu />
    </main>
  )
}
