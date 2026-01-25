import { Zap, Users, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Automated Workflows",
    description:
      "Build powerful automations without code. Connect your tools and let StreamLine handle the rest.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together in real-time with shared workspaces, comments, and instant notifications.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Gain insights into your team's productivity with detailed reports and custom dashboards.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, SOC 2 compliance, and granular access controls keep your data safe.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Features</p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to work smarter
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful features designed to help teams of all sizes move faster and accomplish more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-sm border border-border bg-background p-6 transition-all hover:border-muted-foreground/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
