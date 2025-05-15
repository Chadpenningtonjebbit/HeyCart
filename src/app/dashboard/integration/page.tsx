"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function IntegrationsPage() {
  // List of available integrations
  const integrations = [
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store to recommend products and check order status in chat.",
      icon: (
        <svg viewBox="0 0 109 124" className="h-10 w-10 text-[#95BF47]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M94.6 23.9c-.1-.7-.7-1.1-1.2-1.1s-9.7-.7-9.7-.7-6.4-6.4-7.1-7.1c-.7-.7-2.1-.5-2.6-.3-.1 0-1.6.5-4.2 1.3C67.8 12.2 63.5 9 57.5 9c-.3 0-.6 0-.9.1C55 7.2 53 6 50.5 6c-9.2 0-13.8 11.5-15.3 17.4-3.6 1.1-6.2 1.9-6.6 2-2 .6-2.1 2.1-2.1 2.2 0 .1-1.3 9.8-2.8 21.4-2.8 21.3-7 51.1-7 51.1l54.1 9.8 29.1-7.3c-.1-.2-5.1-35-5.3-36.6v-.1c.5-3.5 1-7.8 1.3-10.9.8-7 1.5-12.6 1.5-12.6l-.1-19zm-24.2-7.7c-2 .6-4.3 1.3-6.7 2.1.1-3.1.5-7.5 2.2-11.2 2.1 1.4 3.9 3.5 4.5 9.1zm-10.7 3.4c-4.5 1.4-9.4 2.9-14.4 4.4 1.4-5.3 4.1-10.6 9.2-10.6 2 0 3.5 1.4 5.2 6.2zm-7.9-10.6c1.3 0 2.5.4 3.5 1.2-4.4 2.1-7.2 7.3-8.6 12.7-3.7 1.1-7.2 2.2-10.5 3.2C38.4 16.7 42.3 9 51.8 9z" />
          <path d="M93.4 22.8c-.5-.1-9.7-.7-9.7-.7s-6.4-6.4-7.1-7.1c-.3-.3-.6-.4-.9-.4l-5 78.2 29.1-7.3s-5.3-35.9-5.4-37.6c-.1-1.8 0-24 0-24 0-.3-.4-.9-1-1.1z" fill="#5E8E3E" />
          <path d="M57.5 39.6l-4.2 12.3s-3.7-2-8.2-2c-6.6 0-6.9 4.2-6.9 5.2 0 5.7 14.8 7.9 14.8 21.3 0 10.5-6.7 17.3-15.7 17.3-10.8 0-16.3-6.7-16.3-6.7l2.9-9.5s5.7 4.9 10.5 4.9c3.1 0 4.4-2.5 4.4-4.3 0-7.5-12.2-7.8-12.2-20.1 0-10.3 7.4-20.3 22.5-20.3 5.8.1 8.4 1.9 8.4 1.9z" fill="white" />
        </svg>
      ),
      status: "Ready to Connect",
      url: "/dashboard/integration/shopify"
    },
    // Add other integrations here
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments directly through your chat widget with Stripe integration.",
      icon: (
        <svg className="h-10 w-10 text-[#6772E5]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
        </svg>
      ),
      status: "Coming Soon",
      url: "#",
      disabled: true
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "Connect to HubSpot CRM to track customer conversations and manage leads.",
      icon: (
        <svg className="h-10 w-10 text-[#FF7A59]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.88 14.49c-.83 0-1.5-.67-1.5-1.5V7.49H4.88c-.83 0-1.5.67-1.5 1.5v5.5c0 .83.67 1.5 1.5 1.5h3v-1.5z" />
          <path d="M11.55 16.89c-.83 0-1.5-.67-1.5-1.5V3.89h-1.5c-.83 0-1.5.67-1.5 1.5v11.5c0 .83.67 1.5 1.5 1.5h3v-1.5z" />
          <path d="M20.39 16.89c.83 0 1.5-.67 1.5-1.5V3.89c0-.83-.67-1.5-1.5-1.5h-3v1.5c.83 0 1.5.67 1.5 1.5v11.5h1.5z" />
          <path d="M16.72 14.49c.83 0 1.5-.67 1.5-1.5V7.49h-1.5c-.83 0-1.5.67-1.5 1.5v5.5c0 .83.67 1.5 1.5 1.5h1.5v-1.5h-1.5z" />
          <path d="M13.05 4.89v9.6c0 .83.67 1.5 1.5 1.5h3v3.6c0 .83-.67 1.5-1.5 1.5H4.88c-.83 0-1.5-.67-1.5-1.5v-3.6h3c.83 0 1.5-.67 1.5-1.5v-9.6c0-.83.67-1.5 1.5-1.5h3.17c.83 0 1.5.67 1.5 1.5z" />
        </svg>
      ),
      status: "Coming Soon",
      url: "#",
      disabled: true
    }
  ];

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
              <BreadcrumbPage>Integrations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {integration.icon}
                  <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {integration.status}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={integration.url} className="w-full">
                  <Button 
                    className="w-full" 
                    variant={integration.disabled ? "outline" : "default"}
                    disabled={integration.disabled}
                  >
                    {integration.disabled ? "Coming Soon" : "Connect"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 