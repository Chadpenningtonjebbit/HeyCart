import { NextRequest, NextResponse } from 'next/server';
import { getProductRecommendations } from '@/lib/shopify/widget-service';

/**
 * Searches for products in a connected Shopify store
 * GET /api/shopify/products/search?widgetId=xxx&query=yyy
 */
export async function GET(req: NextRequest) {
  try {
    // Get search parameters
    const { searchParams } = new URL(req.url);
    const widgetId = searchParams.get('widgetId');
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 5;
    
    // Validate required parameters
    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID is required' },
        { status: 400 }
      );
    }
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    // Get product recommendations
    const products = await getProductRecommendations(widgetId, query, limit);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error searching products:', error);
    
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
} 