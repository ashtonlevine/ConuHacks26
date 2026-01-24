import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { name: "About", href: "#" },
  { name: "Privacy", href: "#" },
  { name: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/SmartPennies.png"
              alt="SmartPenny"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <span className="text-lg font-semibold text-foreground">
              StuSavvy
            </span>
          </div>

          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            StuSavvy provides educational financial guidance only. Not a licensed financial advisor.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StuSavvy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
