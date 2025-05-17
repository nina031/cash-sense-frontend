// components/AddTransactionForm.js avec les corrections pour le calendrier

"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import categoriesData from "@/utils/categories.json";
import { useDemoModeStore } from "@/stores/useDemoModeStore";

// Schéma de validation Zod pour notre formulaire
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
  // État local
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Récupérer l'état du mode démo depuis le store
  const isDemoMode = useDemoModeStore((state) => state.isDemoMode);

  // Initialiser react-hook-form avec notre schéma de validation
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

  // Surveiller les changements de catégorie pour mettre à jour les sous-catégories disponibles
  const watchCategoryId = form.watch("categoryId");

  // Effet pour mettre à jour la catégorie sélectionnée
  useEffect(() => {
    if (watchCategoryId && watchCategoryId !== selectedCategory?.id) {
      const category = categoriesData[watchCategoryId];
      setSelectedCategory(category);

      // Réinitialiser la sous-catégorie si la catégorie change
      if (selectedCategory?.id && watchCategoryId !== selectedCategory.id) {
        form.setValue("subcategoryId", "");
      }
    }
  }, [watchCategoryId, selectedCategory, form]);

  // Créer un objet avec les sous-catégories disponibles
  const subcategories = selectedCategory?.subcategories || {};

  // Fonction pour soumettre le formulaire
  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);

      try {
        // Préparer les données de la transaction
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

        // Notifier le composant parent du succès
        if (onSuccess) onSuccess(transactionData);
      } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction:", error);
        form.setError("root.serverError", {
          type: "server",
          message:
            error.message ||
            "Erreur lors de l'ajout de la transaction. Veuillez réessayer.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId, onSuccess, form, isDemoMode]
  );

  // Gestionnaire d'annulation
  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
  }, [onCancel]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Type de transaction (Dépense/Revenu) */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Type de transaction</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <label
                      htmlFor="expense"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Dépense
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="income" />
                    <label
                      htmlFor="income"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Revenu
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Montant */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (€)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date - Avec la correction du calendrier */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white border-gray-300",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionnez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border-gray-300"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={fr}
                    className="rounded-md"
                    classNames={{
                      months:
                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn(
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                      ),
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1 border-white",
                      head_row: "flex",
                      head_cell:
                        "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle:
                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Courses Carrefour"
                  className="bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Catégorie */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {Object.entries(categoriesData).map(([id, category]) => (
                    <SelectItem key={id} value={id}>
                      {category.nameFr || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sous-catégorie (seulement si une catégorie est sélectionnée) */}
        {selectedCategory && (
          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sous-catégorie</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sélectionner une sous-catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {Object.entries(subcategories).map(([id, subcategory]) => (
                      <SelectItem key={id} value={id}>
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

        {/* Message d'erreur global */}
        {form.formState.errors.root?.serverError && (
          <div className="text-sm font-medium text-destructive">
            {form.formState.errors.root.serverError.message}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-white"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8367c7] hover:bg-[#7559b7]"
          >
            {isSubmitting ? "Enregistrement..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
