import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthorizationUrl, generateNonce, isValidShopDomain } from '@/lib/shopify/auth';

/**
 * Initiates the Shopify OAuth flow
 * GET /api/shopify/auth?shop=mystore.myshopify.com
 */
export async function GET(req: NextRequest) {
  try {
    // Get the shop parameter from the URL
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get('shop');
    
    // Shop is required
    if (!shop) {
      return NextResponse.json(
        { error: 'Missing shop parameter' },
        { status: 400 }
      );
    }
    
    // Validate shop domain format
    if (!isValidShopDomain(shop)) {
      return NextResponse.json(
        { error: 'Invalid shop domain format' },
        { status: 400 }
      );
    }
    
    // Generate state for CSRF protection
    const state = generateNonce();
    
    // Store the state and shop in cookies for verification later
    const cookieStore = cookies();
    
    cookieStore.set('shopify_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10 // 10 minutes
    });
    
    cookieStore.set('shopify_auth_shop', shop, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10 // 10 minutes
    });
    
    // Generate authorization URL
    const authUrl = getAuthorizationUrl(shop, state);
    
    // Redirect to Shopify authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Shopify OAuth:', error);
    
    return NextResponse.json(
      { error: 'Failed to initiate authorization' },
      { status: 500 }
    );
  }
} 