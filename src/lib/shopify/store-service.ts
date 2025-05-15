import { ShopifyShop, ShopifyProduct, ShopifyOrder, ShopifyCustomer } from './types';
import { shopifyGraphQL, GET_SHOP_INFO, GET_PRODUCTS, GET_ORDERS } from './api';
import { prisma } from '../db'; // Assuming you have Prisma set up

/**
 * Creates or updates a Shopify store in the database
 */
export async function saveShopifyStore(shopData: Omit<ShopifyShop, 'createdAt' | 'updatedAt'>): Promise<ShopifyShop> {
  const { id, name, domain, email, accessToken, scope } = shopData;
  
  // Check if store already exists
  const existingStore = await prisma.shopifyStore.findUnique({
    where: { id }
  });
  
  if (existingStore) {
    // Update existing store
    return prisma.shopifyStore.update({
      where: { id },
      data: {
        name,
        domain,
        email,
        accessToken,
        scope,
      }
    });
  } else {
    // Create new store
    return prisma.shopifyStore.create({
      data: {
        id,
        name,
        domain,
        email,
        accessToken,
        scope,
      }
    });
  }
}

/**
 * Fetches and syncs store information from Shopify
 */
export async function syncShopInfo(shop: string, accessToken: string): Promise<ShopifyShop> {
  // Fetch shop info from Shopify API
  const response = await shopifyGraphQL({
    shop,
    accessToken,
    query: GET_SHOP_INFO
  });
  
  const shopInfo = response.shop;
  
  // Save shop data to database
  return saveShopifyStore({
    id: shopInfo.id,
    name: shopInfo.name,
    domain: shopInfo.primaryDomain.host,
    email: shopInfo.email,
    accessToken,
    scope: '' // Scope is typically stored during OAuth flow
  });
}

/**
 * Syncs products from Shopify to local database
 */
export async function syncProducts(shopId: string, shop: string, accessToken: string): Promise<number> {
  let hasNextPage = true;
  let cursor: string | null = null;
  let totalSynced = 0;
  
  while (hasNextPage) {
    // Fetch products from Shopify API
    const response = await shopifyGraphQL({
      shop,
      accessToken,
      query: GET_PRODUCTS,
      variables: {
        first: 50,
        cursor
      }
    });
    
    const { edges, pageInfo } = response.products;
    
    // Process products
    const products = edges.map(edge => {
      const product = edge.node;
      const variants = product.variants.edges.map(variantEdge => ({
        id: variantEdge.node.id,
        productId: product.id,
        title: variantEdge.node.title,
        price: parseFloat(variantEdge.node.price),
        availableForSale: variantEdge.node.availableForSale
      }));
      
      return {
        id: product.id,
        shopId,
        title: product.title,
        handle: product.handle,
        description: product.description,
        priceMin: parseFloat(product.priceRangeV2.minVariantPrice.amount),
        priceMax: parseFloat(product.priceRangeV2.maxVariantPrice.amount),
        currency: product.priceRangeV2.minVariantPrice.currencyCode,
        imageUrl: product.featuredImage?.url,
        imageAlt: product.featuredImage?.altText,
        variants
      };
    });
    
    // Save products to database (using a transaction for atomicity)
    await prisma.$transaction(async (tx) => {
      for (const product of products) {
        const { variants, ...productData } = product;
        
        // Upsert product
        await tx.shopifyProduct.upsert({
          where: { id: product.id },
          update: productData,
          create: productData
        });
        
        // Delete existing variants and create new ones
        await tx.shopifyProductVariant.deleteMany({
          where: { productId: product.id }
        });
        
        if (variants.length > 0) {
          await tx.shopifyProductVariant.createMany({
            data: variants
          });
        }
      }
    });
    
    totalSynced += products.length;
    
    // Update cursor and check if there are more pages
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }
  
  return totalSynced;
}

/**
 * Syncs orders from Shopify to local database
 */
export async function syncOrders(shopId: string, shop: string, accessToken: string): Promise<number> {
  let hasNextPage = true;
  let cursor: string | null = null;
  let totalSynced = 0;
  
  while (hasNextPage) {
    // Fetch orders from Shopify API
    const response = await shopifyGraphQL({
      shop,
      accessToken,
      query: GET_ORDERS,
      variables: {
        first: 50,
        cursor
      }
    });
    
    const { edges, pageInfo } = response.orders;
    
    // Process orders
    const orders = edges.map(edge => {
      const order = edge.node;
      
      return {
        id: order.id,
        shopId,
        orderNumber: order.name,
        customerId: order.customer?.id,
        financialStatus: order.displayFinancialStatus,
        fulfillmentStatus: order.displayFulfillmentStatus,
        totalPrice: parseFloat(order.totalPriceSet.shopMoney.amount),
        currency: order.totalPriceSet.shopMoney.currencyCode,
        createdAt: new Date(order.createdAt)
      };
    });
    
    // Save orders to database
    await prisma.shopifyOrder.createMany({
      data: orders,
      skipDuplicates: true
    });
    
    totalSynced += orders.length;
    
    // Update cursor and check if there are more pages
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }
  
  return totalSynced;
} 