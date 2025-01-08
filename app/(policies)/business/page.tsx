import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function BusinessPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Business Information</h1>
        
        <div className="prose dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Company Details</h2>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>Company Name: Clipfint LLC</li>
              <li>Business Type: Limited Liability Company</li>
              <li>Founded: 2024</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>Email: support@clipfint.xyz</li>
              <li>Website: clipfint.xyz</li>
              <li>Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Business Operations</h2>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>Primary Service: AI-powered text-to-speech generation</li>
              <li>Target Market: Content creators, educators, and businesses</li>
              <li>Service Delivery: Cloud-based platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Legal Information</h2>
            <ul className="list-none space-y-2 text-muted-foreground">
              <li>Tax ID: Available upon request</li>
              <li>State of Registration: Delaware</li>
              <li>
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> | 
                <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> | 
                <Link href="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              For business inquiries, please visit our <Link href="/contact" className="text-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}