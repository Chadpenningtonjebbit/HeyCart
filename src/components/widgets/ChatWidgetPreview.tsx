"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ShopifyIntegratedWidget } from './ShopifyIntegratedWidget';

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWidgetPreviewProps {
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  buttonText?: string;
  windowTitle?: string;
  avatarUrl?: string;
  initialGreeting?: string;
  shopifyEnabled?: boolean;
}

export function ChatWidgetPreview({
  primaryColor = "#2563eb",
  textColor = "#111827",
  backgroundColor = "#ffffff",
  buttonText = "Chat with us",
  windowTitle = "Chat Support",
  avatarUrl = "",
  initialGreeting = "Hi there! How can I help you today?",
  shopifyEnabled = false,
}: ChatWidgetPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialGreeting,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Format conversation history for the AI
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the AI endpoint
      const response = await fetch('/api/chat/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          widgetId: 'preview-widget-id', // For preview, we use a fixed ID
          message: userMessage.content,
          conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process message');
      }

      const data = await response.json();
      
      // Add AI response
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't generate a response right now.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Use the same AI processing as handleSubmit
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    fetch('/api/chat/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        widgetId: 'preview-widget-id',
        message: text,
        conversationHistory
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to process message');
      }
      return response.json();
    })
    .then(data => {
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't generate a response right now.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    })
    .catch(error => {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    });
  };

  const buttonStyle = {
    backgroundColor: primaryColor,
    color: "#ffffff"
  };
  
  const headerStyle = {
    backgroundColor: primaryColor,
    color: "#ffffff"
  };
  
  const chatWindowStyle = {
    backgroundColor: backgroundColor,
    color: textColor
  };
  
  const userBubbleStyle = {
    backgroundColor: primaryColor,
    color: "#ffffff"
  };
  
  const aiBubbleStyle = {
    backgroundColor: "#f1f5f9",
    color: textColor
  };

  return (
    <div className="relative z-10 h-[600px] w-full flex items-end justify-end p-4 border rounded-lg bg-gray-50">
      {isOpen && (
        <div 
          className="absolute bottom-20 right-4 w-[350px] rounded-lg shadow-lg overflow-hidden flex flex-col"
          style={chatWindowStyle}
        >
          <div 
            className="p-4 flex items-center gap-3"
            style={headerStyle}
          >
            {avatarUrl ? (
              <Avatar className="h-8 w-8">
                <img src={avatarUrl} alt="AI Assistant" />
              </Avatar>
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            )}
            <span className="font-medium">{windowTitle}</span>
            <button 
              onClick={toggleChat} 
              className="ml-auto text-white/80 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 h-[300px] flex flex-col gap-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "rounded-tr-none" : "rounded-tl-none"
                  }`}
                  style={message.role === "user" ? userBubbleStyle : aiBubbleStyle}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div 
                  className="max-w-[80%] rounded-lg p-3 rounded-tl-none"
                  style={aiBubbleStyle}
                >
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shopify integration controls */}
          {shopifyEnabled && (
            <div className="p-2 border-t">
              <ShopifyIntegratedWidget 
                widgetId="preview-widget-id" 
                onSendMessage={handleSendMessage}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ color: textColor }}
              />
              <Button 
                type="submit" 
                size="sm"
                style={buttonStyle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </Button>
            </div>
          </form>
        </div>
      )}

      <Button 
        onClick={toggleChat} 
        size="lg"
        className="rounded-full shadow-lg flex items-center gap-2"
        style={buttonStyle}
      >
        {!isOpen && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {buttonText}
          </>
        )}
        {isOpen && (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Close
          </>
        )}
      </Button>
    </div>
  );
} 