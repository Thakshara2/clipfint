import { Container } from "@/components/ui/container"

export default function TermsPage() {
  return (
    <Container className="py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            By using VoiceForge, you agree to these terms. Please read them carefully.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-6">
            By accessing and using VoiceForge, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p className="text-muted-foreground mb-6">
            We grant you a personal, non-exclusive, non-transferable license to use VoiceForge in accordance with these terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Content</h2>
          <p className="text-muted-foreground mb-6">
            You retain all rights to any content you submit, post or display on or through VoiceForge.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Service Modifications</h2>
          <p className="text-muted-foreground mb-6">
            We reserve the right to modify or discontinue VoiceForge at any time without notice.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-6">
            VoiceForge is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact</h2>
          <p className="text-muted-foreground">
            For any questions about these Terms, please contact us at <a href="/contact" className="text-primary hover:underline">our contact page</a>.
          </p>
        </div>
      </div>
    </Container>
  )
} 