import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-xl">AI Chat Deployer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20">
          <div className="container flex flex-col items-center text-center gap-8">
            <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
              AI-Powered Chat Widgets for Your Ecommerce Site
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Create, customize, and deploy conversational AI interfaces that match your brand.
              Increase conversions and engagement with personalized customer interactions.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg">See demo</Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-muted">
          <div className="container grid gap-12 md:grid-cols-3">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold">Custom Prompts</h3>
              <p className="text-muted-foreground">
                Configure AI behavior with custom prompts that align with your brand voice and business goals.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold">Visual Customization</h3>
              <p className="text-muted-foreground">
                Style your chat widget to match your brand with an intuitive visual editor.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold">Ecommerce Integration</h3>
              <p className="text-muted-foreground">
                Connect with your ecommerce stack to enable product recommendations and order assistance.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container flex flex-col items-center text-center gap-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              Ready to transform your customer experience?
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Join thousands of brands using AI chat widgets to boost engagement and conversion.
            </p>
            <Link href="/dashboard">
              <Button size="lg">Start building now</Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 AI Chat Deployer. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
