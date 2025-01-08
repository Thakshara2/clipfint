import { Container } from "@/components/ui/container";

export default function HistoryPage() {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Generation History</h1>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-center text-muted-foreground">
            <p>Your text-to-speech generation history will appear here.</p>
            <p className="text-sm mt-2">Start generating to see your history!</p>
          </div>
        </div>
      </div>
    </Container>
  );
} 