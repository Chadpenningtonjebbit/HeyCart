import crypto from 'crypto';
import { shopifyConfig, SHOPIFY_AUTH_ENDPOINTS } from './config';

/**
 * Validates the HMAC signature from Shopify's OAuth redirect
 */
export function validateHmac(queryParams: Record<string, string>): boolean {
  // Extract the hmac parameter
  const hmac = queryParams.hmac;
  
  if (!hmac) {
    return false;
  }
  
  // Create a copy of the query parameters without the hmac
  const params = { ...queryParams };
  delete params.hmac;
  
  // Sort the parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  
  // Calculate the HMAC
  const calculatedHmac = crypto
    .createHmac('sha256', shopifyConfig.apiSecretKey)
    .update(sortedParams, 'utf8')
    .digest('hex');
  
  // Compare the calculated HMAC with the one from Shopify
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHmac),
    Buffer.from(hmac)
  );
}

/**
 * Gets the authorization URL for a Shopify store
 */
export function getAuthorizationUrl(shop: string, state: string): string {
  // Validate shop
  if (!isValidShopDomain(shop)) {
    throw new Error('Invalid shop domain');
  }
  
  // Build the authorization URL with state parameter for CSRF protection
  return `${SHOPIFY_AUTH_ENDPOINTS.authorize(shop)}&state=${state}`;
}

/**
 * Exchanges the auth code for an access token
 */
export async function exchangeCodeForToken(shop: string, code: string): Promise<{
  access_token: string;
  scope: string;
}> {
  const response = await fetch(SHOPIFY_AUTH_ENDPOINTS.token(shop), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: shopifyConfig.apiKey,
      client_secret: shopifyConfig.apiSecretKey,
      code
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for token: ${errorText}`);
  }
  
  return response.json();
}

/**
 * Validates that the shop URL is in the correct format for a Shopify store
 */
export function isValidShopDomain(shop: string): boolean {
  // Validate that the shop domain is a valid Shopify domain
  // Pattern allows custom domains and *.myshopify.com domains
  const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
  return pattern.test(shop);
}

/**
 * Generates a nonce string for CSRF protection
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
} 