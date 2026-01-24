import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-card border border-border shadow-lg",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-muted hover:bg-muted/80 border-border text-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-muted/50 border-input text-foreground",
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            footerActionLink: "text-primary hover:text-primary/80",
            identifierPreviewText: "text-foreground",
            formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
          }
        }}
        routing="path"
        path="/signup"
        signInUrl="/login"
        forceRedirectUrl="/"
      />

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to home
        </Link>
      </p>
    </div>
  )
}
