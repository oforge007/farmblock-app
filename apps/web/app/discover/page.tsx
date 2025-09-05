"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Leaf, ArrowLeft, Search, MapPin } from "lucide-react"
import { useMiniPay } from "@/hooks/use-minipay"

// Sample farm data
const farms = [
  {
    id: 1,
    name: "Sunshine Farms",
    location: "Nairobi, Kenya",
    coordinates: [-1.2921, 36.8219],
    crops: ["Quinoa", "Millet"],
    image: "/placeholder.svg?height=200&width=200",
    description: "A sustainable farm focusing on drought-resistant crops like quinoa and millet.",
  },
  {
    id: 2,
    name: "Green Valley",
    location: "Addis Ababa, Ethiopia",
    coordinates: [9.0054, 38.7636],
    crops: ["Millet", "Teff"],
    image: "/placeholder.svg?height=200&width=200",
    description: "Family-owned farm specializing in traditional Ethiopian grains.",
  },
  {
    id: 3,
    name: "Mountain Heights",
    location: "Arusha, Tanzania",
    coordinates: [-3.3869, 36.683],
    crops: ["Goji Berries", "Coffee"],
    image: "/placeholder.svg?height=200&width=200",
    description: "High-altitude farm producing specialty crops with unique flavor profiles.",
  },
  {
    id: 4,
    name: "Riverside Plots",
    location: "Kampala, Uganda",
    coordinates: [0.3476, 32.5825],
    crops: ["Amaranth", "Cassava"],
    image: "/placeholder.svg?height=200&width=200",
    description: "Riverside farm utilizing sustainable irrigation practices for year-round harvests.",
  },
]

export default function Discover() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [selectedFarm, setSelectedFarm] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { connected } = useMiniPay()

  // Filter farms based on search query
  const filteredFarms = farms.filter(
    (farm) =>
      farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farm.crops.some((crop) => crop.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Initialize MapBox map
  useEffect(() => {
    if (map.current) return // Map already initialized

    // This is a mock implementation since we don't have the actual MapBox SDK
    // In a real implementation, you would use the MapBox SDK
    console.log("Initializing MapBox map...")

    // Mock map initialization
    map.current = {
      loaded: true,
    }

    // Add markers for each farm
    farms.forEach((farm) => {
      console.log(`Adding marker for ${farm.name} at coordinates ${farm.coordinates}`)
    })
  }, [])

  const handleFarmClick = (farm) => {
    setSelectedFarm(farm)
    // In a real implementation, you would center the map on the farm's coordinates
    console.log(`Centering map on ${farm.name} at coordinates ${farm.coordinates}`)
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
        <h1 className="text-3xl font-bold mb-6">Discover Farms</h1>
        <p className="text-muted-foreground mb-8">
          Explore FarmBlock locations around the world with MapBox integration.
        </p>

        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search farms by name, location, or crop..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[500px] relative">
              <div ref={mapContainer} className="absolute inset-0 bg-gray-100 rounded-md">
                {/* MapBox map would be rendered here */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-lg font-medium">MapBox Integration</p>
                    <p className="text-sm text-muted-foreground">
                      In the actual implementation, a MapBox map would be displayed here with markers for each farm.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4 lg:h-[500px] lg:overflow-y-auto">
            {filteredFarms.map((farm) => (
              <Card
                key={farm.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedFarm?.id === farm.id ? "border-green-500" : ""
                }`}
                onClick={() => handleFarmClick(farm)}
              >
                <div className="flex">
                  <div className="w-24 h-24 relative">
                    <Image
                      src={farm.image || "/placeholder.svg"}
                      alt={farm.name}
                      fill
                      className="object-cover rounded-l-md"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-medium">{farm.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {farm.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {farm.crops.map((crop) => (
                        <span key={crop} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedFarm && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{selectedFarm.name}</CardTitle>
              <CardDescription>{selectedFarm.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video relative rounded-md overflow-hidden">
                  <Image
                    src={selectedFarm.image || "/placeholder.svg"}
                    alt={selectedFarm.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">About this Farm</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedFarm.description}</p>
                  <h3 className="font-medium mb-2">Crops</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedFarm.crops.map((crop) => (
                      <span key={crop} className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-medium mb-2">Coordinates</h3>
                  <p className="text-sm text-muted-foreground">
                    Latitude: {selectedFarm.coordinates[0]}, Longitude: {selectedFarm.coordinates[1]}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">View Products</Button>
              <Button>Contact Farmer</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}
