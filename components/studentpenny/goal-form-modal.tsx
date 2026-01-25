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
  Target,
  PiggyBank,
  Plane,
  ShoppingBag,
  GraduationCap,
  Loader2,
} from "lucide-react";

const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  target_amount: z.coerce.number().min(1, "Target amount must be at least $1"),
  current_amount: z.coerce.number().min(0, "Must be 0 or greater"),
  target_date: z.string().optional(),
  category: z.string(),
});

type GoalFormData = z.infer<typeof goalSchema>;

export interface Goal {
  id?: string;
  user_id?: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string | null;
  category: string;
  created_at?: string;
  updated_at?: string;
}

interface GoalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingGoal?: Goal | null;
  onGoalSaved: (goal: Goal) => void;
}

const goalCategories = [
  {
    value: "emergency_fund",
    label: "Emergency Fund",
    icon: PiggyBank,
    description: "Build your safety net",
  },
  {
    value: "trip",
    label: "Trip / Vacation",
    icon: Plane,
    description: "Save for travel",
  },
  {
    value: "purchase",
    label: "Big Purchase",
    icon: ShoppingBag,
    description: "Electronics, furniture, etc.",
  },
  {
    value: "education",
    label: "Education",
    icon: GraduationCap,
    description: "Tuition, courses, books",
  },
  {
    value: "general",
    label: "General",
    icon: Target,
    description: "Other savings goal",
  },
];

export function GoalFormModal({
  open,
  onOpenChange,
  existingGoal,
  onGoalSaved,
}: GoalFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("general");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      target_amount: 0,
      current_amount: 0,
      target_date: "",
      category: "general",
    },
  });

  // Reset form when modal opens with existing data
  useEffect(() => {
    if (open) {
      if (existingGoal) {
        reset({
          name: existingGoal.name,
          target_amount: existingGoal.target_amount,
          current_amount: existingGoal.current_amount,
          target_date: existingGoal.target_date || "",
          category: existingGoal.category,
        });
        setSelectedCategory(existingGoal.category);
      } else {
        reset({
          name: "",
          target_amount: 0,
          current_amount: 0,
          target_date: "",
          category: "general",
        });
        setSelectedCategory("general");
      }
    }
  }, [open, existingGoal, reset]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue("category", category);
  };

  const onSubmit = async (data: GoalFormData) => {
    setIsSubmitting(true);
    try {
      const isEditing = !!existingGoal?.id;
      const url = "/api/goals";
      const method = isEditing ? "PATCH" : "POST";
      
      const body = isEditing
        ? { id: existingGoal.id, ...data }
        : data;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save goal");
      }

      const { goal } = await response.json();
      toast.success(isEditing ? "Goal updated successfully!" : "Goal created successfully!");
      onGoalSaved(goal);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving goal:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save goal"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingGoal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription>
            Set a savings goal and we'll help you track your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {/* Goal Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Spring Break Trip"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {goalCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-colors ${
                        selectedCategory === cat.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${selectedCategory === cat.value ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-medium">{cat.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("category")} />
            </div>

            {/* Target Amount */}
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="target_amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="500.00"
                  className="pl-7"
                  {...register("target_amount")}
                />
              </div>
              {errors.target_amount && (
                <p className="text-xs text-destructive">
                  {errors.target_amount.message}
                </p>
              )}
            </div>

            {/* Current Amount */}
            <div className="space-y-2">
              <Label htmlFor="current_amount">Current Amount Saved</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="current_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  {...register("current_amount")}
                />
              </div>
              {errors.current_amount && (
                <p className="text-xs text-destructive">
                  {errors.current_amount.message}
                </p>
              )}
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date (Optional)</Label>
              <Input
                id="target_date"
                type="date"
                {...register("target_date")}
              />
              <p className="text-xs text-muted-foreground">
                We'll calculate how much you need to save each month.
              </p>
            </div>
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
              ) : existingGoal ? (
                "Update Goal"
              ) : (
                "Create Goal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
