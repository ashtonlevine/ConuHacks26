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
          variables: {
            colorPrimary: '#0d9488',
            colorText: 'var(--foreground)',
            colorTextSecondary: 'var(--muted-foreground)',
            colorBackground: 'var(--card)',
            colorInputBackground: 'var(--muted)',
            colorInputText: 'var(--foreground)',
            borderRadius: '0.125rem',
          },
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "bg-card border border-border shadow-xl rounded-sm",
            headerTitle: "text-foreground font-semibold",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "bg-muted hover:bg-muted/80 border border-border text-foreground transition-colors",
            socialButtonsBlockButtonText: "text-foreground font-medium",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            formFieldLabel: "text-foreground font-medium",
            formFieldInput: "bg-muted/50 border border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-colors",
            formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
            footerAction: "text-muted-foreground",
            footerActionLink: "text-primary hover:text-primary/80 font-medium",
            identifierPreviewText: "text-foreground",
            identifierPreviewEditButton: "text-primary hover:text-primary/80",
            formFieldSuccessText: "text-primary",
            formFieldErrorText: "text-destructive",
            alert: "bg-destructive/10 border border-destructive/20 text-destructive",
            alertText: "text-destructive",
            logoBox: "justify-center",
            footer: "bg-transparent",
            main: "gap-6",
          }
        }}
        routing="path"
        path="/signup"
        signInUrl="/login"
        afterSignUpUrl="/dashboard"
      />

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </p>
    </div>
  )
}
