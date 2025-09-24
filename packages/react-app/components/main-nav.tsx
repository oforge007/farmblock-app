"use client"

import { Button } from "@/components/ui/button"
import { Plus, Globe } from "lucide-react"
import Link from "next/link"
import { LogoToHome } from "./logo"
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { DocMenu } from "./doc-menu"

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export function MainNav() {

  return (
    <div className="z-10 w-full items-center justify-between text-sm flex mb-4 py-3 px-4 border-b">
      <div className="flex items-center gap-3">
        <LogoToHome />
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

        <ConnectButton client={client} />
      </div>
    </div>
  )
}
