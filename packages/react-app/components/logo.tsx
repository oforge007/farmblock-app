"use client"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react"
import { Leaf } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function LogoToHome() {

  const handleGoHome = () => {
    window.location.href = "/"; // Navigates to home page
  };
  return (
    <div>
      <button onClick={handleGoHome}>
        <Leaf className="h-6 w-6 text-green-600" />
        <p className="font-bold text-xl hidden sm:block">FarmBlock</p>
      </button>
      {/* Your map and other components */}
    </div>
  );
}