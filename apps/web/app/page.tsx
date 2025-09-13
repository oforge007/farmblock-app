import { FarmBlockCard } from "@/components/farmblock-card"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { DraggableChatbox } from "@/components/draggable-chatbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Leaf } from "lucide-react"
import { RegenerativeImage } from "@/components/regenerative-image"

// Sample farmblock data with unique values and new images
const farmblocks = [
  {
    id: 1,
    name: "Nairobi Farmers Circle",
    location: "Kenya",
    image: "/images/solar-pump-farm.jpeg",
    members: 24,
    pools: 3,
    staked: "1,250.00",
    crops: ["Quinoa", "Millet"],
  },
  {
    id: 2,
    name: "Addis Ababa Growers",
    location: "Ethiopia",
    image: "/images/greenhouse-structure.jpeg",
    members: 18,
    pools: 2,
    staked: "850.50",
    crops: ["Millet", "Teff"],
  },
  {
    id: 3,
    name: "Arusha Mountain Farmers",
    location: "Tanzania",
    image: "/images/onion-field.jpeg",
    members: 15,
    pools: 1,
    staked: "625.75",
    crops: ["Goji Berries", "Coffee"],
  },
  {
    id: 4,
    name: "Kampala Riverside Plots",
    location: "Uganda",
    image: "/images/corn-field.jpeg",
    members: 12,
    pools: 2,
    staked: "450.25",
    crops: ["Amaranth", "Cassava"],
  },
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav showBackButton={false} />

      <div className="w-full max-w-5xl px-4">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Search FarmBlocks..." className="pl-8 pr-10" />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-800/90 z-10"></div>
            <RegenerativeImage
              src="/images/solar-pump-farm.jpeg"
              alt="Regenerative farming"
              className="h-40 sm:h-60"
              priority
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="h-6 w-6" />
                <h1 className="text-2xl font-bold">FarmBlock</h1>
              </div>
              <p className="text-sm sm:text-base max-w-md">
                Empowering communities through sustainable agriculture and transparent governance on the Celo
                blockchain.
              </p>
              <Button className="mt-4 bg-white text-green-800 hover:bg-green-50 w-fit">Learn More</Button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Discover FarmBlocks</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {farmblocks.map((farmblock) => (
            <FarmBlockCard key={farmblock.id} farmblock={farmblock} />
          ))}
        </div>
      </div>

      <DraggableChatbox />
      <FooterMenu />
    </main>
  )
}
