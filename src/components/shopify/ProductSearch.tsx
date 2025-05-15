import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon, SearchIcon, ShoppingCartIcon } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  handle: string;
  url: string;
}

interface ProductSearchProps {
  widgetId: string;
  onProductSelect?: (product: Product) => void;
}

export function ProductSearch({ widgetId, onProductSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/shopify/products/search?widgetId=${widgetId}&query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      
      if (data.products.length === 0) {
        setError('No products found matching your search');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const handleSelectProduct = (product: Product) => {
    if (onProductSelect) {
      // Create a rich product description for chat
      const formattedPrice = formatPrice(product.price, product.currency);
      const enrichedProduct = {
        ...product,
        formattedDescription: `${product.title} - ${formattedPrice}
${product.description ? product.description.substring(0, 150) + (product.description.length > 150 ? '...' : '') : 'No description available.'}
Available at: ${product.url}`
      };
      
      onProductSelect(enrichedProduct as any);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
        </Button>
      </div>
      
      {error && <p className="text-sm text-destructive">{error}</p>}
      
      <div className="space-y-2">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex gap-3">
                {product.imageUrl && (
                  <div className="flex-shrink-0">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm truncate">{product.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {formatPrice(product.price, product.currency)}
                  </p>
                  <div className="flex mt-1 justify-between items-center">
                    <a 
                      href={product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View details
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 