import { Container } from "@/components/ui/container"

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="text-muted-foreground mb-6">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Account information (name, email, password)</li>
            <li>Usage data and preferences</li>
            <li>Text content submitted for speech generation</li>
            <li>Payment information (processed securely by Stripe)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-6">
            We use the collected information to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Provide and improve our services</li>
            <li>Process your payments</li>
            <li>Send you important updates</li>
            <li>Respond to your requests</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="text-muted-foreground mb-6">
            We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about our Privacy Policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </Container>
  )
} 