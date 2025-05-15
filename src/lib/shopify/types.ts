// Basic shop information
export interface ShopifyShop {
  id: string;
  name: string;
  domain: string;
  email: string;
  accessToken: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product information
export interface ShopifyProduct {
  id: string;
  shopId: string;
  title: string;
  handle: string;
  description: string;
  priceMin: number;
  priceMax: number;
  currency: string;
  imageUrl?: string;
  imageAlt?: string;
  variants: ShopifyProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

// Product variant
export interface ShopifyProductVariant {
  id: string;
  productId: string;
  title: string;
  price: number;
  availableForSale: boolean;
}

// Order information
export interface ShopifyOrder {
  id: string;
  shopId: string;
  orderNumber: string;
  customerId?: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: number;
  currency: string;
  createdAt: Date;
}

// Customer information
export interface ShopifyCustomer {
  id: string;
  shopId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: Date;
}

// Shopify webhook event
export interface ShopifyWebhookEvent {
  id: string;
  shopId: string;
  topic: string;
  payload: any;
  processedAt?: Date;
  createdAt: Date;
}

// Topics for Shopify webhooks
export enum ShopifyWebhookTopic {
  PRODUCTS_CREATE = 'products/create',
  PRODUCTS_UPDATE = 'products/update',
  PRODUCTS_DELETE = 'products/delete',
  ORDERS_CREATE = 'orders/create',
  ORDERS_UPDATED = 'orders/updated',
  ORDERS_CANCELLED = 'orders/cancelled',
  CUSTOMERS_CREATE = 'customers/create',
  CUSTOMERS_UPDATE = 'customers/update',
  CUSTOMERS_DELETE = 'customers/delete',
  APP_UNINSTALLED = 'app/uninstalled',
  SHOP_UPDATE = 'shop/update'
}

// Response from Shopify GraphQL API for shop information
export interface ShopifyShopInfoResponse {
  shop: {
    id: string;
    name: string;
    email: string;
    primaryDomain: {
      url: string;
      host: string;
    };
    plan: {
      displayName: string;
      partnerDevelopment: boolean;
      shopifyPlus: boolean;
    };
  };
} 