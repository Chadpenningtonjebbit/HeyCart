import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface StoreConnectProps {
  onConnect?: (shop: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function StoreConnect({ onConnect, isLoading = false, error }: StoreConnectProps) {
  const [shopDomain, setShopDomain] = useState('');
  const [shopDomainError, setShopDomainError] = useState('');
  
  const handleConnectClick = () => {
    // Validate shop domain format
    if (!shopDomain) {
      setShopDomainError('Shop domain is required');
      return;
    }
    
    // Simple validation to ensure it's a Shopify domain
    if (!shopDomain.includes('.myshopify.com')) {
      // Add .myshopify.com if it's not included
      if (!shopDomain.includes('.')) {
        const fullDomain = `${shopDomain}.myshopify.com`;
        setShopDomain(fullDomain);
        if (onConnect) onConnect(fullDomain);
        return;
      }
      
      setShopDomainError('Please enter a valid Shopify domain (e.g. your-store.myshopify.com)');
      return;
    }
    
    // Clear any previous errors
    setShopDomainError('');
    
    // Call the onConnect callback with the shop domain
    if (onConnect) onConnect(shopDomain);
  };
  
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopDomain(e.target.value);
    if (shopDomainError) setShopDomainError('');
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect Your Shopify Store</CardTitle>
        <CardDescription>
          Connect your store to enable product suggestions, order tracking, and more.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="shop-domain">Shop Domain</Label>
          <Input
            id="shop-domain"
            placeholder="your-store.myshopify.com"
            value={shopDomain}
            onChange={handleDomainChange}
            error={!!shopDomainError}
          />
          {shopDomainError && (
            <p className="text-sm text-destructive">{shopDomainError}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Enter your Shopify store domain without https:// (e.g. your-store.myshopify.com)
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleConnectClick} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Connecting...' : 'Connect Store'}
        </Button>
      </CardFooter>
    </Card>
  );
} 