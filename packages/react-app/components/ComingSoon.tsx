
import { MainNav } from "@/components/main-nav"
export default function ComingSoon() {
  return (
     
    <div>
      <main className="flex min-h-screen flex-col items-center pb-20">
        <MainNav showBackButton={false} />
        <h1>
          🚧 Coming Soon 🚧
        </h1>
        <p style={{ marginTop: "1rem", color: "#666" }}>
          Tasks, NFT Drops and Marketplace integrations are on the way. Stay tuned!
        </p>
      </main>
    </div>
  );
}
