import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-end h-16 px-4">
          <ThemeToggle />
        </div>
      </nav>

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
} 