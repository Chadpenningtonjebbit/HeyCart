# AI-Powered Shopify Sales Assistant

This document explains how to set up the AI-powered virtual sales assistant for your Shopify store within the chat widget.

## Overview

The AI-powered sales assistant leverages OpenAI's models to provide personalized product recommendations, answer customer questions, and provide a conversational shopping experience similar to an in-store sales representative.

Key features:
- Natural language conversation with customers
- Intelligent product recommendations based on customer needs
- Order status lookup and information
- Shopify product catalog integration

## Setup Requirements

### 1. Environment Variables

Add the following to your `.env` file:

```
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Shopify API Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret_key
```

### 2. Dependencies

Ensure you have the required packages installed:

```
npm install openai
```

### 3. Shopify Store Connection

Connect your Shopify store to enable product recommendations:

1. Navigate to Dashboard > Integrations > Shopify
2. Follow the OAuth flow to connect your store
3. Once connected, perform an initial sync of your products and orders

## How It Works

1. **Chat Processing**: Customer messages are sent to our AI endpoint (`/api/chat/process`)
2. **Product Analysis**: The AI determines if a message is product-related
3. **Data Integration**: If product-related, relevant products from your Shopify store are retrieved
4. **Intelligent Response**: The AI crafts a response that may include product recommendations

## Configuration Options

Customize your AI sales assistant through the widget settings:

- **Initial Greeting**: Set the first message customers see
- **Product Recommendation Style**: Control how products are recommended
- **AI Personality**: Adjust the tone and style of the assistant

## Usage Examples

### Product Recommendations

When a customer asks something like:
> "I'm looking for a warm winter jacket"

The AI will:
1. Identify this as a product query
2. Search your Shopify store for relevant products
3. Recommend specific items from your catalog

### Order Inquiries

When a customer asks:
> "Where is my order #1001?"

The AI will:
1. Recognize this as an order inquiry
2. Look up the order in your Shopify store
3. Provide status information about the order

## Best Practices

1. **Initial Data Sync**: Ensure your product catalog is fully synced before using the assistant
2. **Regular Updates**: Keep your product information up-to-date with regular syncs
3. **Monitor Conversations**: Review chat logs to improve the assistant's performance
4. **Custom Training**: Consider providing additional context about your products

## Troubleshooting

Common issues:

1. **No Product Recommendations**: Ensure Shopify integration is connected and products are synced
2. **API Errors**: Check that your OpenAI API key is valid and has sufficient credits
3. **Incorrect Recommendations**: Make sure product descriptions in Shopify are detailed

## Advanced Usage

### Customizing the AI Prompt

You can modify the system prompt in `src/app/api/chat/process/route.ts` to provide more specific instructions to the AI about your brand voice, product information, or sales approach.

### Adding Product Knowledge

For better product recommendations, consider enhancing your product descriptions in Shopify with:
- Detailed specifications
- Use cases
- Target customer information
- Comparable products 