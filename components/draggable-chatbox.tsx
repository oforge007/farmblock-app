"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, MessageSquare, X, GripVertical } from "lucide-react"
import { motion } from "framer-motion"

export function DraggableChatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const constraintsRef = useRef(null)

  // Mock implementation of draggable functionality
  // In a real implementation, you would use a library like react-draggable or framer-motion
  const handleDrag = (e, info) => {
    setPosition({
      x: position.x + info.delta.x,
      y: position.y + info.delta.y,
    })
  }

  return (
    <div className="fixed bottom-20 right-4 z-50" ref={constraintsRef}>
      <motion.div drag dragConstraints={constraintsRef} onDrag={handleDrag} className="w-72">
        <Card className="shadow-lg">
          <CardHeader className="p-3 cursor-move flex flex-row items-center justify-between bg-green-50">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                How to use FarmBlock
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {isOpen && (
            <CardContent className="p-3 text-sm">
              <ol className="space-y-2 list-decimal list-inside">
                <li>Connect your wallet to the app</li>
                <li>Create a FarmBlock community</li>
                <li>Use the TaskManager to create and complete tasks</li>
                <li>Mint and trade agro-product NFTs in the NFT store</li>
                <li>Deposit funds into Mento yield pools</li>
                <li>Share updates via Warpcast and explore FarmBlock locations</li>
              </ol>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
