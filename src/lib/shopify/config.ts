interface ShopifyConfig {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[];
  hostName: string;
  apiVersion: string;
  redirectUri: string;
}

// These values should be stored in environment variables in production
export const shopifyConfig: ShopifyConfig = {
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY || "",
  scopes: [
    "read_products",
    "read_orders",
    "read_customers",
    "write_customers",
    "read_content",
    "read_themes"
  ],
  hostName: process.env.SHOPIFY_HOST_NAME || "localhost:3000",
  apiVersion: "2023-10", // Update with the latest stable version
  redirectUri: process.env.SHOPIFY_REDIRECT_URI || "http://localhost:3000/api/shopify/callback"
};

// Shopify authentication endpoints
export const SHOPIFY_AUTH_ENDPOINTS = {
  authorize: (shop: string) => 
    `https://${shop}/admin/oauth/authorize?client_id=${shopifyConfig.apiKey}&scope=${shopifyConfig.scopes.join(',')}&redirect_uri=${encodeURIComponent(shopifyConfig.redirectUri)}`,
  token: (shop: string) => 
    `https://${shop}/admin/oauth/access_token`
};

// Shopify API endpoints
export const SHOPIFY_API_ENDPOINTS = {
  graphql: (shop: string) => 
    `https://${shop}/admin/api/${shopifyConfig.apiVersion}/graphql.json`,
  webhooks: (shop: string) => 
    `https://${shop}/admin/api/${shopifyConfig.apiVersion}/webhooks.json`
}; 