import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Zap, Users, Coins, LightbulbIcon as LightBulb } from "lucide-react"
import { Button } from "@/components/ui/button"

// Fix the component to handle undefined pool prop
export function FundingPoolCard({ pool = {}, type = "task" }) {
  // Add default values to prevent undefined errors
  const { name = "", id = "", votingWeight = "0", proposals = "0", funds = "0" } = pool

  return (
    <Card className="overflow-hidden mb-4 hover:shadow-md transition-shadow border-l-4 border-l-orange-400">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {type === "task" ? (
            <Wrench className="h-5 w-5 text-gray-600" />
          ) : (
            <LightBulb className="h-5 w-5 text-gray-600" />
          )}
          <h3 className="text-lg font-bold">{name}</h3>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">POOL ID: #{id}</div>
          <Badge className={type === "task" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}>
            <Coins className="h-3 w-3 mr-1" />
            {type === "task" ? "Task Pool" : "Proposal Pool"}
          </Badge>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Voting weight: {votingWeight}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Proposals: {proposals}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Funds: {funds} cUSD</span>
          </div>
        </div>

        <div className="mt-4 h-4 bg-blue-200 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500"
            style={{ width: `${Math.min(Number.parseFloat(funds) * 10, 100)}%` }}
          ></div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button size="sm">Fund Pool</Button>
        </div>
      </CardContent>
    </Card>
  )
}
