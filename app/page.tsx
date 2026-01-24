import { Header } from "@/components/smartpenny/header";
import { Hero } from "@/components/smartpenny/hero";
import { Problem } from "@/components/smartpenny/problem";
import { Features } from "@/components/smartpenny/features";
import { HowItWorks } from "@/components/smartpenny/how-it-works";
import { AIExplanation } from "@/components/smartpenny/ai-explanation";
import { Trust } from "@/components/smartpenny/trust";
import { Deals } from "@/components/smartpenny/deals";
import { CTA } from "@/components/smartpenny/cta";
import { Footer } from "@/components/smartpenny/footer";

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
