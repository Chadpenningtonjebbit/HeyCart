"use client";

import { useEffect, useState } from 'react';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircledIcon } from '@radix-ui/react-icons';

export default function ShopifySuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState<{ name: string; domain: string } | null>(null);
  
  useEffect(() => {
    // In a real app, we'd fetch the shop info from the backend
    // For now, we'll simulate it with a timeout
    const timer = setTimeout(() => {
      setShopInfo({
        name: 'Your Shopify Store',
        domain: 'example.myshopify.com'
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
              <BreadcrumbLink asChild>
                <Link href="/dashboard/integration/shopify">Shopify</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Success</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center justify-center my-10">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircledIcon className="h-10 w-10 text-green-500" />
              </div>
              <CardTitle>Shopify Integration Successful!</CardTitle>
              <CardDescription>
                Your Shopify store has been successfully connected to your chat widget.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm text-muted-foreground">Store Name:</span>
                    <span className="font-medium">{shopInfo?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm text-muted-foreground">Domain:</span>
                    <span className="font-medium">{shopInfo?.domain}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-green-500 font-medium">Connected</span>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Next Steps:</h3>
                <ul className="space-y-2">
                  <li className="text-sm">
                    1. Sync your product catalog
                  </li>
                  <li className="text-sm">
                    2. Configure your widget to use Shopify data
                  </li>
                  <li className="text-sm">
                    3. Test your widget with product inquiries
                  </li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-2">
              <Button 
                onClick={() => router.push('/dashboard/widgets')}
                className="w-full"
              >
                Configure Widgets
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/integration')}
                className="w-full"
              >
                Return to Integrations
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 