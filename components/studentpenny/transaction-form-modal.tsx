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
  TrendingUp,
  TrendingDown,
  Utensils,
  Fuel,
  ShoppingCart,
  Gamepad2,
  GraduationCap,
  Briefcase,
  Gift,
  Home,
  Loader2,
  DollarSign,
} from "lucide-react";

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be at least $0.01"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  merchant_name: z.string().optional(),
  transaction_date: z.string().min(1, "Date is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export interface Transaction {
  id?: string;
  user_id?: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  merchant_name?: string;
  transaction_date: string;
  created_at?: string;
  updated_at?: string;
}

interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingTransaction?: Transaction | null;
  onTransactionSaved: (transaction: Transaction) => void;
}

const expenseCategories = [
  { value: "restaurant_expenses", label: "Restaurants", icon: Utensils },
  { value: "gas", label: "Gas", icon: Fuel },
  { value: "grocery_shopping", label: "Groceries", icon: ShoppingCart },
  { value: "leisure", label: "Leisure", icon: Gamepad2 },
  { value: "school_fees", label: "School", icon: GraduationCap },
  { value: "rent", label: "Rent", icon: Home },
  { value: "other", label: "Other", icon: DollarSign },
];

const incomeCategories = [
  { value: "salary", label: "Salary/Wages", icon: Briefcase },
  { value: "allowance", label: "Allowance", icon: Gift },
  { value: "scholarship", label: "Scholarship", icon: GraduationCap },
  { value: "freelance", label: "Freelance", icon: Briefcase },
  { value: "other", label: "Other", icon: DollarSign },
];

export function TransactionFormModal({
  open,
  onOpenChange,
  existingTransaction,
  onTransactionSaved,
}: TransactionFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<"income" | "expense">("expense");
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: "expense",
      category: "",
      description: "",
      merchant_name: "",
      transaction_date: new Date().toISOString().split("T")[0],
    },
  });

  const watchType = watch("type");

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (existingTransaction) {
        reset({
          amount: existingTransaction.amount,
          type: existingTransaction.type,
          category: existingTransaction.category,
          description: existingTransaction.description || "",
          merchant_name: existingTransaction.merchant_name || "",
          transaction_date: existingTransaction.transaction_date,
        });
        setSelectedType(existingTransaction.type);
        setSelectedCategory(existingTransaction.category);
      } else {
        reset({
          amount: 0,
          type: "expense",
          category: "",
          description: "",
          merchant_name: "",
          transaction_date: new Date().toISOString().split("T")[0],
        });
        setSelectedType("expense");
        setSelectedCategory("");
      }
    }
  }, [open, existingTransaction, reset]);

  const handleTypeSelect = (type: "income" | "expense") => {
    setSelectedType(type);
    setValue("type", type);
    setSelectedCategory("");
    setValue("category", "");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setValue("category", category);
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      const isEditing = !!existingTransaction?.id;
      const url = "/api/transactions";
      const method = isEditing ? "PATCH" : "POST";
      
      const body = isEditing
        ? { id: existingTransaction.id, ...data }
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
        throw new Error(errorData.error || "Failed to save transaction");
      }

      const { transaction } = await response.json();
      toast.success(isEditing ? "Transaction updated!" : "Transaction added!");
      onTransactionSaved(transaction);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save transaction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = watchType === "income" ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingTransaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            Record your income or expenses to track your finances.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeSelect("expense")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition-colors ${
                    selectedType === "expense"
                      ? "border-destructive bg-destructive/10"
                      : "border-border hover:border-destructive/50"
                  }`}
                >
                  <TrendingDown className={`h-4 w-4 ${selectedType === "expense" ? "text-destructive" : "text-muted-foreground"}`} />
                  <span className="font-medium">Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeSelect("income")}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 transition-colors ${
                    selectedType === "income"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <TrendingUp className={`h-4 w-4 ${selectedType === "income" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-medium">Income</span>
                </button>
              </div>
              <input type="hidden" {...register("type")} />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  {...register("amount")}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors ${
                        selectedCategory === cat.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${selectedCategory === cat.value ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
              <input type="hidden" {...register("category")} />
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Date</Label>
              <Input
                id="transaction_date"
                type="date"
                {...register("transaction_date")}
              />
              {errors.transaction_date && (
                <p className="text-xs text-destructive">{errors.transaction_date.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="e.g., Lunch with friends"
                {...register("description")}
              />
            </div>

            {/* Merchant */}
            {selectedType === "expense" && (
              <div className="space-y-2">
                <Label htmlFor="merchant_name">Merchant (Optional)</Label>
                <Input
                  id="merchant_name"
                  placeholder="e.g., Starbucks"
                  {...register("merchant_name")}
                />
              </div>
            )}
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
              ) : existingTransaction ? (
                "Update"
              ) : (
                "Add Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
