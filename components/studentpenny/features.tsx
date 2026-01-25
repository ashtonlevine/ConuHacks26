import { Calendar, Lightbulb, PiggyBank, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Semester-Aware Budgeting",
    description:
      "Budgets that understand tuition dates, rent cycles, and academic terms.",
  },
  {
    icon: Lightbulb,
    title: "Smart Cost-Cutting Insights",
    description:
      "Personalized suggestions based on real student spending patterns.",
  },
  {
    icon: PiggyBank,
    title: "Emergency Fund Builder",
    description:
      "Micro-saving plans that fit student budgets without sacrificing lifestyle.",
  },
  {
    icon: MapPin,
    title: "Nearby Student Deals",
    description:
      "Budget-friendly local food deals, some sponsored and clearly labeled.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for How Students Actually Manage Money
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Every feature is designed with the unique financial challenges of student life in mind.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
