"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Utensils,
  Fuel,
  ShoppingCart,
  Gamepad2,
  GraduationCap,
  Loader2,
} from "lucide-react";

const budgetSchema = z.object({
  restaurant_expenses: z.coerce.number().min(0, "Must be 0 or greater"),
  gas: z.coerce.number().min(0, "Must be 0 or greater"),
  grocery_shopping: z.coerce.number().min(0, "Must be 0 or greater"),
  leisure: z.coerce.number().min(0, "Must be 0 or greater"),
  school_fees: z.coerce.number().min(0, "Must be 0 or greater"),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export interface Budget {
  id?: string;
  user_id?: string;
  restaurant_expenses: number;
  gas: number;
  grocery_shopping: number;
  leisure: number;
  school_fees: number;
  created_at?: string;
  updated_at?: string;
}

interface BudgetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingBudget: Budget | null;
  onBudgetSaved: (budget: Budget) => void;
}

const budgetCategories = [
  {
    name: "restaurant_expenses" as const,
    label: "Restaurant Expenses",
    description: "Dining out, takeout, delivery",
    icon: Utensils,
  },
  {
    name: "gas" as const,
    label: "Gas",
    description: "Fuel for your vehicle",
    icon: Fuel,
  },
  {
    name: "grocery_shopping" as const,
    label: "Grocery Shopping",
    description: "Food and household items",
    icon: ShoppingCart,
  },
  {
    name: "leisure" as const,
    label: "Leisure & Entertainment",
    description: "Movies, games, hobbies, subscriptions",
    icon: Gamepad2,
  },
  {
    name: "school_fees" as const,
    label: "School Fees",
    description: "Tuition, books, supplies, course materials",
    icon: GraduationCap,
  },
];

export function BudgetFormModal({
  open,
  onOpenChange,
  existingBudget,
  onBudgetSaved,
}: BudgetFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      restaurant_expenses: 0,
      gas: 0,
      grocery_shopping: 0,
      leisure: 0,
      school_fees: 0,
    },
  });

  // Reset form when modal opens with existing data
  useEffect(() => {
    if (open) {
      reset({
        restaurant_expenses: existingBudget?.restaurant_expenses || 0,
        gas: existingBudget?.gas || 0,
        grocery_shopping: existingBudget?.grocery_shopping || 0,
        leisure: existingBudget?.leisure || 0,
        school_fees: existingBudget?.school_fees || 0,
      });
    }
  }, [open, existingBudget, reset]);

  const onSubmit = async (data: BudgetFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save budget");
      }

      const { budget } = await response.json();
      toast.success("Budget saved successfully!");
      onBudgetSaved(budget);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save budget"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalBudget = budgetCategories.reduce((sum, category) => {
    const value = existingBudget?.[category.name] || 0;
    return sum + value;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingBudget ? "Edit Your Budget" : "Set Up Your Budget"}
          </DialogTitle>
          <DialogDescription>
            Enter your monthly budget allocation for each category. This helps
            track your spending and reach your financial goals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {budgetCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="space-y-2">
                  <Label
                    htmlFor={category.name}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {category.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id={category.name}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-7"
                      {...register(category.name)}
                    />
                  </div>
                  {errors[category.name] && (
                    <p className="text-xs text-destructive">
                      {errors[category.name]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : existingBudget ? (
                "Update Budget"
              ) : (
                "Save Budget"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
