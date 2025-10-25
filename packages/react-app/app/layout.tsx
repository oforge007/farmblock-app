import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/thirdweb-client"; // Adjust path
import type { Metadata } from 'next'
import './globals.css'
import LanguageProvider from '@/components/language/LanguageProvider'

export const metadata: Metadata = {
  title: 'FarmBlock',
  description: 'A decentralized farming management platform.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // keep ThirdwebProvider default usage to avoid mismatched prop types in this repo
  return (
    <ThirdwebProvider>
      <LanguageProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </LanguageProvider>
    </ThirdwebProvider>
  )
}
