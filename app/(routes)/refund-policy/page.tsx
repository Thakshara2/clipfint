import { Container } from "@/components/ui/container"

export default function RefundPolicyPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        
        <div className="prose dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            We want you to be satisfied with our service. This policy outlines our refund terms and conditions.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Refund Eligibility</h2>
          <p className="text-muted-foreground mb-6">
            You may be eligible for a refund if:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
            <li>The service was not as described</li>
            <li>Technical issues prevented service usage</li>
            <li>Request is made within 14 days of purchase</li>
            <li>Subscription cancellation before usage</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Refund Process</h2>
          <p className="text-muted-foreground mb-6">
            To request a refund:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mb-6">
            <li>Contact our support team through the <a href="/contact" className="text-primary hover:underline">contact page</a></li>
            <li>Provide your order details and reason for refund</li>
            <li>Allow up to 5-7 business days for review</li>
            <li>Refund will be processed to original payment method</li>
          </ol>

          <h2 className="text-xl font-semibold mt-8 mb-4">Processing Time</h2>
          <p className="text-muted-foreground mb-6">
            Once approved, refunds typically process within 5-7 business days, depending on your payment method and financial institution.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about our refund policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </Container>
  )
} 