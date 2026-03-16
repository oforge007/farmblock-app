"use client"

import { useEffect, useMemo, useState } from "react"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComingSoon } from "@/components/coming-soon"


  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />
      <ComingSoon/>
      <FooterMenu />
    </main>
  )
}
