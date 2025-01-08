import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background via-background/80 to-muted/30">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-card shadow-none border",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-background text-foreground border hover:bg-muted",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
      />
    </div>
  );
} 