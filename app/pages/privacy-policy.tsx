import { Container } from "@/components/ui/container"

export default function PrivacyPolicy() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name and contact information</li>
            <li>Payment information</li>
            <li>Usage data and preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Process your payments</li>
            <li>Send you updates and marketing communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </section>
      </div>
    </Container>
  )
} 