import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "StreamLine has completely transformed how our team operates. We've cut our manual work in half and can focus on what actually matters.",
    author: "Sarah Chen",
    role: "Head of Operations",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote:
      "The automation features are incredible. What used to take hours now happens automatically. I can't imagine going back to our old workflow.",
    author: "Marcus Johnson",
    role: "Product Manager",
    company: "Innovate Labs",
    rating: 5,
  },
  {
    quote:
      "Best investment we've made this year. The ROI was apparent within the first month. Our team is more productive and happier.",
    author: "Emily Rodriguez",
    role: "CEO",
    company: "GrowthStack",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Testimonials</p>
          <h2 className="mt-3 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Loved by teams worldwide
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See what our customers have to say about transforming their workflows with StreamLine.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="flex flex-col rounded-sm border border-border bg-card p-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-foreground">
                {`"${testimonial.quote}"`}
              </blockquote>
              <div className="mt-6 border-t border-border pt-4">
                <div className="font-semibold text-foreground">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
