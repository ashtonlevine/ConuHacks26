import { AlertCircle, TrendingDown, Calendar } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    text: "Tuition and books create cash cliffs",
  },
  {
    icon: AlertCircle,
    text: "Part-time income fluctuates unpredictably",
  },
  {
    icon: Calendar,
    text: "Generic budgeting apps don't understand semesters",
  },
];

export function Problem() {
  return (
    <section className="border-y border-border bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Student Finances Aren't Monthly. They're Seasonal.
          </h2>

          <ul className="mt-10 flex flex-col gap-4 text-left sm:mx-auto sm:max-w-xl">
            {problems.map((problem) => (
              <li
                key={problem.text}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <problem.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="pt-2 text-base font-medium text-foreground">
                  {problem.text}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Traditional budgeting apps assume steady monthly income and expenses. But student life doesn't work that way. You need a financial tool that understands the rhythm of academic terms, fluctuating work hours, and the reality of paying tuition in chunks.
          </p>
        </div>
      </div>
    </section>
  );
}
