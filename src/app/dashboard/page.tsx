"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  // Mock data - in a real app, this would come from an API
  const widgets = [
    {
      id: "1",
      name: "Product Assistant",
      description: "Helps customers find the right products",
      status: "Active",
      lastUpdated: "2 days ago",
      conversations: 124,
    },
    {
      id: "2",
      name: "Support Chat",
      description: "Answers customer service questions",
      status: "Active",
      lastUpdated: "1 week ago",
      conversations: 87,
    },
    {
      id: "3",
      name: "Checkout Helper",
      description: "Assists with order completion",
      status: "Active",
      lastUpdated: "3 weeks ago",
      conversations: 56,
    },
    {
      id: "4",
      name: "Product Recommender",
      description: "Recommends products based on customer preferences",
      status: "Draft",
      lastUpdated: "1 day ago",
      conversations: 0,
    },
    {
      id: "5",
      name: "Return Assistant",
      description: "Helps with return and exchange process",
      status: "Inactive",
      lastUpdated: "1 month ago",
      conversations: 23,
    }
  ];

  // Function to determine badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/integration">
              <Button variant="outline">Integrations</Button>
            </Link>
            <Link href="/dashboard/widgets/create">
              <Button>Create new widget</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Widgets</CardTitle>
              <CardDescription>Total widgets deployed on your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Total conversations this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>Percentage of conversations leading to sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12.3%</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Widgets</CardTitle>
            <CardDescription>Manage your AI chat widgets</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conversations</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {widgets.map((widget) => (
                  <TableRow key={widget.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/widgets/${widget.id}`} className="block">
                        {widget.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      <Link href={`/dashboard/widgets/${widget.id}`} className="block">
                        {widget.description}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/widgets/${widget.id}`} className="block">
                        <Badge variant={getBadgeVariant(widget.status)}>
                          {widget.status}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/widgets/${widget.id}`} className="block">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>{widget.conversations}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Link href={`/dashboard/widgets/${widget.id}`} className="block">
                        {widget.lastUpdated}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {widgets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No widgets found. Create your first widget to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 