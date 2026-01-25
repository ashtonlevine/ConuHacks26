import Link from "next/link";
import { Header } from "@/components/studentpenny/header";
import { Footer } from "@/components/studentpenny/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: January 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground">Introduction</h2>
                <p className="text-muted-foreground">
                  StudentPenny (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">Information We Collect</h2>
                <p className="text-muted-foreground">We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Account information (email, name) through our authentication provider</li>
                  <li>Budget and financial data you enter into the app</li>
                  <li>Goals and savings targets you set</li>
                  <li>Transaction records you manually enter</li>
                  <li>Messages sent to our AI assistant</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">How We Use Your Information</h2>
                <p className="text-muted-foreground">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Generate personalized financial insights and recommendations</li>
                  <li>Show you relevant student deals in your area</li>
                  <li>Respond to your questions and requests</li>
                  <li>Send you updates about our service (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your financial data is stored securely and encrypted at rest.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">Third-Party Services</h2>
                <p className="text-muted-foreground">
                  We use trusted third-party services to help operate our platform:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Clerk</strong> - Authentication and user management</li>
                  <li><strong>Supabase</strong> - Database and data storage</li>
                  <li><strong>Google Gemini</strong> - AI assistant functionality</li>
                  <li><strong>Vercel</strong> - Hosting and analytics</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to access, correct, or delete your personal data at any time. You can export your data or request account deletion by contacting us.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">Sponsored Content</h2>
                <p className="text-muted-foreground">
                  Our deals section includes sponsored content from local restaurants. These sponsors pay to be featured, but this does not affect how we handle your personal data. Sponsored deals are clearly labeled.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this privacy policy or our data practices, please contact us at privacy@studentpenny.com.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
