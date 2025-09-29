import { MainNav } from "@/components/main-nav";
import ComingSoon from "@/components/ComingSoon";
import { FooterMenu } from "@/components/footer-menu";


export default function CastsPage() {
    return (
        <main className="flex min-h-screen flex-col items-center pb-20">
          <MainNav />
          <ComingSoon />
          <FooterMenu />
        </main>
      )
    }