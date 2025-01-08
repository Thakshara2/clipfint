import { Container } from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Contact() {
  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-4">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <form className="space-y-4">
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
              <Textarea id="message" placeholder="Your message" rows={5} />
            </div>

            <Button type="submit" className="w-full">Send Message</Button>
          </form>

          <div className="pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Other Ways to Contact Us</h3>
            <div className="space-y-2">
              <p>Email: support@audionext.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Audio Street, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
} 