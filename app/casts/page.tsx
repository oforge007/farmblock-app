import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { WarpcastFeed } from "@/components/warpcast-feed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function CastsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <h1 className="text-2xl font-bold mb-6">FarmBlock Casts</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Updates
            </CardTitle>
            <CardDescription>Share and view updates from farmers across the FarmBlock ecosystem</CardDescription>
          </CardHeader>
          <CardContent>
            <WarpcastFeed />
          </CardContent>
        </Card>
      </div>

      <FooterMenu />
    </main>
  )
}
