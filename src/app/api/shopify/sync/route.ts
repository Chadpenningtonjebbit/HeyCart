import { NextRequest, NextResponse } from 'next/server';
import { syncShopifyDataForWidget } from '@/lib/shopify/widget-service';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

/**
 * Handles manual syncing of Shopify data
 * POST /api/shopify/sync
 * Body: { widgetId: string }
 */
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated (simplified auth check)
    const cookieStore = cookies();
    const shopifyStoreId = cookieStore.get('shopify_store_id')?.value;
    
    if (!shopifyStoreId) {
      return NextResponse.json(
        { error: 'Not authenticated with a Shopify store' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await req.json();
    const { widgetId } = body;
    
    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID is required' },
        { status: 400 }
      );
    }
    
    // Verify the widget belongs to the authenticated store
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId }
    });
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }
    
    if (widget.shopifyStoreId !== shopifyStoreId) {
      return NextResponse.json(
        { error: 'Widget not connected to this Shopify store' },
        { status: 403 }
      );
    }
    
    // Sync the data
    const result = await syncShopifyDataForWidget(widgetId);
    
    return NextResponse.json({
      success: true,
      productCount: result.productCount,
      orderCount: result.orderCount
    });
  } catch (error) {
    console.error('Error syncing Shopify data:', error);
    
    return NextResponse.json(
      { error: 'Failed to sync Shopify data' },
      { status: 500 }
    );
  }
} 