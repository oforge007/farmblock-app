"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { ProposalCard } from "./proposal-card"
import { cn } from "@/lib/utils"

export function ExpandablePool({ pool, type, onCreateProposal }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const borderColor = type === "task" ? "border-l-orange-400" : "border-l-blue-400"

  return (
    <div className="mb-4">
      <Card
        className={cn(
          "border-l-4 cursor-pointer hover:shadow-md transition-shadow",
          borderColor,
          isExpanded && "shadow-md",
        )}
        onClick={toggleExpand}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold">
                  {pool.name} <span className="text-sm text-muted-foreground">#{pool.id}</span>
                </h4>
                <Badge className={type === "task" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}>
                  {type === "task" ? "Task Pool" : "Proposal Pool"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-muted-foreground">Funds: {pool.funds} cUSD</p>
                <p className="text-sm text-muted-foreground">Proposals: {pool.proposals?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isExpanded && (
        <div className="pl-4 border-l-2 border-dashed border-gray-200 ml-4 mt-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            <div>
              <p className="text-sm font-medium">Voting Weight</p>
              <p className="text-sm">{pool.votingWeight}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Min Support</p>
              <p className="text-sm">{pool.minSupport}%</p>
            </div>
            {type === "task" && (
              <>
                <div>
                  <p className="text-sm font-medium">Collateral Deposit</p>
                  <p className="text-sm">{pool.collateralDeposit} cUSD</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
              </>
            )}
          </div>

          {pool.proposals && pool.proposals.length > 0 ? (
            <div className="space-y-3 mt-4">
              <h5 className="text-sm font-medium">Proposals</h5>
              {pool.proposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} type={type} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No proposals in this pool yet</p>
          )}

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation()
                onCreateProposal(pool, type)
              }}
            >
              <Plus className="h-3 w-3" />
              Create Proposal
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
