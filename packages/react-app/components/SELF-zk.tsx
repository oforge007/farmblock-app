"use client"

import { useEffect, useState } from "react";
import { SelfAppBuilder, getUniversalLink } from "@selfxyz/qrcode";

export function Verify({ address }: { address?: string }) {
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const [universalLink, setUniversalLink] = useState("");

  useEffect(() => {
    if (!address) return; // Wait for address to be available

    const app = new SelfAppBuilder({
      userId: address,
      version: 2,
      appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || 'Self Docs',
      scope: process.env.NEXT_PUBLIC_SELF_SCOPE || 'self-docs',
      endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
      logoBase64: 'https://i.postimg.cc/mrmVf9hm/self.png',
      endpointType: 'staging_celo',
      userIdType: 'hex', // 'hex' for EVM address or 'uuid' for uuidv4
      userDefinedData: 'Hello from the Docs!!',
      disclosures: {
       

        // What you want users to
        nationality: true,
        gender: true,
      },
      deeplinkCallback: "https://farmblock.vercel.app", // Replace with your callback
      // ...other config as needed
    }).build();

    setSelfApp(app);
    setUniversalLink(getUniversalLink(app));
  }, [address]);

  const openSelfApp = () => {
    if (!universalLink) return;
    window.open(universalLink, "_blank");
  };

  if (!address) {
    return <div>Connect and verify.</div>;
  }

  return (
    <div>
      {selfApp ? (
        <button type="button" onClick={openSelfApp} disabled={!universalLink}>
          Proof Self
        </button>
      ) : (
        <div>
          <p>Loading QR Code...</p>
        </div>
      )}
    </div>
  );
}
