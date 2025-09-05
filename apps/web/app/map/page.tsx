"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Leaf, Users } from "lucide-react"

export default function MapPage() {
  const [activeTab, setActiveTab] = useState("map")

  // This would be replaced with actual MapBox integration
  const farmLocations = [
    {
      id: 1,
      name: "Nairobi Farmers Circle",
      location: "Kenya",
      lat: -1.286389,
      lng: 36.817223,
      crops: ["Quinoa", "Millet"],
    },
    {
      id: 2,
      name: "Addis Ababa Growers",
      location: "Ethiopia",
      lat: 9.005401,
      lng: 38.763611,
      crops: ["Millet", "Teff"],
    },
    {
      id: 3,
      name: "Arusha Mountain Farmers",
      location: "Tanzania",
      lat: -3.386925,
      lng: 36.683219,
      crops: ["Onions", "Coffee"],
    },
    {
      id: 4,
      name: "Kampala Riverside Plots",
      location: "Uganda",
      lat: 0.347596,
      lng: 32.58252,
      crops: ["Corn", "Cassava"],
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">FarmBlock Map</h1>
          <p className="text-muted-foreground">Explore sustainable farms across the globe</p>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Interactive Map</CardTitle>
                <CardDescription>Click on pins to view FarmBlock details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-md h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">MapBox integration will be implemented here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing {farmLocations.length} FarmBlock locations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {farmLocations.map((farm) => (
                <Card key={farm.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{farm.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {farm.location}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {farm.crops.map((crop, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {crop}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Community members</span>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FooterMenu />
    </main>
  )
}
