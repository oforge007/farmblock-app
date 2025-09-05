"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Database, Coins } from "lucide-react"

export function FooterMenu() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-40 backdrop-blur-sm bg-white/90">
      <Link href="/pools" className="flex-1">
        <Button
          variant="ghost"
          className="flex flex-col h-auto py-1 w-full rounded-xl transition-all hover:bg-green-50"
        >
          <Database className="h-5 w-5 text-green-600" />
          <span className="text-xs mt-1 font-medium">Task Pools</span>
        </Button>
      </Link>

      <Link href="/casts" className="flex-1">
        <Button
          variant="ghost"
          className="flex flex-col h-auto py-1 w-full rounded-xl transition-all hover:bg-green-50"
        >
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span className="text-xs mt-1 font-medium">Casts</span>
        </Button>
      </Link>

      <Link href="/nft-store" className="flex-1">
        <Button
          variant="ghost"
          className="flex flex-col h-auto py-1 w-full rounded-xl transition-all hover:bg-green-50"
        >
          <Coins className="h-5 w-5 text-green-600" />
          <span className="text-xs mt-1 font-medium">NFT Store</span>
        </Button>
      </Link>
    </div>
  )
}
