"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Leaf, ArrowLeft, ShoppingCart, Filter } from "lucide-react"
import { useMiniPay } from "@/hooks/use-minipay"

// Sample product data
const products = [
  {
    id: 1,
    name: "Organic Quinoa",
    farm: "Sunshine Farms",
    location: "Kenya",
    price: 5.99,
    currency: "cUSD",
    image: "/placeholder.svg?height=200&width=200",
    available: 50,
    unit: "kg",
    tags: ["organic", "sustainable"],
  },
  {
    id: 2,
    name: "Golden Millet",
    farm: "Green Valley",
    location: "Ethiopia",
    price: 3.49,
    currency: "cUSD",
    image: "/placeholder.svg?height=200&width=200",
    available: 100,
    unit: "kg",
    tags: ["pesticide-free"],
  },
  {
    id: 3,
    name: "Goji Berries",
    farm: "Mountain Heights",
    location: "Tanzania",
    price: 12.99,
    currency: "cUSD",
    image: "/placeholder.svg?height=200&width=200",
    available: 25,
    unit: "kg",
    tags: ["organic", "superfood"],
  },
  {
    id: 4,
    name: "Amaranth Grain",
    farm: "Riverside Plots",
    location: "Uganda",
    price: 4.75,
    currency: "cUSD",
    image: "/placeholder.svg?height=200&width=200",
    available: 75,
    unit: "kg",
    tags: ["gluten-free", "sustainable"],
  },
]

export default function Marketplace() {
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([])
  const { connected, connect, pay } = useMiniPay()

  const addToCart = (productId: number) => {
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { id: productId, quantity: 1 }])
    }
  }

  const getCartTotal = () => {
    return cart
      .reduce((total, item) => {
        const product = products.find((p) => p.id === item.id)
        return total + (product ? product.price * item.quantity : 0)
      }, 0)
      .toFixed(2)
  }

  const handleCheckout = async () => {
    if (!connected) {
      await connect()
      return
    }

    const total = Number.parseFloat(getCartTotal())

    try {
      // Here you would integrate with MiniPay to process the payment
      await pay({
        amount: total,
        currency: "cUSD",
        recipient: "0x123...", // Farm's wallet address
        description: `Purchase of agricultural products`,
      })

      // Clear cart after successful payment
      setCart([])
      alert("Payment successful! Your order has been placed.")
    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed. Please try again.")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm flex mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <p className="font-bold text-xl">FarmBlock</p>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Agricultural Marketplace</h1>

        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="grains">Grains</TabsTrigger>
              <TabsTrigger value="fruits">Fruits</TabsTrigger>
              <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
            </TabsList>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>
                        {product.farm} • {product.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {product.price} {product.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.available} {product.unit} available
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-green-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button onClick={() => addToCart(product.id)} className="w-full">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="grains">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Filter by grains to see products in this category</p>
            </div>
          </TabsContent>

          <TabsContent value="fruits">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Filter by fruits to see products in this category</p>
            </div>
          </TabsContent>

          <TabsContent value="vegetables">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Filter by vegetables to see products in this category</p>
            </div>
          </TabsContent>
        </Tabs>

        {cart.length > 0 && (
          <Card className="sticky bottom-4 mt-8">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Cart Total: {getCartTotal()} cUSD</p>
                  <p className="text-sm text-muted-foreground">
                    {cart.reduce((total, item) => total + item.quantity, 0)} items in cart
                  </p>
                </div>
                <Button onClick={handleCheckout}>
                  {connected ? "Checkout with MiniPay" : "Connect Wallet to Checkout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
