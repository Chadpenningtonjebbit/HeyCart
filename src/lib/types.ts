export interface WidgetConfig {
  id: string;
  type: 'chat' | 'product-recommendation' | 'shopify-integrated';
  name: string;
  description?: string;
  enabled: boolean;
  settings: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
} 