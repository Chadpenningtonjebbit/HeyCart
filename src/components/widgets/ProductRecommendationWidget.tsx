import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ShoppingBag, Settings2 } from "lucide-react";
import { WidgetConfig } from "@/lib/types";
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  priceMin: number;
  imageUrl?: string;
}

export function ProductRecommendationWidget({ config }: { config: WidgetConfig }) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      title: 'Sample Product 1',
      priceMin: 29.99,
      imageUrl: '/placeholder.png'
    },
    {
      id: '2',
      title: 'Sample Product 2',
      priceMin: 39.99,
      imageUrl: '/placeholder.png'
    }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Recommendations</CardTitle>
        <CardDescription>Show personalized product recommendations to your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={product.imageUrl || '/placeholder.png'}
                  alt={product.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{product.title}</h4>
                <p className="text-sm text-gray-500">${product.priceMin}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 