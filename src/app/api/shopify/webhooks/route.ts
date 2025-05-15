import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';
import { ShopifyProduct, ShopifyOrder, ShopifyShop } from '@/lib/shopify/types';

/**
 * Handles incoming webhooks from Shopify
 * POST /api/shopify/webhooks
 */
export async function POST(req: NextRequest) {
  try {
    // Verify the webhook is from Shopify
    const shopifyHmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    
    if (!shopifyHmac || !topic || !shopDomain) {
      console.error('Missing required headers');
      return new Response('Unauthorized', { status: 401 });
    }
    
    // Get the raw body
    const rawBody = await req.text();
    
    // Verify HMAC signature
    const isValid = verifyWebhookHmac(shopifyHmac, rawBody);
    
    if (!isValid) {
      console.error('Invalid HMAC signature');
      return new Response('Unauthorized', { status: 401 });
    }
    
    // Parse the payload
    const payload = JSON.parse(rawBody);
    
    // Find the store
    const store = await prisma.shopifyStore.findFirst({
      where: { domain: shopDomain }
    });
    
    if (!store) {
      console.error(`Store not found: ${shopDomain}`);
      return new Response('Store not found', { status: 404 });
    }
    
    // Log the webhook event
    await prisma.shopifyWebhookEvent.create({
      data: {
        id: req.headers.get('x-shopify-webhook-id') || crypto.randomUUID(),
        shopId: store.id,
        topic,
        payload,
        processedAt: new Date()
      }
    });
    
    // Process the webhook based on the topic
    await processWebhook(topic, payload, store.id);
    
    // Return a 200 response to acknowledge receipt
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Still return 200 to acknowledge receipt
    // This prevents Shopify from retrying failed webhooks
    return new Response('Error processing webhook', { status: 200 });
  }
}

/**
 * Verifies the HMAC signature from Shopify
 */
function verifyWebhookHmac(hmac: string, body: string): boolean {
  if (!process.env.SHOPIFY_API_SECRET) {
    console.error('SHOPIFY_API_SECRET is not set');
    return false;
  }
  
  const hash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmac)
  );
}

/**
 * Process the webhook based on the topic
 */
async function processWebhook(topic: string, payload: unknown, shopId: string): Promise<void> {
  switch (topic) {
    case 'products/create':
    case 'products/update':
      if (typeof payload === 'object' && payload !== null) {
        await handleProductUpdate(payload as ShopifyProduct, shopId);
      }
      break;
    case 'products/delete':
      if (typeof payload === 'object' && payload !== null && 'id' in payload) {
        await handleProductDelete(payload.id as string, shopId);
      }
      break;
    case 'orders/create':
    case 'orders/updated':
      if (typeof payload === 'object' && payload !== null) {
        await handleOrderUpdate(payload as ShopifyOrder, shopId);
      }
      break;
    case 'orders/cancelled':
      if (typeof payload === 'object' && payload !== null) {
        await handleOrderCancelled(payload as ShopifyOrder, shopId);
      }
      break;
    case 'app/uninstalled':
      await handleAppUninstalled(shopId);
      break;
    case 'shop/update':
      if (typeof payload === 'object' && payload !== null) {
        await handleShopUpdate(payload as ShopifyShop, shopId);
      }
      break;
    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }
}

/**
 * Handle product create/update webhooks
 */
async function handleProductUpdate(product: ShopifyProduct, shopId: string): Promise<void> {
  try {
    // Extract the relevant product data
    const productData = {
      id: product.id,
      shopId,
      title: product.title,
      handle: product.handle,
      description: product.description || '',
      priceMin: getMinPrice(product),
      priceMax: getMaxPrice(product),
      currency: product.currency || 'USD',
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt
    };
    
    // Upsert the product
    await prisma.shopifyProduct.upsert({
      where: { id: product.id },
      update: productData,
      create: productData
    });
    
    // Handle variants
    if (product.variants && product.variants.length > 0) {
      // Delete existing variants
      await prisma.shopifyProductVariant.deleteMany({
        where: { productId: product.id }
      });
      
      // Create new variants
      const variants = product.variants.map((variant: any) => ({
        id: variant.id,
        productId: product.id,
        title: variant.title,
        price: parseFloat(variant.price),
        availableForSale: variant.available
      }));
      
      await prisma.shopifyProductVariant.createMany({
        data: variants
      });
    }
    
    console.log(`Updated product: ${product.title} (${product.id})`);
  } catch (error) {
    console.error('Error handling product update:', error);
  }
}

/**
 * Handle product delete webhooks
 */
async function handleProductDelete(productId: string, shopId: string): Promise<void> {
  try {
    // Delete the product
    await prisma.shopifyProduct.delete({
      where: { id: productId }
    });
    
    console.log(`Deleted product: ${productId}`);
  } catch (error) {
    console.error('Error handling product delete:', error);
  }
}

/**
 * Handle order create/update webhooks
 */
async function handleOrderUpdate(order: ShopifyOrder, shopId: string): Promise<void> {
  try {
    // Extract the relevant order data
    const orderData = {
      id: order.id,
      shopId,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      financialStatus: order.financialStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalPrice: order.totalPrice,
      currency: order.currency,
      createdAt: order.createdAt
    };
    
    // Upsert the order
    await prisma.shopifyOrder.upsert({
      where: { id: order.id },
      update: orderData,
      create: orderData
    });
    
    console.log(`Updated order: ${order.orderNumber} (${order.id})`);
  } catch (error) {
    console.error('Error handling order update:', error);
  }
}

/**
 * Handle order cancelled webhooks
 */
async function handleOrderCancelled(order: ShopifyOrder, shopId: string): Promise<void> {
  try {
    // Update the order status
    await prisma.shopifyOrder.update({
      where: { id: order.id },
      data: {
        financialStatus: 'canceled',
        fulfillmentStatus: 'cancelled'
      }
    });
    
    console.log(`Cancelled order: ${order.orderNumber} (${order.id})`);
  } catch (error) {
    console.error('Error handling order cancellation:', error);
  }
}

/**
 * Handle app uninstalled webhooks
 */
async function handleAppUninstalled(shopId: string): Promise<void> {
  try {
    // Mark the store as inactive
    await prisma.shopifyStore.update({
      where: { id: shopId },
      data: { isActive: false }
    });
    
    // Disconnect all widgets from this store
    await prisma.widget.updateMany({
      where: { shopifyStoreId: shopId },
      data: { shopifyStoreId: null }
    });
    
    console.log(`App uninstalled for store: ${shopId}`);
  } catch (error) {
    console.error('Error handling app uninstalled:', error);
  }
}

/**
 * Handle shop update webhooks
 */
async function handleShopUpdate(shop: ShopifyShop, shopId: string): Promise<void> {
  try {
    // Update the store information
    await prisma.shopifyStore.update({
      where: { id: shopId },
      data: {
        name: shop.name,
        email: shop.email,
        domain: shop.domain
      }
    });
    
    console.log(`Updated shop: ${shop.name} (${shopId})`);
  } catch (error) {
    console.error('Error handling shop update:', error);
  }
}

/**
 * Helper to get minimum price from product variants
 */
function getMinPrice(product: ShopifyProduct): number {
  if (!product.variants || product.variants.length === 0) {
    return 0;
  }
  
  const prices = product.variants
    .map((variant: any) => parseFloat(variant.price))
    .filter((price: number) => !isNaN(price));
  
  return prices.length > 0 ? Math.min(...prices) : 0;
}

/**
 * Helper to get maximum price from product variants
 */
function getMaxPrice(product: ShopifyProduct): number {
  if (!product.variants || product.variants.length === 0) {
    return 0;
  }
  
  const prices = product.variants
    .map((variant: any) => parseFloat(variant.price))
    .filter((price: number) => !isNaN(price));
  
  return prices.length > 0 ? Math.max(...prices) : 0;
} 