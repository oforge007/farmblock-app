import ComingSoon from "@/components/ComingSoon";
import { MainNav } from "@/components/main-nav";
import { FooterMenu } from "@/components/footer-menu";


export default function NFTDropPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />
      <ComingSoon />
      <FooterMenu />
    </main>
  )
}
