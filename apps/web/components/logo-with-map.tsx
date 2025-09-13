"use client"

import { useState, useRef, useEffect } from "react"
import { Leaf } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"

export function LogoWithMap() {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (!isMapOpen || !mapContainer.current || map.current) return

    // This is a mock implementation since we don't have the actual MapBox SDK
    // In a real implementation, you would use the MapBox SDK
    console.log("Initializing MapBox map in logo dialog...")

    // Mock map initialization
    map.current = {
      loaded: true,
    }
  }, [isMapOpen])

  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-2"
        onClick={(e) => {
          e.preventDefault()
          setIsMapOpen(true)
        }}
      >
        <Leaf className="h-6 w-6 text-green-600" />
        <p className="font-bold text-xl hidden sm:block">FarmBlock</p>
      </Link>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <div ref={mapContainer} className="h-[400px] w-full bg-gray-100 relative">
            {/* MapBox map would be rendered here */}
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium">FarmBlock Locations</p>
                <p className="text-sm text-muted-foreground">
                  Interactive map showing all registered FarmBlocks around the world
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
