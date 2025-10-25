"use client"

import { useActiveAccount, ConnectButton } from "thirdweb/react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Your UI lib
import { Plus, Globe } from "lucide-react"
import { LogoToHome } from "./logo"
import { createThirdwebClient } from "thirdweb";
import { useState } from "react";

// We'll load the Verify widget on demand (only when the user clicks the icon).
// This ensures heavy libraries pulled in by @selfxyz/qrcode are not bundled in
// server builds or included in initial client bundles.

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export function MainNav() {
const account = useActiveAccount();
const address = account?.address;

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
        <Link href="/create-farmblock">
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create FarmBlock</span>
          </Button>
        </Link>

        <ConnectButton client={client} />
        {/* Icon button that loads the Verify widget on demand */}
        <VerifyLauncher address={address} />
      </div>
    </div>
  )
}

function VerifyLauncher({ address }: { address?: string }) {
  const [VerifyComp, setVerifyComp] = useState<null | any>(null);
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    if (!VerifyComp) {
      const mod = await import("./SELF-zk");
      setVerifyComp(() => mod.Verify);
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        onClick={handleClick}
        className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
        aria-label="Open verification widget"
      >
        {/* Use a compact globe icon for the verifier launcher */}
        <Globe className="h-4 w-4" />
      </Button>

      {open && VerifyComp ? (
        <div className="absolute right-0 mt-2 z-20 w-[320px] p-2 bg-white border rounded-md shadow-lg">
          <VerifyComp address={address} />
        </div>
      ) : null}
    </div>
  );
}
