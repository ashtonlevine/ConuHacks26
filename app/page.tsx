import { Header } from "@/components/studentpenny/header";
import { Hero } from "@/components/studentpenny/hero";
import { Problem } from "@/components/studentpenny/problem";
import { Features } from "@/components/studentpenny/features";
import { HowItWorks } from "@/components/studentpenny/how-it-works";
import { AIExplanation } from "@/components/studentpenny/ai-explanation";
import { Trust } from "@/components/studentpenny/trust";
import { CTA } from "@/components/studentpenny/cta";
import { Footer } from "@/components/studentpenny/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <AIExplanation />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
