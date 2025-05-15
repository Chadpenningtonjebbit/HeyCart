import { ShopifyWebhookTopic } from './types';
import { createWebhook } from './api';
import { prisma } from '../db';

interface WebhookSetupParams {
  shop: string;
  accessToken: string;
  baseUrl: string;
}

/**
 * Sets up all required webhooks for a Shopify store
 */
export async function setupShopifyWebhooks({
  shop,
  accessToken,
  baseUrl
}: WebhookSetupParams): Promise<boolean> {
  try {
    const webhookEndpoint = `${baseUrl}/api/shopify/webhooks`;
    
    // Define the topics we want to subscribe to
    const topics = [
      ShopifyWebhookTopic.PRODUCTS_CREATE,
      ShopifyWebhookTopic.PRODUCTS_UPDATE,
      ShopifyWebhookTopic.PRODUCTS_DELETE,
      ShopifyWebhookTopic.ORDERS_CREATE,
      ShopifyWebhookTopic.ORDERS_UPDATED,
      ShopifyWebhookTopic.ORDERS_CANCELLED,
      ShopifyWebhookTopic.APP_UNINSTALLED,
      ShopifyWebhookTopic.SHOP_UPDATE
    ];
    
    // Create webhooks for each topic
    for (const topic of topics) {
      await createWebhook(shop, accessToken, webhookEndpoint, topic);
    }
    
    console.log(`Successfully registered webhooks for ${shop}`);
    return true;
  } catch (error) {
    console.error('Failed to setup webhooks:', error);
    return false;
  }
}

/**
 * Creates a single webhook subscription
 */
async function createWebhook(
  shop: string,
  accessToken: string,
  webhookEndpoint: string,
  topic: ShopifyWebhookTopic
): Promise<void> {
  // GraphQL mutation to create a webhook subscription
  const mutation = `
    mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
      webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
        webhookSubscription {
          id
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const variables = {
    topic: topic.toUpperCase().replace('/', '_'),
    webhookSubscription: {
      callbackUrl: webhookEndpoint,
      format: "JSON"
    }
  };
  
  // Call Shopify GraphQL API
  const response = await fetch(`https://${shop}/admin/api/2023-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({
      query: mutation,
      variables
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create webhook for ${topic}: ${errorText}`);
  }
  
  const result = await response.json();
  
  if (result.data?.webhookSubscriptionCreate?.userErrors?.length > 0) {
    const errors = result.data.webhookSubscriptionCreate.userErrors
      .map((error: any) => `${error.field}: ${error.message}`)
      .join(', ');
    
    throw new Error(`Failed to create webhook for ${topic}: ${errors}`);
  }
  
  console.log(`Created webhook for ${topic}`);
}

/**
 * Deletes all webhooks for a store
 * Useful when uninstalling the app or resetting webhooks
 */
export async function deleteAllWebhooks(shop: string, accessToken: string): Promise<boolean> {
  try {
    // Query to get all webhooks
    const query = `
      query {
        webhookSubscriptions(first: 100) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
    
    // Get all webhooks
    const response = await fetch(`https://${shop}/admin/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get webhooks: ${await response.text()}`);
    }
    
    const result = await response.json();
    const webhooks = result.data?.webhookSubscriptions?.edges || [];
    
    // Delete each webhook
    for (const webhook of webhooks) {
      await deleteWebhook(shop, accessToken, webhook.node.id);
    }
    
    console.log(`Successfully deleted ${webhooks.length} webhooks for ${shop}`);
    return true;
  } catch (error) {
    console.error('Failed to delete webhooks:', error);
    return false;
  }
}

/**
 * Deletes a single webhook
 */
async function deleteWebhook(shop: string, accessToken: string, webhookId: string): Promise<void> {
  const mutation = `
    mutation webhookSubscriptionDelete($id: ID!) {
      webhookSubscriptionDelete(id: $id) {
        deletedWebhookSubscriptionId
        userErrors {
          field
          message
        }
      }
    }
  `;
  
  const variables = {
    id: webhookId
  };
  
  const response = await fetch(`https://${shop}/admin/api/2023-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({
      query: mutation,
      variables
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete webhook: ${await response.text()}`);
  }
  
  const result = await response.json();
  
  if (result.data?.webhookSubscriptionDelete?.userErrors?.length > 0) {
    const errors = result.data.webhookSubscriptionDelete.userErrors
      .map((error: any) => `${error.field}: ${error.message}`)
      .join(', ');
    
    throw new Error(`Failed to delete webhook: ${errors}`);
  }
} 