import { TextToSpeechForm } from '@/components/text-to-speech-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  return (
    <SidebarProvider>
      {isAuthenticated && <AppSidebar />}
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-muted/30">
          <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-lg z-50">
            <div className="max-w-5xl mx-auto flex items-center justify-end h-16 px-4">
              {!isAuthenticated && (
                <div className="flex items-center gap-4">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm">Get started</Button>
                  </Link>
                </div>
              )}
              <ThemeToggle />
            </div>
          </nav>

          <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-[600px] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  Transform your text into natural-sounding speech with AI
                </h2>
                <p className="text-muted-foreground max-w-[500px] text-base leading-relaxed mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
                  Perfect for content creators, educators, and accessibility needs. Generate human-like voices with advanced AI technology.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                {['Voice Cloning', 'Multiple Speakers', 'Emotion Control', 'Real-time Generation'].map((feature) => (
                  <div key={feature} className="px-3 py-1 rounded-full border bg-background/50 text-xs font-medium text-muted-foreground hover:border-primary/50 transition-colors">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/30 rounded-2xl blur opacity-50" />
                <div className="relative">
                  {isAuthenticated ? (
                    <TextToSpeechForm />
                  ) : (
                    <Card className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-2">Sign in to Generate Speech</h3>
                      <p className="text-muted-foreground mb-6">Create an account or sign in to start generating natural-sounding speech.</p>
                      <div className="flex justify-center gap-4">
                        <Link href="/sign-in">
                          <Button variant="outline">Sign in</Button>
                        </Link>
                        <Link href="/sign-up">
                          <Button>Get started</Button>
                        </Link>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>

          <footer className="border-t bg-background/50 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4 py-6">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                  <Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms
                  </Link>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy
                  </Link>
                  <Link href="/refund-policy" className="text-muted-foreground hover:text-primary transition-colors">
                    Refund Policy
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                  Powered by advanced AI technology
                </p>
              </div>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}