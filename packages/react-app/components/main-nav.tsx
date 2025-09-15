"use client"

import { Button } from "@/components/ui/button"
import { Plus, Globe } from "lucide-react"
import Link from "next/link"
import { LogoWithMap } from "./logo-with-map"
import { useWallet } from "@/hooks/use-minipay"
import { DocMenu } from "./doc-menu"

export function MainNav({ showBackButton = true }) {
  const { connected, connect } = useWallet()

  return (
    <div className="z-10 w-full items-center justify-between text-sm flex mb-4 py-3 px-4 border-b">
      <div className="flex items-center gap-3">
        <LogoWithMap />
        <Link href="/map">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">Map</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <DocMenu />
        <Link href="/create-farmblock">
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create FarmBlock</span>
          </Button>
        </Link>

        {!connected && (
          <Button size="sm" variant="outline" onClick={connect}>
            Connect
          </Button>
        )}
      </div>
    </div>
  )
}
