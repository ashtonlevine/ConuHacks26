"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, LayoutDashboard, Wallet, MapPin, ChartArea, Target} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard#budget", label: "Budget", icon: Wallet },
  { href: "/dashboard#analytics", label: "Analytics", icon: ChartArea },
  { href: "/dashboard#goals", label: "Goals", icon: Target },
  { href: "/transactions", label: "Transactions", icon: ChartArea },
  { href: "/dashboard/deals", label: "Deals", icon: MapPin },
];

export function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
        <Image
          src="/smartpennies.png"
          alt="StudentPenny"
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
        />
          <span className="text-xl font-semibold text-foreground">StudentPenny</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            // Only highlight the main Dashboard link; hash-based section links stay unhighlighted
            const isActive = pathname === "/dashboard" && item.href === "/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
              <div className="flex items-center gap-2 px-3 py-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">Account</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
