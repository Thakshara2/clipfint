import { Container } from "@/components/ui/container";

export default function SettingsPage() {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
            <div className="text-muted-foreground">
              <p>Manage your subscription and payment methods</p>
              <p className="text-sm mt-2">Current Plan: Free Trial</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
            <div className="text-muted-foreground">
              <p>Track your text-to-speech usage</p>
              <p className="text-sm mt-2">Characters generated this month: 0</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
} 