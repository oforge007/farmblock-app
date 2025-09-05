import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Check } from "lucide-react"

export function ProposalCard({ proposal, type }) {
  const canExecute = type === "task" && proposal.support >= proposal.minSupport

  return (
    <Card
      className={`overflow-hidden hover:shadow-sm transition-shadow border-l-4 ${proposal.borderColor || "border-l-gray-400"}`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{proposal.title}</h3>
              <Badge className="bg-green-100 text-green-700">{proposal.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              ID {proposal.id} • {proposal.date}
            </p>
          </div>

          {type === "task" && (
            <div className="text-right">
              <p className="font-medium">
                {proposal.requestedAmount} {proposal.currency}
              </p>
              <p className="text-xs text-muted-foreground">Requested amount</p>
            </div>
          )}
        </div>

        {proposal.description && <p className="text-sm mb-4">{proposal.description}</p>}

        {type === "task" && proposal.beneficiary && (
          <p className="text-xs text-muted-foreground mb-3">
            Beneficiary: {proposal.beneficiary.slice(0, 6)}...{proposal.beneficiary.slice(-4)}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Total Support: {proposal.support}% of pool weight</span>
            <span>At least {proposal.minSupport}% needed</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min((proposal.support / 100) * 100, 100)}%` }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full border-r-2 border-dashed border-gray-500"
              style={{ width: `${Math.min((proposal.minSupport / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Vote
          </Button>

          {canExecute && (
            <Button size="sm" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
              <Check className="h-3 w-3" />
              Execute
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
