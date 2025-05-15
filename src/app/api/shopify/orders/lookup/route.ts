import { NextRequest, NextResponse } from 'next/server';
import { getOrderInfo } from '@/lib/shopify/widget-service';

/**
 * Looks up order information from a connected Shopify store
 * GET /api/shopify/orders/lookup?widgetId=xxx&orderNumber=yyy
 */
export async function GET(req: NextRequest) {
  try {
    // Get search parameters
    const { searchParams } = new URL(req.url);
    const widgetId = searchParams.get('widgetId');
    const orderNumber = searchParams.get('orderNumber');
    
    // Validate required parameters
    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID is required' },
        { status: 400 }
      );
    }
    
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }
    
    // Get order information
    const order = await getOrderInfo(widgetId, orderNumber);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error looking up order:', error);
    
    return NextResponse.json(
      { error: 'Failed to look up order' },
      { status: 500 }
    );
  }
} 