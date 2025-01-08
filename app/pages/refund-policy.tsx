import { Container } from "@/components/ui/container"

export default function RefundPolicy() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
          <p className="mb-4">
            We offer refunds under the following conditions:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service unavailability or technical issues on our end</li>
            <li>Billing errors or unauthorized charges</li>
            <li>Cancellation within 14 days of subscription start</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Process</h2>
          <p className="mb-4">
            To request a refund:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>Contact our support team</li>
            <li>Provide your order/transaction details</li>
            <li>Explain the reason for your refund request</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Processing Time</h2>
          <p>
            Refunds are typically processed within 5-10 business days, depending on your payment method and financial institution.
          </p>
        </section>
      </div>
    </Container>
  )
} 