import Image from "next/image"
import { cn } from "@/lib/utils"

interface RegenerativeImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function RegenerativeImage({ src, alt, className, priority = false }: RegenerativeImageProps) {
  // Array of regenerative farming images
  const regenerativeImages = [
    "/images/solar-pump-farm.jpeg",
    "/images/greenhouse-structure.jpeg",
    "/images/refi-farm-1.png",
    "/images/refi-farm-2.png",
  ]

  // If src is a placeholder, use one of our regenerative images
  const imageSrc = src.includes("placeholder")
    ? regenerativeImages[Math.floor(Math.random() * regenerativeImages.length)]
    : src

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform hover:scale-105 duration-700"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}
