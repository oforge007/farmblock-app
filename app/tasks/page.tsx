"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useMiniPay } from "@/hooks/use-minipay"
import { MainNav } from "@/components/main-nav"
import { FooterMenu } from "@/components/footer-menu"

// Sample task data
const tasks = [
  {
    id: 1,
    title: "Plant Quinoa Seeds",
    farm: "Sunshine Farms",
    location: "Kenya",
    reward: 50,
    currency: "cUSD",
    status: "open",
    deadline: "2023-06-15",
    description: "Plant 2 hectares of quinoa seeds following organic farming practices.",
    skills: ["planting", "organic"],
    createdBy: "Guardian",
  },
  {
    id: 2,
    title: "Harvest Millet",
    farm: "Green Valley",
    location: "Ethiopia",
    reward: 75,
    currency: "cUSD",
    status: "in-progress",
    deadline: "2023-06-10",
    description: "Harvest 1 hectare of golden millet and prepare for processing.",
    skills: ["harvesting"],
    createdBy: "Farmer",
  },
  {
    id: 3,
    title: "Irrigation System Maintenance",
    farm: "Mountain Heights",
    location: "Tanzania",
    reward: 30,
    currency: "cUSD",
    status: "completed",
    deadline: "2023-05-30",
    description: "Check and repair the drip irrigation system for the goji berry field.",
    skills: ["maintenance", "irrigation"],
    createdBy: "Guardian",
  },
  {
    id: 4,
    title: "Soil Testing",
    farm: "Riverside Plots",
    location: "Uganda",
    reward: 25,
    currency: "cUSD",
    status: "open",
    deadline: "2023-06-20",
    description: "Collect soil samples from all fields and send for laboratory testing.",
    skills: ["testing", "analysis"],
    createdBy: "Farmer",
  },
]

export default function TaskManager() {
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
  const { connected, connect } = useMiniPay()

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-20">
      <MainNav />

      <div className="w-full max-w-5xl px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground">
              Create, track, and complete farming tasks with rewards distributed via Gardens V2 funding pools.
            </p>
          </div>
          <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Create a new farming task with rewards distributed through Gardens V2 funding pools.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="Enter task title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="farm">Farm</Label>
                  <Select>
                    <SelectTrigger id="farm">
                      <SelectValue placeholder="Select farm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunshine">Sunshine Farms</SelectItem>
                      <SelectItem value="green">Green Valley</SelectItem>
                      <SelectItem value="mountain">Mountain Heights</SelectItem>
                      <SelectItem value="riverside">Riverside Plots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reward">Reward Amount</Label>
                    <Input id="reward" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="cUSD">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cUSD">cUSD</SelectItem>
                        <SelectItem value="cEUR">cEUR</SelectItem>
                        <SelectItem value="cKES">cKES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the task in detail" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="skills">Required Skills (comma separated)</Label>
                  <Input id="skills" placeholder="e.g., planting, harvesting, irrigation" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setNewTaskDialogOpen(false)}>
                  {connected ? "Create Task" : "Connect Wallet to Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{task.title}</CardTitle>
                      <CardDescription>
                        {task.farm} • {task.location}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      {getStatusBadge(task.status)}
                      <p className="text-sm text-muted-foreground mt-1">Created by: {task.createdBy}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm mb-4">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Deadline: {task.deadline}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-green-50">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {task.reward} {task.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">Reward</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {task.status === "open" && <Button variant="outline">Apply</Button>}
                  {task.status === "in-progress" && <Button variant="outline">Mark Complete</Button>}
                  <Button variant="outline">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          {/* Other tab contents remain the same */}
        </Tabs>
      </div>

      <FooterMenu />
    </main>
  )
}
