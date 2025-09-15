"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Heart, Repeat, Share2, Send } from "lucide-react"
import { useWallet } from "@/hooks/use-minipay"

// Sample casts data
const casts = [
  {
    id: 1,
    author: {
      name: "Alice",
      handle: "alice_farmer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just harvested our first batch of organic quinoa at Sunshine Farms! 50kg of premium quality grain ready for the market. #FarmBlock #SustainableAgriculture",
    timestamp: "2h ago",
    likes: 24,
    recasts: 5,
    replies: 3,
  },
  {
    id: 2,
    author: {
      name: "Bob",
      handle: "bob_guardian",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Excited to announce that our community just approved a new irrigation system for Green Valley farms through Gardens V2 governance! 500 cUSD allocated from the FarmBlock Safe. #CommunityGovernance",
    timestamp: "5h ago",
    likes: 18,
    recasts: 7,
    replies: 2,
  },
  {
    id: 3,
    author: {
      name: "Carol",
      handle: "carol_farmer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just minted my first NFT for our goji berry harvest! Check it out in the FarmBlock NFT store. Limited batch of 20kg available for purchase with cUSD. #NFTAgriculture",
    timestamp: "1d ago",
    likes: 32,
    recasts: 9,
    replies: 5,
  },
]

export function WarpcastFeed() {
  const [newCast, setNewCast] = useState("")
  const { connected, connect } = useWallet()

  const handlePostCast = async () => {
    if (!connected) {
      await connect()
      return
    }

    if (!newCast.trim()) return

    // Here you would integrate with Warpcast to post a new cast
    alert("Cast posted successfully!")
    setNewCast("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>FarmBlock Updates</CardTitle>
          <CardDescription>Share updates about your farm activities via Warpcast</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's happening on your farm?"
            value={newCast}
            onChange={(e) => setNewCast(e.target.value)}
            rows={3}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handlePostCast} disabled={!newCast.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Post Update
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        {casts.map((cast) => (
          <Card key={cast.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={cast.author.avatar || "/placeholder.svg"} alt={cast.author.name} />
                  <AvatarFallback>{cast.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{cast.author.name}</p>
                    <p className="text-sm text-muted-foreground">@{cast.author.handle}</p>
                    <p className="text-sm text-muted-foreground">· {cast.timestamp}</p>
                  </div>
                  <p className="mt-2">{cast.content}</p>
                  <div className="flex items-center gap-6 mt-4">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                      <MessageSquare className="h-4 w-4" />
                      <span>{cast.replies}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-green-600">
                      <Repeat className="h-4 w-4" />
                      <span>{cast.recasts}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600">
                      <Heart className="h-4 w-4" />
                      <span>{cast.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
