"use client"

import { useEffect, useMemo, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FarmblockCast {
  id: string
  author: string
  farmblockName: string
  title: string
  description: string
  videoUrl: string
  createdAt: string
}

interface FarmblockEntry {
  id: string
  farmName: string
}

export default function CastsPage() {
  const [farmblocks, setFarmblocks] = useState<FarmblockEntry[]>([])
  const [selectedFarmblockId, setSelectedFarmblockId] = useState<string>("")
  const [casts, setCasts] = useState<FarmblockCast[]>([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [author, setAuthor] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return

    const savedFarmblocks = localStorage.getItem("farmblocks")
    if (savedFarmblocks) {
      try {
        const parsed = JSON.parse(savedFarmblocks)
        if (Array.isArray(parsed)) {
          const mapped = parsed.map((fb: any) => ({ id: fb.id?.toString() ?? "", farmName: fb.farmName ?? "Unnamed" }))
          setFarmblocks(mapped)
          if (!selectedFarmblockId && mapped.length > 0) setSelectedFarmblockId(mapped[0].id)
        }
      } catch (err) {
        console.warn("Could not parse farmblocks:", err)
      }
    }

    const savedCasts = localStorage.getItem("farmblockCasts")
    if (savedCasts) {
      try {
        const parsed = JSON.parse(savedCasts)
        if (Array.isArray(parsed)) {
          setCasts(parsed)
        }
      } catch (err) {
        console.warn("Could not parse casts:", err)
      }
    }
  }, [selectedFarmblockId])

  const currentFarmName = useMemo(() => {
    return farmblocks.find((fb) => fb.id === selectedFarmblockId)?.farmName ?? "General"
  }, [farmblocks, selectedFarmblockId])

  const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

  const addCast = () => {
    if (!title.trim() || !videoUrl.trim() || !author.trim()) return

    const cast: FarmblockCast = {
      id: generateId(),
      author: author.trim(),
      farmblockName: currentFarmName,
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
      createdAt: new Date().toISOString(),
    }

    const next = [cast, ...casts]
    setCasts(next)
    localStorage.setItem("farmblockCasts", JSON.stringify(next))

    setTitle("")
    setDescription("")
    setVideoUrl("")
    setAuthor("")
  }

  const normalizeEmbed = (url: string) => {
    try {
      const u = new URL(url)
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.slice(1)
        return `https://www.youtube.com/embed/${id}`
      }
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`
      }

      return url
    } catch {
      return url
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />
      <div className="w-full max-w-5xl px-4 pt-4">
        <h1 className="text-2xl font-bold mb-3">FarmBlock Casts</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Share farm updates with the community: video logs, progress stories, harvesting highlights, and donor trust reels.
        </p>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Post a new cast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectBlock
                farmblocks={farmblocks}
                selectedFarmblockId={selectedFarmblockId}
                setSelectedFarmblockId={setSelectedFarmblockId}
              />
              <label className="space-y-1 text-sm">
                <span>Author (guardian/member)</span>
                <Input value={author} onChange={(e: any) => setAuthor(e.target.value)} placeholder="Your name or wallet alias" />
              </label>
            </div>

            <label className="space-y-1 text-sm">
              <span>Title</span>
              <Input value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder="Short cast headline" />
            </label>

            <label className="space-y-1 text-sm">
              <span>Description</span>
              <Textarea value={description} onChange={(e: any) => setDescription(e.target.value)} placeholder="What was the activity?" />
            </label>

            <label className="space-y-1 text-sm">
              <span>Video URL (YouTube or direct MP4)</span>
              <Input value={videoUrl} onChange={(e: any) => setVideoUrl(e.target.value)} placeholder="https://..." />
            </label>

            <Button onClick={addCast} className="w-full">
              Publish Cast
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {casts.length === 0 ? (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent>No casts yet. Start by posting your first farm update.</CardContent>
            </Card>
          ) : (
            casts.map((cast) => (
              <Card key={cast.id} className="border-green-200">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                    <div>
                      <CardTitle>{cast.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {cast.farmblockName} • {cast.author} • {new Date(cast.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 rounded">FarmBlock Update</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm">{cast.description}</p>
                  {cast.videoUrl ? (
                    <div className="w-full h-60 sm:h-80 bg-black/5 rounded overflow-hidden">
                      {cast.videoUrl.includes("youtube") || cast.videoUrl.includes("youtu.be") ? (
                        <iframe
                          src={normalizeEmbed(cast.videoUrl)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={cast.videoUrl} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No video URL provided.</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <FooterMenu />
    </main>
  )
}

function SelectBlock({
  farmblocks,
  selectedFarmblockId,
  setSelectedFarmblockId,
}: {
  farmblocks: FarmblockEntry[]
  selectedFarmblockId: string
  setSelectedFarmblockId: (value: string) => void
}) {
  return (
    <label className="text-sm space-y-1">
      <span>FarmBlock</span>
      <select
        className="w-full p-2 border rounded"
        value={selectedFarmblockId}
        onChange={(e) => setSelectedFarmblockId(e.target.value)}
      >
        <option value="">General FarmBlock Feed</option>
        {farmblocks.map((fb) => (
          <option key={fb.id} value={fb.id}>
            {fb.farmName}
          </option>
        ))}
      </select>
    </label>
  )
}
