"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, MapPin } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreateFarmBlock() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    latitude: "",
    longitude: "",
    size: "",
    cropType: "",
    description: "",
    registrationStake: "5.1", // Default registration stake
    safeWallet: "", // Gnosis Safe wallet address
    mission: "", // Mission statement
    governanceRules: "", // Governance rules
    stakeCurrency: "cUSD",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { connected, connect, address } = useWallet()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected) {
      await connect()
      return
    }

    // Here you would integrate with the blockchain to create the FarmBlock
    console.log("Creating FarmBlock with data:", formData)
    console.log("Uploaded file:", selectedFile)

    // Simulate success and redirect
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-3xl px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Your FarmBlock</CardTitle>
            <CardDescription>
              Register your farm on the blockchain to start trading your agricultural products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="governance">Governance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input
                      id="farmName"
                      name="farmName"
                      placeholder="Enter your farm's name"
                      value={formData.farmName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="latitude"
                          name="latitude"
                          type="text"
                          placeholder="e.g. 0.3476"
                          value={formData.latitude}
                          onChange={handleChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="longitude"
                          name="longitude"
                          type="text"
                          placeholder="e.g. 32.5825"
                          value={formData.longitude}
                          onChange={handleChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Geo-coordinates will be used to display your farm on the MapBox integration
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="size">Farm Size (hectares)</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      placeholder="Size in hectares"
                      value={formData.size}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cropType">Primary Crop</Label>
                    <Select onValueChange={(value) => handleSelectChange("cropType", value)} value={formData.cropType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quinoa">Quinoa</SelectItem>
                        <SelectItem value="millet">Millet</SelectItem>
                        <SelectItem value="goji">Goji Berries</SelectItem>
                        <SelectItem value="amaranth">Amaranth</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Farm Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your farm and sustainable practices"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="governance" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="safeWallet">Gnosis Safe Wallet Address</Label>
                    <Input
                      id="safeWallet"
                      name="safeWallet"
                      placeholder="0x..."
                      value={formData.safeWallet}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      This multisig wallet will be used as your FarmBlock Safe for community governance
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationStake">Registration Stake</Label>
                    <div className="flex gap-2">
                      <Input
                        id="registrationStake"
                        name="registrationStake"
                        type="number"
                        step="0.1"
                        placeholder="5.1"
                        value={formData.registrationStake}
                        onChange={handleChange}
                        required
                        className="flex-1"
                      />
                      <Select onValueChange={(value) => handleSelectChange("stakeCurrency", value)} defaultValue="cUSD">
                        <SelectTrigger className="w-[110px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cUSD">cUSD</SelectItem>
                          <SelectItem value="cEUR">cEUR</SelectItem>
                          <SelectItem value="cREAL">cREAL</SelectItem>
                          <SelectItem value="cKES">cKES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This is the amount new members will need to stake to join your FarmBlock community
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission Statement</Label>
                    <Textarea
                      id="mission"
                      name="mission"
                      placeholder="Describe your FarmBlock's mission and vision"
                      value={formData.mission}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="governanceRules">Governance Rules</Label>
                    <Textarea
                      id="governanceRules"
                      name="governanceRules"
                      placeholder="Outline the governance rules for your community"
                      value={formData.governanceRules}
                      onChange={handleChange}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      These rules will be displayed on your FarmBlock overview page and guide community decisions
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="document">Upload Documentation (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to select files
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                      </p>
                      <Input
                        id="document"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("document")?.click()}
                      >
                        Select File
                      </Button>
                    </div>
                    {selectedFile && (
                      <div className="flex items-center justify-between bg-muted p-2 rounded-md mt-2">
                        <span className="text-sm truncate">{selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              {connected ? "Create FarmBlock" : "Proof Self and Create FarmBlock"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <FooterMenu />
    </main>
  )
}
