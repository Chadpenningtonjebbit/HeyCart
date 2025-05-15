import { prisma } from '../db';
import { syncProducts, syncOrders } from './store-service';

/**
 * Scheduled function that syncs data for all active Shopify stores
 * This should be called by a cron job or similar scheduler
 */
export async function syncAllShopifyStores(): Promise<{
  storesProcessed: number;
  totalProducts: number;
  totalOrders: number;
  errors: string[];
}> {
  const results = {
    storesProcessed: 0,
    totalProducts: 0,
    totalOrders: 0,
    errors: [] as string[]
  };
  
  try {
    // Get all active Shopify stores
    const stores = await prisma.shopifyStore.findMany({
      where: { isActive: true }
    });
    
    results.storesProcessed = stores.length;
    
    // Process each store
    for (const store of stores) {
      try {
        console.log(`Syncing data for store: ${store.name} (${store.domain})`);
        
        // Sync products
        const productCount = await syncProducts(
          store.id,
          store.domain,
          store.accessToken
        );
        
        results.totalProducts += productCount;
        
        // Sync orders
        const orderCount = await syncOrders(
          store.id,
          store.domain,
          store.accessToken
        );
        
        results.totalOrders += orderCount;
        
        console.log(`Completed sync for ${store.name}: ${productCount} products, ${orderCount} orders`);
      } catch (error) {
        const errorMessage = `Error syncing store ${store.name}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMessage);
        results.errors.push(errorMessage);
      }
    }
    
    return results;
  } catch (error) {
    const errorMessage = `Failed to sync Shopify stores: ${error instanceof Error ? error.message : String(error)}`;
    console.error(errorMessage);
    results.errors.push(errorMessage);
    return results;
  }
}

/**
 * Creates a log entry for a sync operation
 */
export async function logSyncOperation(results: {
  storesProcessed: number;
  totalProducts: number;
  totalOrders: number;
  errors: string[];
}): Promise<void> {
  try {
    await prisma.syncLog.create({
      data: {
        type: 'SHOPIFY',
        storesProcessed: results.storesProcessed,
        itemsProcessed: results.totalProducts + results.totalOrders,
        success: results.errors.length === 0,
        errors: results.errors.join('\n'),
        completedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Failed to log sync operation:', error);
  }
}

/**
 * Main function to run a complete sync operation and log results
 * This is the function that should be called by a scheduler
 */
export async function runScheduledSync(): Promise<void> {
  console.log('Starting scheduled Shopify data sync...');
  const startTime = Date.now();
  
  try {
    const results = await syncAllShopifyStores();
    await logSyncOperation(results);
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`Completed Shopify sync in ${duration.toFixed(2)}s. Processed ${results.storesProcessed} stores, ${results.totalProducts} products, ${results.totalOrders} orders.`);
    
    if (results.errors.length > 0) {
      console.error(`There were ${results.errors.length} errors during sync.`);
    }
  } catch (error) {
    console.error('Fatal error during scheduled sync:', error);
  }
} 