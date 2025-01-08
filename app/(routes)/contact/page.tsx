import { Container } from "@/components/ui/container"

export default function ContactPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="prose dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions or need assistance? We&apos;re here to help.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Clipfint LLC</p>
              <p>4283 EXPRESS LANE</p>
              <p>SUITE LK2698</p>
              <p>SARASOTA, FL 34249</p>
              <p>Email: support@clipfint.xyz</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
            <p className="text-muted-foreground">
              Monday - Friday: 9:00 AM - 5:00 PM EST
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
} 