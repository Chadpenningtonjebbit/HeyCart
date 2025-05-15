"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWidgetPreview } from "@/components/widgets/ChatWidgetPreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ColorInput } from "@/components/ui/color-input";

export default function CreateWidgetPage() {
  // State for widget styling
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [textColor, setTextColor] = useState("#111827");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [buttonText, setButtonText] = useState("Chat with us");
  const [windowTitle, setWindowTitle] = useState("Chat Support");
  const [initialGreeting, setInitialGreeting] = useState("Hi there! How can I help you today?");
  const [avatarUrl, setAvatarUrl] = useState("");

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Widget</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create Widget</h1>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button>Save & Deploy</Button>
          </div>
        </div>
        
        <Tabs defaultValue="basic" className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="prompt">Prompt Setup</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for your chat widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Widget Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Product Assistant"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is for your reference and won't be displayed to users
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this widget will do"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    A brief description to help you identify this widget
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="placement" className="text-sm font-medium leading-none">
                    Widget Placement
                  </Label>
                  <RadioGroup defaultValue="bottom-right" className="grid grid-cols-3 gap-4 pt-2">
                    <div className={`p-4 border rounded-lg cursor-pointer border-primary bg-primary/5`}>
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="bottom-right" id="bottom-right" className="mt-1" />
                        <div>
                          <Label htmlFor="bottom-right" className="text-sm font-medium leading-none cursor-pointer">
                            Bottom Right
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Most common placement</p>
                        </div>
                      </div>
                    </div>
                    <div className={`p-4 border rounded-lg cursor-pointer border-border hover:border-primary/50`}>
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="bottom-left" id="bottom-left" className="mt-1" />
                        <div>
                          <Label htmlFor="bottom-left" className="text-sm font-medium leading-none cursor-pointer">
                            Bottom Left
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Alternative corner placement</p>
                        </div>
                      </div>
                    </div>
                    <div className={`p-4 border rounded-lg cursor-pointer border-border hover:border-primary/50`}>
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value="center" id="center" className="mt-1" />
                        <div>
                          <Label htmlFor="center" className="text-sm font-medium leading-none cursor-pointer">
                            Center
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">Modal-style placement</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prompt">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Configuration</CardTitle>
                <CardDescription>
                  Define how your AI chat will respond to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">
                    System Prompt
                  </Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Instructions for the AI on how to behave and respond"
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    This sets the personality and capabilities of your AI assistant
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="greeting">
                    Initial Greeting
                  </Label>
                  <Input
                    id="greeting"
                    placeholder="e.g. Hi there! How can I help you today?"
                    value={initialGreeting}
                    onChange={(e) => setInitialGreeting(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The first message shown to users when they open the chat
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Brand Voice Settings</h3>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="tone" className="text-xs text-muted-foreground">
                        Tone
                      </Label>
                      <Select>
                        <SelectTrigger id="tone">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-xs text-muted-foreground">
                        Style
                      </Label>
                      <Select>
                        <SelectTrigger id="style">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="simple">Simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="styling">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Styling</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none">Widget Colors</h3>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="primary-color" className="text-xs text-muted-foreground">
                          Primary Color
                        </Label>
                        <ColorInput
                          id="primary-color"
                          value={primaryColor}
                          onChange={setPrimaryColor}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="text-color" className="text-xs text-muted-foreground">
                          Text Color
                        </Label>
                        <ColorInput
                          id="text-color"
                          value={textColor}
                          onChange={setTextColor}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="background-color" className="text-xs text-muted-foreground">
                          Background Color
                        </Label>
                        <ColorInput
                          id="background-color"
                          value={backgroundColor}
                          onChange={setBackgroundColor}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none">Chat Button</h3>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="button-text" className="text-xs text-muted-foreground">
                          Button Text
                        </Label>
                        <Input
                          id="button-text"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="button-icon" className="text-xs text-muted-foreground">
                          Button Icon
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex items-center justify-center rounded text-white" style={{ backgroundColor: primaryColor }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </div>
                          <Select>
                            <SelectTrigger id="button-icon" className="w-full">
                              <SelectValue placeholder="Select icon" defaultValue="chat" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chat">Chat Icon</SelectItem>
                              <SelectItem value="message">Message Icon</SelectItem>
                              <SelectItem value="help">Help Icon</SelectItem>
                              <SelectItem value="support">Support Icon</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium leading-none">Chat Window</h3>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="window-title" className="text-xs text-muted-foreground">
                          Window Title
                        </Label>
                        <Input
                          id="window-title"
                          value={windowTitle}
                          onChange={(e) => setWindowTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatar-url" className="text-xs text-muted-foreground">
                          AI Avatar URL
                        </Label>
                        <Input
                          id="avatar-url"
                          placeholder="https://example.com/avatar.png"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div>
                <ChatWidgetPreview 
                  primaryColor={primaryColor}
                  textColor={textColor}
                  backgroundColor={backgroundColor}
                  buttonText={buttonText}
                  windowTitle={windowTitle}
                  initialGreeting={initialGreeting}
                  avatarUrl={avatarUrl}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Connect your chat widget with your ecommerce platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">Platform Connection</h3>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className={`p-4 border rounded-lg cursor-pointer border-primary bg-primary/5`}>
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <svg viewBox="0 0 109 124" className="w-8 h-8 text-[#95BF47]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M94.6 23.9c-.1-.7-.7-1.1-1.2-1.1s-9.7-.7-9.7-.7-6.4-6.4-7.1-7.1c-.7-.7-2.1-.5-2.6-.3-.1 0-1.6.5-4.2 1.3C67.8 12.2 63.5 9 57.5 9c-.3 0-.6 0-.9.1C55 7.2 53 6 50.5 6c-9.2 0-13.8 11.5-15.3 17.4-3.6 1.1-6.2 1.9-6.6 2-2 .6-2.1 2.1-2.1 2.2 0 .1-1.3 9.8-2.8 21.4-2.8 21.3-7 51.1-7 51.1l54.1 9.8 29.1-7.3c-.1-.2-5.1-35-5.3-36.6v-.1c.5-3.5 1-7.8 1.3-10.9.8-7 1.5-12.6 1.5-12.6l-.1-19zm-24.2-7.7c-2 .6-4.3 1.3-6.7 2.1.1-3.1.5-7.5 2.2-11.2 2.1 1.4 3.9 3.5 4.5 9.1zm-10.7 3.4c-4.5 1.4-9.4 2.9-14.4 4.4 1.4-5.3 4.1-10.6 9.2-10.6 2 0 3.5 1.4 5.2 6.2zm-7.9-10.6c1.3 0 2.5.4 3.5 1.2-4.4 2.1-7.2 7.3-8.6 12.7-3.7 1.1-7.2 2.2-10.5 3.2C38.4 16.7 42.3 9 51.8 9z" />
                            <path d="M93.4 22.8c-.5-.1-9.7-.7-9.7-.7s-6.4-6.4-7.1-7.1c-.3-.3-.6-.4-.9-.4l-5 78.2 29.1-7.3s-5.3-35.9-5.4-37.6c-.1-1.8 0-24 0-24 0-.3-.4-.9-1-1.1z" fill="#5E8E3E" />
                            <path d="M57.5 39.6l-4.2 12.3s-3.7-2-8.2-2c-6.6 0-6.9 4.2-6.9 5.2 0 5.7 14.8 7.9 14.8 21.3 0 10.5-6.7 17.3-15.7 17.3-10.8 0-16.3-6.7-16.3-6.7l2.9-9.5s5.7 4.9 10.5 4.9c3.1 0 4.4-2.5 4.4-4.3 0-7.5-12.2-7.8-12.2-20.1 0-10.3 7.4-20.3 22.5-20.3 5.8.1 8.4 1.9 8.4 1.9z" fill="white" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Shopify</span>
                        <Link href="/dashboard/integration/shopify">
                          <Button size="sm" variant="outline">Connect</Button>
                        </Link>
                      </div>
                    </div>
                    <div className={`p-4 border rounded-lg cursor-pointer border-border hover:border-primary/50`}>
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#96588A]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.64 14.3a5.93 5.93 0 0 0-.59-.58c-.01 0-.02-.01-.03-.01-.01 0-.01 0-.01-.01-.43-.34-.94-.61-1.5-.8-1.46-.46-3.07-.14-4.17.85a2.87 2.87 0 0 0-3.6-.04 2.8 2.8 0 0 0-1.6-.5 2.85 2.85 0 0 0-2.85 2.86c0 .93.46 1.75 1.15 2.26-.02.07-.04.14-.05.23 0 0 0 0 0 0 0 0 0 0 0 0-.43 2.21 1.13 3.96 3.34 4.38.07.01.13.03.2.04h.08c.36.07.76.1 1.19.1 1.95 0 3.94-.58 5.12-2.1l.16-.2c1.04-1.23 1.28-2.97.6-4.42l-.01-.01zM7.74 19.23c.13 0 .25 0 .36-.02l.01-.01c.26-.03.43-.14.51-.31.07-.17.06-.38-.04-.62l-.27-.61s-.01-.03-.02-.04c-.36-.78-1.4-3.21-1.93-4.48l-.01-.03c-.1-.24-.19-.37-.39-.47-.07-.04-.15-.05-.23-.05-.21 0-.41.11-.51.22-.12.13-.17.29-.12.51 0 0 0 .01 0 .01l.79 2.95-1.4-2.89-.03-.06c-.1-.2-.2-.31-.36-.38a.681.681 0 0 0-.28-.06c-.24 0-.48.15-.57.32l-.01.01c-.11.21-.09.42.05.67 0 0 .01.01.01.01l1.7 3.53c.31.65.69.98 1.21 1.06.12.01.24.02.36.02l.07-.01h.05s.09 0 .12-.01zm2.83.37a.764.764 0 0 0 .29-.06c.24-.1.43-.33.57-.68 0 0 0 0 0 0l.01-.01v-.01l.77-2.53.17 1.11c.07.48.26.71.58.75.07.01.14.01.2.01.23 0 .43-.08.59-.23a.91.91 0 0 0 .31-.62l.18-1.76c.42.27.98.4 1.54.26.25-.06.47-.18.68-.33.06-.05.15-.04.23.01.52.32 1.12.47 1.73.36.49-.09.94-.3 1.31-.61l.6 1.26c.07.16.17.28.3.35.1.06.22.09.35.09.17 0 .33-.05.45-.16.12-.1.2-.25.21-.42.01-.11-.02-.23-.09-.36l-1.44-3.03.01-.01v-.01s-.24-.51-.34-.69a4.07 4.07 0 0 0-.48-.74c-.23-.34-.49-.62-.71-.8-.21-.14-.4-.25-.76-.37a3.07 3.07 0 0 0-.65-.14l-.38-.02c-.12 0-.24 0-.35.01-.16 0-.3.02-.45.04-.56.07-1.09.3-1.53.67-.57.48-.99 1.15-1.17 1.95-.38 1.6.19 3.32 1.15 4.14.05.05.1.09.16.13.03.01.06.02.08.03.15.07.3.1.45.1zm5.39-4.97c.11.21.1.49-.03.75-.22.43-.53.61-.95.61-.22 0-.41-.05-.57-.15-.52-.33-.77-1.3-.53-2.06.01-.04.02-.07.04-.11.13-.33.35-.51.63-.51.08 0 .17.01.26.04.39.13.84.59 1.08 1.27.07.17.09.13.07.16zm-3.08.02c.13.28.12.66-.02.99-.2.47-.55.63-.88.63-.17 0-.31-.04-.42-.11-.3-.19-.49-.58-.52-1.08-.02-.39.07-.76.25-1.01.13-.18.32-.28.54-.28.06 0 .13.01.2.03.42.11.69.42.85.83z"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">WooCommerce</span>
                        <Button size="sm" variant="outline" disabled>Coming Soon</Button>
                      </div>
                    </div>
                    <div className={`p-4 border rounded-lg cursor-pointer border-border hover:border-primary/50`}>
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#f5740a]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.31 5.45c0 .53-.3 1.42-.66 1.42s-.65-.89-.65-1.42c0-.54.3-1.41.66-1.41.36-.01.65.88.65 1.41zm-3.32 1.94c.36 0 .65.89.65 1.42 0 .54-.3 1.42-.66 1.42-.36 0-.65-.89-.65-1.42s.3-1.42.66-1.42zM12 13.68c-.36 0-.65-.88-.65-1.41 0-.52.3-1.4.66-1.4.36 0 .65.87.65 1.4.01.53-.29 1.41-.66 1.41zm-1.31-9.17c0 .56-.29 1.48-.65 1.48s-.66-.93-.66-1.48c0-.56.3-1.49.66-1.49s.65.93.65 1.49zm-3.33 2.05c.36 0 .65.92.65 1.48s-.29 1.48-.65 1.48-.66-.92-.66-1.48.3-1.48.66-1.48zM6.01 10.6c0 .57-.3 1.49-.66 1.49s-.65-.93-.65-1.49c0-.57.29-1.48.65-1.48s.66.92.66 1.48zm.04 4.04c.36 0 .65.93.65 1.49 0 .57-.29 1.5-.65 1.5s-.66-.94-.66-1.5c0-.57.3-1.49.66-1.49zm3.33 2.05c0 .56-.3 1.49-.66 1.49s-.65-.93-.65-1.49c0-.57.29-1.49.65-1.49s.66.93.66 1.49zm3.33-2.05c.36 0 .65.93.65 1.49 0 .57-.29 1.5-.65 1.5s-.66-.94-.66-1.5c0-.57.3-1.49.66-1.49zm3.33 2.05c0 .56-.29 1.49-.65 1.49s-.66-.93-.66-1.49c0-.57.3-1.49.66-1.49s.65.93.65 1.49zm.04-4.04c.36 0 .65.93.65 1.49 0 .57-.29 1.5-.65 1.5s-.66-.94-.66-1.5c0-.57.3-1.49.66-1.49zm-.04-4.04c0 .57-.29 1.48-.65 1.48s-.66-.92-.66-1.48.3-1.48.66-1.48.65.92.65 1.48z"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">Magento</span>
                        <Button size="sm" variant="outline" disabled>Coming Soon</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-none">AI Capabilities</h3>
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="shopify-enabled" defaultChecked />
                      <Label
                        htmlFor="shopify-enabled"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable Shopify integration in widget
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="product-recommendations" defaultChecked />
                      <Label
                        htmlFor="product-recommendations"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        AI-powered product recommendations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="order-lookup" defaultChecked />
                      <Label
                        htmlFor="order-lookup"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Order tracking and lookup
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="border rounded-md p-4 bg-muted/20">
                    <h3 className="text-sm font-medium">Integration Status</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      To fully enable AI-powered product recommendations and order tracking, you first need to connect your Shopify store in the Integrations page.
                    </p>
                    <div className="mt-6">
                      <Link href="/dashboard/integration/shopify">
                        <Button>Connect Shopify Store</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 