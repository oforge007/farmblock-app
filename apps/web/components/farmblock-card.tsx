import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Database, Coins } from "lucide-react"
import { RegenerativeImage } from "@/components/regenerative-image"

export function FarmBlockCard({ farmblock }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border-green-100 hover:border-green-300">
      <div className="aspect-square relative">
        <RegenerativeImage
          src={farmblock.image || "/placeholder.svg?height=300&width=300"}
          alt={farmblock.name}
          className="w-full h-full"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{farmblock.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{farmblock.location}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm">Members: {farmblock.members}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-green-600" />
            <span className="text-sm">Pools: {farmblock.pools}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-green-600" />
            <span className="text-sm">Staked: {farmblock.staked} cUSD</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-green-50 p-4">
        <Link href={`/farmblock/${farmblock.id}`} className="w-full">
          <Button variant="outline" className="w-full border-green-300 hover:bg-green-100 hover:text-green-800">
            View FarmBlock
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
