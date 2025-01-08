import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <Container className="py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="grid gap-8">
          <Card className="p-6">
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <Textarea id="message" placeholder="How can we help?" className="min-h-[150px]" />
                </div>
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </Card>

          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Other Ways to Reach Us</h2>
            <div className="text-muted-foreground">
              <p>Clipfint LLC</p>
              <p>Email: support@clipfint.com</p>
              <p>Hours: Monday - Friday, 9am - 5pm EST</p>
              <p className="mt-2 text-sm">We typically respond within 1 business day</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
} 