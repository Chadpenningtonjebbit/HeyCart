import { prisma } from '../db';
import { syncProducts, syncOrders } from './store-service';
import { setupShopifyWebhooks } from './webhook-setup';

/**
 * Connects a widget to a Shopify store
 */
export async function connectWidgetToShopify(widgetId: string, shopifyStoreId: string): Promise<boolean> {
  try {
    // Update the widget with the Shopify store ID
    await prisma.widget.update({
      where: { id: widgetId },
      data: { shopifyStoreId }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to connect widget to Shopify store:', error);
    return false;
  }
}

/**
 * Disconnects a widget from a Shopify store
 */
export async function disconnectWidgetFromShopify(widgetId: string): Promise<boolean> {
  try {
    // Remove the Shopify store connection from the widget
    await prisma.widget.update({
      where: { id: widgetId },
      data: { shopifyStoreId: null }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to disconnect widget from Shopify store:', error);
    return false;
  }
}

/**
 * Syncs Shopify data for a specific widget
 */
export async function syncShopifyDataForWidget(widgetId: string): Promise<{
  productCount: number;
  orderCount: number;
}> {
  try {
    // Get the widget with its Shopify store connection
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId },
      include: { shopifyStore: true }
    });
    
    if (!widget || !widget.shopifyStore) {
      throw new Error('Widget not connected to a Shopify store');
    }
    
    // Sync products
    const productCount = await syncProducts(
      widget.shopifyStore.id,
      widget.shopifyStore.domain,
      widget.shopifyStore.accessToken
    );
    
    // Sync orders
    const orderCount = await syncOrders(
      widget.shopifyStore.id,
      widget.shopifyStore.domain,
      widget.shopifyStore.accessToken
    );
    
    return { productCount, orderCount };
  } catch (error) {
    console.error('Failed to sync Shopify data for widget:', error);
    return { productCount: 0, orderCount: 0 };
  }
}

/**
 * Sets up the integration for a newly connected Shopify store
 */
export async function setupShopifyIntegration(shopId: string, userId: string, baseUrl: string): Promise<boolean> {
  try {
    // Get the Shopify store
    const shopifyStore = await prisma.shopifyStore.findUnique({
      where: { id: shopId }
    });
    
    if (!shopifyStore) {
      throw new Error('Shopify store not found');
    }
    
    // Setup webhooks
    await setupShopifyWebhooks({
      shop: shopifyStore.domain,
      accessToken: shopifyStore.accessToken,
      baseUrl
    });
    
    // Initial sync of products and orders
    await syncProducts(
      shopifyStore.id,
      shopifyStore.domain,
      shopifyStore.accessToken
    );
    
    await syncOrders(
      shopifyStore.id,
      shopifyStore.domain,
      shopifyStore.accessToken
    );
    
    // Get user's widgets
    const widgets = await prisma.widget.findMany({
      where: { userId }
    });
    
    // If user has widgets, connect the first one to the store
    if (widgets.length > 0) {
      await connectWidgetToShopify(widgets[0].id, shopifyStore.id);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to setup Shopify integration:', error);
    return false;
  }
}

/**
 * Get product recommendations for a widget
 */
export async function getProductRecommendations(widgetId: string, query: string, limit: number = 5): Promise<any[]> {
  try {
    // Get the widget with its Shopify store connection
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId },
      include: { shopifyStore: true }
    });
    
    if (!widget || !widget.shopifyStore) {
      return [];
    }
    
    // Simple search for products based on the query
    // In a real implementation, you would use more sophisticated search
    const products = await prisma.shopifyProduct.findMany({
      where: {
        shopId: widget.shopifyStore.id,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        variants: {
          take: 1, // Just get the first variant for price info
        }
      },
      take: limit
    });
    
    return products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.variants[0]?.price || product.priceMin,
      currency: product.currency,
      imageUrl: product.imageUrl,
      handle: product.handle,
      url: `https://${widget.shopifyStore!.domain}/products/${product.handle}`
    }));
  } catch (error) {
    console.error('Failed to get product recommendations:', error);
    return [];
  }
}

/**
 * Get order information
 */
export async function getOrderInfo(widgetId: string, orderNumber: string): Promise<any | null> {
  try {
    // Get the widget with its Shopify store connection
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId },
      include: { shopifyStore: true }
    });
    
    if (!widget || !widget.shopifyStore) {
      return null;
    }
    
    // Find the order
    const order = await prisma.shopifyOrder.findFirst({
      where: {
        shopId: widget.shopifyStore.id,
        orderNumber: orderNumber
      }
    });
    
    if (!order) {
      return null;
    }
    
    return {
      orderNumber: order.orderNumber,
      financialStatus: order.financialStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalPrice: order.totalPrice,
      currency: order.currency,
      createdAt: order.createdAt
    };
  } catch (error) {
    console.error('Failed to get order info:', error);
    return null;
  }
} 