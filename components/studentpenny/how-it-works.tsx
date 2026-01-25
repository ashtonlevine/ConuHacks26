const steps = [
  {
    number: "01",
    title: "Enter your details",
    description:
      "Enter your transactions, budget and saving goals StudentPenny will cover the rest.",
  },
  {
    number: "02",
    title: "Get tailored analytics ",
    description:
      "Using your data, StudentPenny provides personalized insights and recommendations to help you manage your finances effectively.",
  },
  {
    number: "03",
    title: "Ask anything",
    description:
      'With our AI-powered assistant, get specific help in real time by using one of our prompted questions or asking one of your own.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border bg-muted/30 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Get started in minutes, not hours. No financial expertise required.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-y-1/2 bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-sm border-2 border-primary bg-background text-2xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-base text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
