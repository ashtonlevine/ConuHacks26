import { Header } from "@/components/stusavvy/header";
import { Hero } from "@/components/stusavvy/hero";
import { Problem } from "@/components/stusavvy/problem";
import { Features } from "@/components/stusavvy/features";
import { HowItWorks } from "@/components/stusavvy/how-it-works";
import { AIExplanation } from "@/components/stusavvy/ai-explanation";
import { Trust } from "@/components/stusavvy/trust";
import { Deals } from "@/components/stusavvy/deals";
import { CTA } from "@/components/stusavvy/cta";
import { Footer } from "@/components/stusavvy/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <Deals />
        <HowItWorks />
        <AIExplanation />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
