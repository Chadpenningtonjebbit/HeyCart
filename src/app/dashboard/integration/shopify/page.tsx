"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreConnect } from '@/components/shopify/StoreConnect';

export default function ShopifyIntegrationPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleConnectStore = async (shopDomain: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Redirect to the Shopify auth endpoint to start the OAuth flow
      router.push(`/api/shopify/auth?shop=${encodeURIComponent(shopDomain)}`);
    } catch (err) {
      console.error('Failed to connect to Shopify store:', err);
      setError('Failed to connect to Shopify store. Please try again.');
      setIsConnecting(false);
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
              <BreadcrumbLink asChild>
                <Link href="/dashboard/integration">Integration</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shopify</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Shopify Integration</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/integration">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Connect to Shopify</CardTitle>
                <CardDescription>
                  Integrate your chat widget with Shopify to provide real-time product information and order status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Benefits</h3>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    <li>Access product catalog for accurate product recommendations</li>
                    <li>Retrieve order status information for customer inquiries</li>
                    <li>Get customer purchase history for personalized support</li>
                    <li>Allow your chat AI to add products to customer carts</li>
                    <li>Sync product details automatically when they change</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Permissions Required</h3>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    <li>Read products (to access your product catalog)</li>
                    <li>Read orders (to check order status)</li>
                    <li>Read customers (to personalize recommendations)</li>
                    <li>Write customers (to update customer information)</li>
                    <li>Read content (to access store information)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center justify-center">
            <StoreConnect 
              onConnect={handleConnectStore} 
              isLoading={isConnecting}
              error={error || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 