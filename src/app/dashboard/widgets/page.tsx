"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WidgetsPage() {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chat Widgets</h1>
        <Link href="/dashboard/widgets/create">
          <Button>Create new widget</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <Link 
            key={widget.id} 
            href={`/dashboard/widgets/${widget.id}`}
            className="block"
          >
            <Card className="h-full cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col gap-2 h-full">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{widget.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      widget.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : widget.status === "Inactive" 
                          ? "bg-gray-100 text-gray-700" 
                          : "bg-amber-100 text-amber-700"
                    }`}>
                      {widget.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow">{widget.description}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{widget.conversations} conversations</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated {widget.lastUpdated}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        <Link href="/dashboard/widgets/create">
          <Card className="h-full border-dashed cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <h3 className="font-medium">Create Widget</h3>
              <p className="text-sm text-muted-foreground">Add a new AI chat widget to your site</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 