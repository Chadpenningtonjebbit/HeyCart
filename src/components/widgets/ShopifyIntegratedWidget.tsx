import React, { useState } from 'react';
import { ProductSearch } from '../shopify/ProductSearch';
import { Button } from '@/components/ui/button';
import { Tag, ShoppingBag, Package, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ColorInput } from "@/components/ui/color-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Settings2, MessageSquare, ShoppingCart, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WidgetConfig } from "@/lib/types";
import { useWidgetStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  handle: string;
  url: string;
  formattedDescription?: string;
}

interface ShopifyIntegratedWidgetProps {
  widgetId: string;
  onSendMessage?: (message: string) => void;
}

export function ShopifyIntegratedWidget({ widgetId, onSendMessage }: ShopifyIntegratedWidgetProps) {
  const [isSyncingData, setIsSyncingData] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showOrderLookup, setShowOrderLookup] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync Shopify data
  const handleSyncData = async () => {
    setIsSyncingData(true);
    setError(null);
    
    try {
      const response = await fetch('/api/shopify/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ widgetId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync data');
      }
      
      const data = await response.json();
      if (onSendMessage) {
        onSendMessage(`Successfully synced ${data.productCount} products and ${data.orderCount} orders.`);
      }
    } catch (err) {
      console.error('Error syncing data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsSyncingData(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    if (onSendMessage) {
      if (product.formattedDescription) {
        onSendMessage(`I would like to recommend this product:\n\n${product.formattedDescription}`);
      } else {
        onSendMessage(`I recommend checking out ${product.title} (${product.url})`);
      }
    }
    setShowProductSearch(false);
  };

  // Look up order
  const handleOrderLookup = async () => {
    if (!orderNumber.trim()) return;
    
    setError(null);
    
    try {
      const response = await fetch(`/api/shopify/orders/lookup?widgetId=${widgetId}&orderNumber=${encodeURIComponent(orderNumber)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(`Order #${orderNumber} not found`);
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to look up order');
      }
      
      const data = await response.json();
      setOrderInfo(data.order);
      
      if (onSendMessage) {
        const orderDate = new Date(data.order.createdAt).toLocaleDateString();
        const orderAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: data.order.currency
        }).format(data.order.totalPrice);
        
        const orderStatus = `
Order #${data.order.orderNumber} details:
Date: ${orderDate}
Amount: ${orderAmount}
Payment Status: ${data.order.financialStatus}
Fulfillment Status: ${data.order.fulfillmentStatus}

Is there anything specific about this order you'd like to know?`;
        
        onSendMessage(orderStatus);
      }
    } catch (err) {
      console.error('Error looking up order:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setShowProductSearch(!showProductSearch);
            setShowOrderLookup(false);
          }}
        >
          <Tag className="h-4 w-4 mr-2" />
          {showProductSearch ? 'Hide Products' : 'Find Products'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setShowOrderLookup(!showOrderLookup);
            setShowProductSearch(false);
          }}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {showOrderLookup ? 'Hide Order' : 'Track Order'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleSyncData}
          disabled={isSyncingData}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isSyncingData ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
      
      {showProductSearch && (
        <div className="border rounded-md p-3 bg-background">
          <h3 className="text-sm font-medium mb-2">Find Products</h3>
          <ProductSearch widgetId={widgetId} onProductSelect={handleProductSelect} />
        </div>
      )}
      
      {showOrderLookup && (
        <div className="border rounded-md p-3 bg-background">
          <h3 className="text-sm font-medium mb-2">Track Order</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Order #"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOrderLookup()}
            />
            <Button size="sm" onClick={handleOrderLookup}>
              <Package className="h-4 w-4" />
            </Button>
          </div>
          
          {orderInfo && (
            <div className="mt-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Order Number:</div>
                <div className="font-medium">#{orderInfo.orderNumber}</div>
                
                <div className="text-muted-foreground">Status:</div>
                <div className="font-medium">{orderInfo.fulfillmentStatus}</div>
                
                <div className="text-muted-foreground">Payment:</div>
                <div className="font-medium">{orderInfo.financialStatus}</div>
                
                <div className="text-muted-foreground">Total:</div>
                <div className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: orderInfo.currency
                  }).format(orderInfo.totalPrice)}
                </div>
                
                <div className="text-muted-foreground">Date:</div>
                <div className="font-medium">
                  {new Date(orderInfo.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 