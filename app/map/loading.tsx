import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <Skeleton className="h-10 w-full mb-6" />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      <FooterMenu />
    </main>
  )
}
