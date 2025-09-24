"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { SocialIcon } from "thirdweb/react";

export function DocMenu() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <FileText className="h-5 w-5" />
          <span className="sr-only">Documentation</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Documentation</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/docs" className="flex items-center gap-2 cursor-pointer">
            <FileText className="h-4 w-4" />
            <span>FarmBlock Documentation</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Social Media</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a
            href="https://x.com/0xfarmblock?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <SocialIcon provider="twitter" style={{ width: 16, height: 16 }} />
            <span>X</span>
            <ExternalLink className="h-3 w-3 ml-auto" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/oforge007/farmblock-app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3 ml-auto" />
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://discord.gg/vXVpxp3U"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <SocialIcon provider="discord" style={{ width: 16, height: 16 }} />
            <span>Discord</span>
            <ExternalLink className="h-3 w-3 ml-auto" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
