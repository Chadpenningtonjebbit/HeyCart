"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function WidgetDetailPage({ params }: { params: { id: string } }) {
  // Mock widget data - in a real app, this would come from an API
  const widget = {
    id: params.id,
    name: "Product Assistant",
    description: "Helps customers find the right products",
    status: "Active",
    createdAt: "2023-08-15",
    lastUpdated: "2024-04-20",
    stats: {
      conversations: 248,
      avgDuration: "2m 35s",
      conversionRate: "15.2%"
    },
    deployment: {
      snippet: `<script src="https://aichatdeployer.com/widgets/${params.id}.js"></script>`,
      domains: ["example.com", "store.example.com"]
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{widget.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{widget.name}</h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Preview</Button>
            <Button variant="outline" size="sm">Duplicate</Button>
            <Link href={`/dashboard/widgets/${params.id}/edit`}>
              <Button size="sm">Edit Widget</Button>
            </Link>
          </div>
        </div>
        
        <p className="text-muted-foreground">{widget.description}</p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Total interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{widget.stats.conversations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Avg. Duration</CardTitle>
              <CardDescription>Time spent in conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{widget.stats.avgDuration}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>Resulting in purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{widget.stats.conversionRate}</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="deployment" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deployment">
            <Card>
              <CardHeader>
                <CardTitle>Installation</CardTitle>
                <CardDescription>
                  Add this widget to your website by including the following code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium leading-none">
                    Embed Code
                  </Label>
                  <div className="relative">
                    <pre className="rounded-md bg-muted p-4 overflow-x-auto text-sm">
                      <code>{widget.deployment.snippet}</code>
                    </pre>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add this script to the &lt;head&gt; section of your website
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium leading-none">
                    Authorized Domains
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {widget.deployment.domains.map((domain, index) => (
                      <div key={index} className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-2">
                        {domain}
                        <button className="text-muted-foreground hover:text-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full">
                      Add Domain
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium leading-none">
                    Quick Deploy
                  </Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      <span className="text-xs">Shopify</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 7v6h-6" />
                        <path d="M3 17 9 11 13 15 21 7" />
                      </svg>
                      <span className="text-xs">WooCommerce</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 11a9 9 0 0 1 9 9" />
                        <path d="M4 4a16 16 0 0 1 16 16" />
                        <circle cx="5" cy="19" r="1" />
                      </svg>
                      <span className="text-xs">WordPress</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col gap-2 h-auto py-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span className="text-xs">Webflow</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  View interactions between your customers and this chat widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Visitor #{Math.floor(Math.random() * 10000)}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                            {' · '}
                            {Math.floor(Math.random() * 10) + 1} messages
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          Math.random() > 0.3 
                            ? "bg-green-100 text-green-700" 
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {Math.random() > 0.3 ? "Conversion" : "No Purchase"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {[
                          "I'm looking for running shoes that would be good for trail running",
                          "Can you help me find a gift for my wife? She likes jewelry",
                          "What's the difference between your premium and standard plans?"
                        ][index]}...
                      </div>
                      <div className="mt-3">
                        <Button variant="link" className="p-0 h-auto text-xs">View conversation</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">View all conversations</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Widget Settings</CardTitle>
                <CardDescription>
                  Configure basic settings for this chat widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none">Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="widget-status" defaultChecked />
                        <Label htmlFor="widget-status">Active</Label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Widget is currently visible to users
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none">Created</h3>
                    <p className="text-sm">{widget.createdAt}</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {widget.lastUpdated}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Danger Zone</h3>
                  <div className="border border-destructive/20 rounded-lg p-4 mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Delete Widget</h4>
                        <p className="text-xs text-muted-foreground">
                          This action cannot be undone. This will permanently delete this widget
                          and remove all associated data.
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 