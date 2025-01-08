import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    priceDetail: "0 USD",
    description: "Perfect for trying out our service",
    features: [
      "3 generations per month",
      "500 characters per generation",
      "Basic voice options",
      "Standard quality",
      "Instant delivery",
      "Cancel anytime"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const
  },
  {
    name: "Pro",
    price: "$10",
    priceDetail: "10 USD",
    period: "per month",
    description: "For regular content creators",
    features: [
      "20 generations per month",
      "2,000 characters per generation",
      "All voice options",
      "High quality output",
      "Priority support",
      "Instant delivery",
      "Cancel anytime",
      "14-day money-back guarantee"
    ],
    buttonText: "Subscribe",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Premium",
    price: "$20",
    priceDetail: "20 USD",
    period: "per month",
    description: "For power users",
    features: [
      "50 generations per month",
      "2,500 characters per generation",
      "All voice options",
      "Highest quality output",
      "Priority support",
      "Instant delivery",
      "Cancel anytime",
      "14-day money-back guarantee"
    ],
    buttonText: "Subscribe",
    buttonVariant: "outline" as const
  }
]

export default function PricingPage() {
  return (
    <Container className="py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground mb-2">
          Choose the plan that best fits your needs. Prices in USD.
        </p>
        <p className="text-sm text-muted-foreground">
          All paid plans include a 14-day money-back guarantee. Cancel anytime with no questions asked.
          Instant delivery for all generated audio files. Need help choosing? <a href="/contact" className="text-primary hover:underline">Contact us</a>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`p-8 relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
              <div className="mb-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">/{plan.period}</span>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {plan.priceDetail} {plan.period}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant={plan.buttonVariant} className="w-full">
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          By subscribing, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and 
          <a href="/privacy-policy" className="text-primary hover:underline"> Privacy Policy</a>.
          View our <a href="/refund-policy" className="text-primary hover:underline">Refund Policy</a>.
        </p>
      </div>
    </Container>
  )
} 