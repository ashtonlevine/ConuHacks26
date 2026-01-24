"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/studentpenny/dashboard-header";
import { Footer } from "@/components/studentpenny/footer";
import { AIChatSidebar } from "@/components/studentpenny/ai-chat-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Star, ArrowLeft, Search } from "lucide-react";

const deals = [
  { name: "Campus Grill", deal: "$5 Student Lunch Special", category: "American", distance: "0.2 mi", hours: "11am-3pm", sponsored: true, rating: 4.5 },
  { name: "Pho House", deal: "15% off with student ID", category: "Vietnamese", distance: "0.3 mi", hours: "10am-9pm", sponsored: false, rating: 4.7 },
  { name: "Pizza Palace", deal: "$8 Large Pizza Mondays", category: "Italian", distance: "0.1 mi", hours: "11am-11pm", sponsored: true, rating: 4.2 },
  { name: "Burrito Bros", deal: "Free chips with any burrito", category: "Mexican", distance: "0.4 mi", hours: "10am-10pm", sponsored: false, rating: 4.4 },
  { name: "Sushi Station", deal: "$12 All-You-Can-Eat Tuesdays", category: "Japanese", distance: "0.5 mi", hours: "11:30am-9pm", sponsored: true, rating: 4.6 },
  { name: "The Daily Grind", deal: "$2 Coffee before 9am", category: "Cafe", distance: "0.1 mi", hours: "6am-8pm", sponsored: false, rating: 4.8 },
  { name: "Wok & Roll", deal: "10% student discount", category: "Chinese", distance: "0.3 mi", hours: "11am-10pm", sponsored: false, rating: 4.3 },
  { name: "Falafel King", deal: "$6 Falafel Wrap Combo", category: "Mediterranean", distance: "0.2 mi", hours: "11am-9pm", sponsored: true, rating: 4.5 },
  { name: "Bagel Barn", deal: "BOGO Bagels Thursdays", category: "Bakery", distance: "0.2 mi", hours: "7am-4pm", sponsored: false, rating: 4.6 },
  { name: "Thai Orchid", deal: "$9 Pad Thai Lunch", category: "Thai", distance: "0.4 mi", hours: "11am-9:30pm", sponsored: false, rating: 4.7 },
  { name: "Smoothie Central", deal: "$4 Smoothies all day", category: "Juice Bar", distance: "0.1 mi", hours: "8am-7pm", sponsored: true, rating: 4.4 },
  { name: "Burger Barn", deal: "$6 Classic Burger + Fries", category: "American", distance: "0.3 mi", hours: "11am-10pm", sponsored: false, rating: 4.3 },
  { name: "Noodle House", deal: "Free spring roll with entree", category: "Asian Fusion", distance: "0.5 mi", hours: "11am-9pm", sponsored: false, rating: 4.5 },
  { name: "Green Leaf Cafe", deal: "$7 Salad Bar", category: "Healthy", distance: "0.2 mi", hours: "10am-8pm", sponsored: true, rating: 4.6 },
  { name: "Taco Town", deal: "$1.50 Tacos Tuesdays", category: "Mexican", distance: "0.4 mi", hours: "10am-11pm", sponsored: false, rating: 4.4 },
  { name: "Curry Corner", deal: "$8 Curry Bowl Special", category: "Indian", distance: "0.6 mi", hours: "11am-9pm", sponsored: false, rating: 4.7 },
  { name: "Sub Shop", deal: "6-inch sub for $5", category: "Sandwiches", distance: "0.2 mi", hours: "10am-9pm", sponsored: true, rating: 4.2 },
  { name: "Bubble Tea Bliss", deal: "BOGO Boba Fridays", category: "Drinks", distance: "0.3 mi", hours: "11am-10pm", sponsored: false, rating: 4.8 },
  { name: "Greek Gyros", deal: "$7 Gyro Plate", category: "Greek", distance: "0.4 mi", hours: "11am-9pm", sponsored: false, rating: 4.5 },
  { name: "Wing World", deal: "50 cent wings Wednesdays", category: "American", distance: "0.5 mi", hours: "11am-12am", sponsored: true, rating: 4.3 },
  { name: "Poke Paradise", deal: "$10 Build Your Own Bowl", category: "Hawaiian", distance: "0.3 mi", hours: "11am-8pm", sponsored: false, rating: 4.6 },
  { name: "Crepe Cafe", deal: "$6 Sweet or Savory Crepe", category: "French", distance: "0.2 mi", hours: "8am-6pm", sponsored: false, rating: 4.7 },
  { name: "Dumpling Den", deal: "8 Dumplings for $5", category: "Chinese", distance: "0.4 mi", hours: "11am-9pm", sponsored: true, rating: 4.4 },
  { name: "Acai Bowl Bar", deal: "$8 Acai Bowl", category: "Healthy", distance: "0.1 mi", hours: "8am-7pm", sponsored: false, rating: 4.5 },
  { name: "Ramen Republic", deal: "$10 Ramen + Drink", category: "Japanese", distance: "0.5 mi", hours: "11am-10pm", sponsored: false, rating: 4.8 },
  { name: "Breakfast Bistro", deal: "$5 Breakfast Plate before 10am", category: "American", distance: "0.3 mi", hours: "6am-2pm", sponsored: true, rating: 4.4 },
  { name: "Shawarma Shack", deal: "$7 Shawarma Wrap", category: "Middle Eastern", distance: "0.4 mi", hours: "11am-10pm", sponsored: false, rating: 4.6 },
  { name: "Ice Cream Island", deal: "$3 Single Scoop", category: "Dessert", distance: "0.2 mi", hours: "12pm-10pm", sponsored: false, rating: 4.7 },
  { name: "Waffle Works", deal: "$4 Belgian Waffle", category: "Breakfast", distance: "0.3 mi", hours: "7am-3pm", sponsored: true, rating: 4.5 },
  { name: "Pasta Point", deal: "$8 Pasta Bowl", category: "Italian", distance: "0.5 mi", hours: "11am-9pm", sponsored: false, rating: 4.4 },
  { name: "Kebab Kitchen", deal: "10% off all kebabs", category: "Turkish", distance: "0.6 mi", hours: "11am-10pm", sponsored: false, rating: 4.5 },
  { name: "Juice Junction", deal: "$5 Fresh Pressed Juice", category: "Juice Bar", distance: "0.2 mi", hours: "7am-8pm", sponsored: true, rating: 4.6 },
  { name: "Donut Dynasty", deal: "$1 Donuts before 9am", category: "Bakery", distance: "0.1 mi", hours: "5am-6pm", sponsored: false, rating: 4.8 },
  { name: "Salad Studio", deal: "$7 Custom Salad", category: "Healthy", distance: "0.3 mi", hours: "10am-8pm", sponsored: false, rating: 4.4 },
  { name: "Empanada Express", deal: "3 Empanadas for $6", category: "Latin", distance: "0.4 mi", hours: "10am-9pm", sponsored: true, rating: 4.5 },
  { name: "BBQ Pit", deal: "$9 BBQ Plate Thursdays", category: "BBQ", distance: "0.5 mi", hours: "11am-9pm", sponsored: false, rating: 4.7 },
  { name: "Pretzel Palace", deal: "$3 Soft Pretzel + Dip", category: "Snacks", distance: "0.2 mi", hours: "10am-8pm", sponsored: false, rating: 4.3 },
  { name: "Soup Station", deal: "$5 Soup + Bread", category: "American", distance: "0.3 mi", hours: "11am-7pm", sponsored: true, rating: 4.4 },
  { name: "Fry Factory", deal: "Free upgrade to large fries", category: "Fast Food", distance: "0.1 mi", hours: "10am-11pm", sponsored: false, rating: 4.2 },
  { name: "Pancake Palace", deal: "$6 Unlimited Pancakes", category: "Breakfast", distance: "0.4 mi", hours: "7am-2pm", sponsored: false, rating: 4.6 },
  { name: "Mochi Madness", deal: "3 Mochi for $4", category: "Dessert", distance: "0.3 mi", hours: "12pm-9pm", sponsored: true, rating: 4.7 },
  { name: "Wrap It Up", deal: "$6 Chicken Wrap", category: "Sandwiches", distance: "0.2 mi", hours: "10am-8pm", sponsored: false, rating: 4.4 },
  { name: "Banh Mi Brothers", deal: "$5 Banh Mi Sandwich", category: "Vietnamese", distance: "0.5 mi", hours: "10am-8pm", sponsored: false, rating: 4.8 },
  { name: "Cookie Corner", deal: "4 Cookies for $5", category: "Bakery", distance: "0.1 mi", hours: "9am-9pm", sponsored: true, rating: 4.5 },
  { name: "Grain Bowl Guru", deal: "$9 Grain Bowl", category: "Healthy", distance: "0.4 mi", hours: "11am-8pm", sponsored: false, rating: 4.6 },
  { name: "Hot Dog Haven", deal: "$3 Hot Dog + Drink", category: "American", distance: "0.2 mi", hours: "11am-8pm", sponsored: false, rating: 4.2 },
  { name: "Macaroni Manor", deal: "$7 Mac & Cheese Bowl", category: "Comfort Food", distance: "0.3 mi", hours: "11am-9pm", sponsored: true, rating: 4.5 },
  { name: "Churro Chalet", deal: "2 Churros for $4", category: "Dessert", distance: "0.4 mi", hours: "10am-10pm", sponsored: false, rating: 4.7 },
  { name: "Sandwich Spot", deal: "Half sandwich + soup $7", category: "Sandwiches", distance: "0.2 mi", hours: "10am-7pm", sponsored: false, rating: 4.4 },
  { name: "Korean Kitchen", deal: "$9 Bibimbap Bowl", category: "Korean", distance: "0.5 mi", hours: "11am-9pm", sponsored: true, rating: 4.6 },
];

// Get unique categories for filter
const categories = ["All", ...Array.from(new Set(deals.map((d) => d.category))).sort()];

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.deal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Student Deals
            </h1>
            <p className="mt-1 text-muted-foreground">
              Budget-friendly deals from local restaurants near campus. Save money while eating well.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="border-b border-border py-4">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search deals, restaurants, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {filteredDeals.length} of {deals.length} deals
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDeals.map((deal, index) => (
                <Card
                  key={`${deal.name}-${index}`}
                  className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold text-foreground">
                        {deal.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        {deal.sponsored && (
                          <Badge variant="secondary" className="text-xs">
                            Sponsored
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span>{deal.rating}</span>
                      <span className="mx-1">·</span>
                      <span>{deal.category}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-3 text-sm font-medium text-primary">
                      {deal.deal}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {deal.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {deal.hours}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  No deals found matching your search.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <AIChatSidebar />
    </div>
  );
}
