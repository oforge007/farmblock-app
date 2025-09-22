import { ThirdwebProvider } from "thirdweb/react";
import { client } from "@/lib/thirdweb-client"; // Adjust path
import type { Metadata } from 'next'
import './globals.css'

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
  return (
    <ThirdwebProvider client={client}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThirdwebProvider>
  );
}
