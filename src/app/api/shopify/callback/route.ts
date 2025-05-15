import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateHmac, exchangeCodeForToken } from '@/lib/shopify/auth';
import { syncShopInfo } from '@/lib/shopify/store-service';
import { setupShopifyIntegration } from '@/lib/shopify/widget-service';

/**
 * Handles the Shopify OAuth callback
 * GET /api/shopify/callback?code=...&hmac=...&shop=...&state=...
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams: Record<string, string> = {};
    
    // Convert URL search params to a plain object
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    const { code, shop, state } = queryParams;
    
    // Verify required parameters
    if (!code || !shop || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get stored state and shop from cookies
    const cookieStore = cookies();
    const storedState = cookieStore.get('shopify_auth_state')?.value;
    const storedShop = cookieStore.get('shopify_auth_shop')?.value;
    
    // Verify state to prevent CSRF attacks
    if (!storedState || state !== storedState) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 403 }
      );
    }
    
    // Verify shop matches the one we started with
    if (!storedShop || shop !== storedShop) {
      return NextResponse.json(
        { error: 'Shop mismatch' },
        { status: 403 }
      );
    }
    
    // Validate the HMAC signature from Shopify
    if (!validateHmac(queryParams)) {
      return NextResponse.json(
        { error: 'Invalid HMAC signature' },
        { status: 403 }
      );
    }
    
    // Exchange authorization code for access token
    const { access_token } = await exchangeCodeForToken(shop, code);
    
    if (!access_token) {
      return NextResponse.json(
        { error: 'Failed to obtain access token' },
        { status: 500 }
      );
    }
    
    // Fetch and store the shop information
    const shopInfo = await syncShopInfo(shop, access_token);
    
    // Setup the integration (webhooks, initial data sync)
    // In a real app, this should be done in a background job
    // because it can take some time
    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.get('host')}`;
    await setupShopifyIntegration(shopInfo.id, shopInfo.userId, baseUrl);
    
    // Clear the auth cookies
    cookieStore.delete('shopify_auth_state');
    cookieStore.delete('shopify_auth_shop');
    
    // Create a session or JWT for the authenticated shop
    // This depends on your auth strategy - here we'll use a simple cookie
    cookieStore.set('shopify_store_id', shopInfo.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    
    // Redirect to the dashboard or store connection success page
    return NextResponse.redirect(new URL('/dashboard/integration/shopify/success', req.url));
  } catch (error) {
    console.error('Error handling Shopify callback:', error);
    
    return NextResponse.json(
      { error: 'Failed to complete authorization' },
      { status: 500 }
    );
  }
} 