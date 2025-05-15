import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getProductRecommendations } from '@/lib/shopify/widget-service';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Handles chat message processing with AI
 * POST /api/chat/process
 * Body: { widgetId: string, message: string, conversationHistory: [{ role: string, content: string }] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { widgetId, message, conversationHistory = [] } = body;
    
    if (!widgetId || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get the widget with its Shopify store connection
    const widget = await prisma.widget.findUnique({
      where: { id: widgetId },
      include: { shopifyStore: true }
    });
    
    // Check if the widget is connected to a Shopify store
    const hasShopify = !!widget?.shopifyStore;
    
    // Get store context if Shopify is connected
    let storeContext = '';
    if (hasShopify) {
      const storeInfo = await prisma.shopifyStore.findUnique({
        where: { id: widget.shopifyStore!.id }
      });
      
      if (storeInfo) {
        storeContext = `You are a virtual sales assistant for ${storeInfo.name} (${storeInfo.domain}). `;
      }
    }
    
    // Analyze the message to see if it's product-related
    const isProductQuery = await checkIfProductQuery(message);
    
    // If it's a product query and we have a Shopify connection, fetch relevant products
    let productContext = '';
    if (isProductQuery && hasShopify) {
      const relevantProducts = await getProductRecommendations(
        widgetId,
        extractProductKeywords(message),
        5
      );
      
      if (relevantProducts.length > 0) {
        productContext = `
Here are some products that might be relevant to the customer's query:
${relevantProducts.map((product, index) => `
${index + 1}. ${product.title}
   Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}
   Description: ${product.description ? product.description.substring(0, 100) + '...' : 'No description available.'}
   URL: ${product.url}
`).join('')}

You can recommend these products if they match what the customer is looking for. Use the exact product names and URLs from above.
`;
      }
    }
    
    // Prepare the system prompt
    const systemPrompt = `${storeContext}You are a helpful, friendly, and knowledgeable sales assistant. 
Your goal is to help customers find products they're looking for, answer questions about products, and provide excellent customer service.
Be concise but informative. Always be polite and professional.
${productContext}`;
    
    // Format conversation history for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    });
    
    // Get the AI response
    const aiResponse = completion.choices[0].message.content;
    
    // Store the conversation in the database
    await prisma.chatMessage.create({
      data: {
        widgetId,
        role: 'user',
        content: message,
        sentAt: new Date()
      }
    });
    
    await prisma.chatMessage.create({
      data: {
        widgetId,
        role: 'assistant',
        content: aiResponse || "I'm sorry, I couldn't generate a response.",
        sentAt: new Date()
      }
    });
    
    return NextResponse.json({
      response: aiResponse
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

/**
 * Checks if a message is likely a product query
 */
async function checkIfProductQuery(message: string): Promise<boolean> {
  // Use OpenAI to determine if the message is product-related
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You analyze if a customer message is looking for products or product information. Respond with just "true" or "false".'
      },
      {
        role: 'user',
        content: `Is this message asking about products, looking for product recommendations, asking about product features, pricing, or availability? Message: "${message}"`
      }
    ],
    temperature: 0.1,
    max_tokens: 5
  });
  
  const result = response.choices[0].message.content?.toLowerCase().trim();
  return result === 'true';
}

/**
 * Extracts product-related keywords from a message
 */
function extractProductKeywords(message: string): string {
  // Simple keyword extraction - in production, you might want to use NLP
  // or have OpenAI extract keywords
  
  // Remove common words and punctuation
  const cleanedMessage = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(a|an|the|i|my|we|our|you|your|is|are|was|were|be|been|being|have|has|had|do|does|did|can|could|shall|should|will|would|may|might|must|am|is|are)\b/g, '')
    .trim();
  
  return cleanedMessage;
} 