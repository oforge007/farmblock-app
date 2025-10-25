"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, MessageSquare, X, GripVertical } from "lucide-react"
import { LanguageContext } from "@/components/language/LanguageProvider"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function DraggableChatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { language, setLanguage, t, languageName } = useContext(LanguageContext)
  const [langQuery, setLangQuery] = useState("")
  const constraintsRef = useRef(null)

  // Mock implementation of draggable functionality
  // In a real implementation, you would use a library like react-draggable or framer-motion
  const handleDrag = (e: any, info: { delta: { x: number; y: number } }) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    })
  }

  return (
    <div className="fixed bottom-20 right-4 z-50" ref={constraintsRef}>
      <motion.div drag dragConstraints={constraintsRef} onDrag={handleDrag} className="w-72">
        {/* Social Links */}
        <div className="mb-4 flex justify-end gap-2">
          <a
            href="https://discord.gg/ZR2sFhkN"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a
            href="https://x.com/0xfarmblock?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://github.com/oforge007/farmblock-app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="p-3 cursor-move flex flex-row items-center justify-between bg-green-50">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                How to use FarmBlock
              </CardTitle>
            </div>
              <div className="flex items-center gap-2">
                {/* Simplified language selector: show 2-letter code badge and a compact dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-auto px-2">
                      <div className="text-[11px] font-semibold px-2 py-0.5 rounded bg-green-100 text-green-700">{language}</div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Choose language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setLanguage("EN")}>English (EN)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage("ES")}>Español (ES)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage("FR")}>Français (FR)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="text-xs font-semibold px-2 py-0.5 rounded bg-green-50 text-green-700">{languageName}</div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
          </CardHeader>
          {isOpen && (
            <CardContent className="p-3 text-sm">
              <ol className="space-y-2 list-decimal list-inside">
                <li>{t("step_connect_wallet")}</li>
                <li>{t("step_create_community")}</li>
                <li>{t("step_task_manager")}</li>
                <li>{t("step_mint_nft")}</li>
                <li>{t("step_deposit")}</li>
                <li>{t("step_share")}</li>
              </ol>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
