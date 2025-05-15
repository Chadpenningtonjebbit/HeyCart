import { SHOPIFY_API_ENDPOINTS } from './config';

interface ShopifyGraphQLOptions {
  shop: string;
  accessToken: string;
  query: string;
  variables?: Record<string, any>;
}

interface WebhookOptions {
  shop: string;
  accessToken: string;
  topic: string;
  address: string;
}

/**
 * Makes a GraphQL request to the Shopify Admin API
 */
export async function shopifyGraphQL<T>({ 
  shop, 
  accessToken, 
  query, 
  variables = {} 
}: ShopifyGraphQLOptions): Promise<T> {
  const response = await fetch(SHOPIFY_API_ENDPOINTS.graphql(shop), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify GraphQL error (${response.status}): ${errorText}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(errors)}`);
  }

  return data as T;
}

/**
 * Creates a webhook subscription in the Shopify store
 */
export async function createWebhook({ 
  shop, 
  accessToken, 
  topic, 
  address 
}: WebhookOptions): Promise<{ webhook: { id: string } }> {
  const response = await fetch(SHOPIFY_API_ENDPOINTS.webhooks(shop), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({
      webhook: {
        topic,
        address,
        format: 'json'
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create webhook (${response.status}): ${errorText}`);
  }

  return response.json();
}

// GraphQL query for fetching shop information
export const GET_SHOP_INFO = `
  query {
    shop {
      id
      name
      email
      primaryDomain {
        url
        host
      }
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
    }
  }
`;

// GraphQL query for fetching products
export const GET_PRODUCTS = `
  query GetProducts($first: Int!, $cursor: String) {
    products(first: $first, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query for fetching orders
export const GET_ORDERS = `
  query GetOrders($first: Int!, $cursor: String) {
    orders(first: $first, after: $cursor, sortKey: CREATED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          customer {
            id
            firstName
            lastName
            email
          }
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`; 