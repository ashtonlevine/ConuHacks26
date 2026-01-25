"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { differenceInCalendarDays, parseISO, format, isValid } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  DollarSign,
  Calendar,
  Calculator,
  Building2,
  Mail,
  FileText,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { SPONSOR_DAILY_RATE_CENTS } from "@/lib/constants";

// Get today's date in YYYY-MM-DD format for min attribute
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const sponsorshipSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    const start = parseISO(data.startDate);
    const end = parseISO(data.endDate);
    return isValid(start) && isValid(end) && end >= start;
  },
  {
    message: "End date must be on or after start date",
    path: ["endDate"],
  }
);

type SponsorshipFormData = z.infer<typeof sponsorshipSchema>;

interface SubmissionResult {
  requestId: string;
  days: number;
  dailyRateCents: number;
  totalCents: number;
}

export default function SponsorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SponsorshipFormData>({
    resolver: zodResolver(sponsorshipSchema),
    defaultValues: {
      businessName: "",
      contactEmail: "",
      startDate: "",
      endDate: "",
      notes: "",
    },
  });

  // Watch dates for live calculation
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Calculate days and total live
  const calculation = useMemo(() => {
    if (!startDate || !endDate) {
      return { days: 0, totalCents: 0, isValid: false };
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end) || end < start) {
      return { days: 0, totalCents: 0, isValid: false };
    }

    const days = differenceInCalendarDays(end, start) + 1;
    const totalCents = days * SPONSOR_DAILY_RATE_CENTS;

    return { days, totalCents, isValid: true };
  }, [startDate, endDate]);

  const dailyRateDollars = (SPONSOR_DAILY_RATE_CENTS / 100).toFixed(2);
  const totalDollars = (calculation.totalCents / 100).toFixed(2);

  const onSubmit = async (data: SponsorshipFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/sponsorships/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit request");
      }

      const result = await response.json();
      setSubmissionResult(result);
      toast.success("Sponsorship request submitted successfully!");
    } catch (error) {
      console.error("Error submitting sponsorship request:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    setSubmissionResult(null);
    reset();
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!startDate || !endDate) return null;
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (!isValid(start) || !isValid(end)) return null;
    
    return `${format(start, "MMM d, yyyy")} — ${format(end, "MMM d, yyyy")}`;
  };

  // Success state
  if (submissionResult) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="border-primary/20 bg-card">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Request Submitted!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your interest in sponsoring SmartPennies. We'll review your request and get back to you soon.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-foreground mb-3">Request Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Request ID</dt>
                    <dd className="font-mono text-foreground">{submissionResult.requestId.slice(0, 8)}...</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="text-foreground">{submissionResult.days} day{submissionResult.days !== 1 ? "s" : ""}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Daily Rate</dt>
                    <dd className="text-foreground">${(submissionResult.dailyRateCents / 100).toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2">
                    <dt className="font-semibold text-foreground">Total</dt>
                    <dd className="font-bold text-primary">${(submissionResult.totalCents / 100).toFixed(2)}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleNewRequest}>
                  Submit Another Request
                </Button>
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Become a Sponsor
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Reach thousands of budget-conscious students with your deals.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Simple, Transparent Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">${dailyRateDollars}</span>
                  <span className="text-muted-foreground">per day</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pricing scales linearly with the number of days booked. No hidden fees.
                </p>
              </CardContent>
            </Card>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., Campus Grill"
                      {...register("businessName")}
                    />
                    {errors.businessName && (
                      <p className="text-xs text-destructive">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="owner@restaurant.com"
                        className="pl-10"
                        {...register("contactEmail")}
                      />
                    </div>
                    {errors.contactEmail && (
                      <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Date Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Sponsorship Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        min={getTodayString()}
                        {...register("startDate")}
                      />
                      {errors.startDate && (
                        <p className="text-xs text-destructive">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        min={startDate || getTodayString()}
                        {...register("endDate")}
                      />
                      {errors.endDate && (
                        <p className="text-xs text-destructive">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Both start and end dates are included in the sponsorship period.
                  </p>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Additional Notes (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    id="notes"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about your business, the deal you'd like to promote, or any questions..."
                    {...register("notes")}
                  />
                </CardContent>
              </Card>

              {/* Submit Button (mobile) */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !calculation.isValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request Sponsorship
                      {calculation.isValid && (
                        <span className="ml-2 opacity-80">· ${totalDollars}</span>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column - Live Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    Cost Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calculation.isValid ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Selected period</span>
                          <span className="text-foreground font-medium">{formatDateRange()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Number of days</span>
                          <span className="text-foreground font-medium">
                            {calculation.days} day{calculation.days !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Daily rate</span>
                          <span className="text-foreground font-medium">${dailyRateDollars}</span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-foreground">Total</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">${totalDollars}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {calculation.days} × ${dailyRateDollars}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <DollarSign className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select your sponsorship dates to see the total cost.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Desktop Submit Button */}
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !calculation.isValid}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Request Sponsorship"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  We'll review your request and contact you within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
