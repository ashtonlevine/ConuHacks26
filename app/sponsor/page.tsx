import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/studentpenny/footer";
import { Header } from "@/components/studentpenny/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SponsorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <Card className="w-full max-w-lg border-border">
          <CardContent className="pt-8 pb-8">
            <h1 className="text-2xl font-bold mb-2 text-center text-foreground">Become a Sponsor</h1>
            <p className="mb-6 text-center text-muted-foreground">
              Interested in supporting StudentPenny? Fill out the form below and our team will get in touch with you!
            </p>
            <form className="space-y-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" required placeholder="Your Name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@email.com" />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input id="company" name="company" type="text" placeholder="Your Company" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Input id="message" name="message" type="text" placeholder="Tell us how you'd like to sponsor..." />
              </div>
              <Button type="submit" className="w-full mt-2">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
