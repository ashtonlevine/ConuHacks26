import Link from "next/link";
import { Header } from "@/components/studentpenny/header";
import { Footer } from "@/components/studentpenny/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from "lucide-react";

export default function ContactPage() {
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
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 mb-2">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    For general inquiries and support requests.
                  </p>
                  <a 
                    href="mailto:support@studentpenny.com"
                    className="text-primary hover:underline font-medium"
                  >
                    support@studentpenny.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 mb-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Help us improve by sharing your thoughts and suggestions.
                  </p>
                  <a 
                    href="mailto:feedback@studentpenny.com"
                    className="text-primary hover:underline font-medium"
                  >
                    feedback@studentpenny.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 mb-2">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check out our frequently asked questions for quick answers.
                  </p>
                  <span className="text-muted-foreground text-sm">Coming soon</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Business Inquiries */}
        <section className="border-t border-border bg-muted/20 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Business Partnerships</h2>
            <p className="text-muted-foreground mb-6">
              Are you a local restaurant interested in featuring your student deals on StudentPenny? 
              We&apos;d love to partner with you to help students discover great food at great prices.
            </p>
            <a 
              href="mailto:partners@studentpenny.com"
              className="text-primary hover:underline font-medium"
            >
              partners@studentpenny.com
            </a>
          </div>
        </section>

        {/* Response Time */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Response Time</h2>
            <p className="text-muted-foreground">
              We aim to respond to all inquiries within 24-48 hours during business days. 
              For urgent matters, please include &quot;URGENT&quot; in your email subject line.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
