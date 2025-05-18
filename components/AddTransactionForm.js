// components/AddTransactionForm.js
"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/DatePicker";

import categoriesData from "@/utils/categories.json";
import { useDemoModeStore } from "@/stores/useDemoModeStore";

// Schema validation for our form
const formSchema = z.object({
  type: z.enum(["expense", "income"], {
    required_error: "Veuillez sélectionner un type de transaction",
  }),
  amount: z.coerce
    .number({
      required_error: "Veuillez entrer un montant",
      invalid_type_error: "Le montant doit être un nombre",
    })
    .positive("Le montant doit être positif"),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  description: z.string().min(2, {
    message: "La description doit contenir au moins 2 caractères",
  }),
  categoryId: z.string({
    required_error: "Veuillez sélectionner une catégorie",
  }),
  subcategoryId: z.string().optional(),
});

export default function AddTransactionForm({ userId, onSuccess, onCancel }) {
  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Get demo mode state from store
  const isDemoMode = useDemoModeStore((state) => state.isDemoMode);

  // Initialize react-hook-form with our validation schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      date: new Date(),
      description: "",
      categoryId: "",
      subcategoryId: "",
    },
  });

  // Watch for category changes to update available subcategories
  const watchCategoryId = form.watch("categoryId");
  const watchType = form.watch("type");

  // Effect to update selected category
  useEffect(() => {
    if (watchCategoryId && watchCategoryId !== selectedCategory?.id) {
      const category = categoriesData[watchCategoryId];
      setSelectedCategory(category);

      // Reset subcategory if category changes
      if (selectedCategory?.id && watchCategoryId !== selectedCategory.id) {
        form.setValue("subcategoryId", "");
      }
    }
  }, [watchCategoryId, selectedCategory, form]);

  // Create an object with available subcategories
  const subcategories = selectedCategory?.subcategories || {};

  // Function to submit the form
  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);

      try {
        // Prepare transaction data
        const transactionData = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          amount: data.type === "expense" ? data.amount : -data.amount,
          date: format(data.date, "yyyy-MM-dd"),
          merchant_name: data.description,
          payment_channel: "manual",
          pending: false,
          category: {
            id: data.categoryId,
            subcategory: {
              id: data.subcategoryId || "unknown",
            },
          },
          is_manual: true,
          is_test_data: isDemoMode,
        };

        // Notify parent component of success
        if (onSuccess) onSuccess(transactionData);
      } catch (error) {
        console.error("Error adding transaction:", error);
        form.setError("root.serverError", {
          type: "server",
          message:
            error.message || "Error adding transaction. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId, onSuccess, form, isDemoMode]
  );

  // Cancel handler
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
  }, [onCancel]);

  // Get category color for visual feedback
  const getCategoryColor = (categoryId) => {
    if (!categoryId) return undefined;
    const category = categoriesData[categoryId];
    return category?.color;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type (Expense/Income) with improved styling */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-gray-700 font-medium">
                Type de transaction
              </FormLabel>
              <FormControl>
                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    className={cn(
                      "w-1/2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                      field.value === "expense"
                        ? "bg-[#FF6B6B]/10 border-2 border-[#FF6B6B] text-[#FF6B6B]"
                        : "bg-gray-50 border-2 border-gray-100 text-gray-500 hover:bg-gray-100"
                    )}
                    onClick={() => field.onChange("expense")}
                  >
                    {field.value === "expense" && <Check size={16} />}
                    Dépense
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "w-1/2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                      field.value === "income"
                        ? "bg-[#21D07F]/10 border-2 border-[#21D07F] text-[#21D07F]"
                        : "bg-gray-50 border-2 border-gray-100 text-gray-500 hover:bg-gray-100"
                    )}
                    onClick={() => field.onChange("income")}
                  >
                    {field.value === "income" && <Check size={16} />}
                    Revenu
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount with improved styling */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Montant (€)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className={cn(
                      "bg-white py-2.5 pl-3 pr-10 border-2 focus:border-[var(--primary)] rounded-lg shadow-sm",
                      watchType === "expense"
                        ? "focus:border-[#FF6B6B] focus:ring-[#FF6B6B]/20"
                        : "focus:border-[#21D07F] focus:ring-[#21D07F]/20"
                    )}
                    {...field}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    €
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date field with our new DatePicker component */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-700 font-medium">Date</FormLabel>
              <DatePicker value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description with improved styling */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Description
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Courses Carrefour"
                  className="bg-white py-2.5 border-2 border-gray-200 hover:border-gray-300 focus:border-[var(--primary)] rounded-lg shadow-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category with improved styling */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Catégorie
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="bg-white py-2.5 border-2 border-gray-200 hover:border-gray-300 focus:border-[var(--primary)] rounded-lg shadow-sm"
                    style={
                      field.value
                        ? { borderColor: getCategoryColor(field.value) }
                        : {}
                    }
                  >
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg max-h-60">
                  {Object.entries(categoriesData).map(([id, category]) => (
                    <SelectItem
                      key={id}
                      value={id}
                      className="py-2.5 px-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.nameFr || category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subcategory (only if a category is selected) with improved styling */}
        {selectedCategory && (
          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Sous-catégorie
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className="bg-white py-2.5 border-2 border-gray-200 hover:border-gray-300 focus:border-[var(--primary)] rounded-lg shadow-sm"
                      style={{ borderColor: selectedCategory.color }}
                    >
                      <SelectValue placeholder="Sélectionner une sous-catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg max-h-60">
                    {Object.entries(subcategories).map(([id, subcategory]) => (
                      <SelectItem
                        key={id}
                        value={id}
                        className="py-2.5 px-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-100"
                      >
                        {subcategory.nameFr || subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Global error message */}
        {form.formState.errors.root?.serverError && (
          <div className="text-sm font-medium  bg-red-50 p-3 rounded-lg border border-red-200">
            {form.formState.errors.root.serverError.message}
          </div>
        )}

        {/* Action buttons with improved styling */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium py-2.5 px-5 rounded-lg"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8367c7] hover:bg-[#7559b7] text-white font-medium py-2.5 px-6 rounded-lg shadow-sm"
          >
            {isSubmitting ? "Enregistrement..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
