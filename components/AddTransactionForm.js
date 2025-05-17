// components/AddTransactionForm.js
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
import { addTransaction } from "@/services/transactionService";
import { useDemoMode } from "@/contexts/DemoContext";

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

  // Récupérer l'état du mode démo depuis le contexte
  const { isDemoMode } = useDemoMode();

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
          is_test_data: isDemoMode, // Utilise directement la valeur du contexte
        };

        // Appeler l'API pour ajouter la transaction
        await addTransaction(userId, transactionData);

        // Notifier le composant parent du succès
        if (onSuccess) onSuccess();
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
  ); // N'oubliez pas d'inclure isDemoMode dans les dépendances

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

        {/* Date */}
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
                        "w-full pl-3 text-left font-normal bg-white",
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
                  className="w-auto p-0 bg-white border-gray-200 shadow-md"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={fr}
                    className="bg-white"
                    classNames={{
                      nav_button:
                        "bg-white border border-gray-200 hover:bg-gray-100 p-2 rounded-md",
                      nav_button_previous: "ml-1 h-7 w-7",
                      nav_button_next: "mr-1 h-7 w-7",
                      head: "bg-white",
                      table: "bg-white",
                      day: "bg-white hover:bg-gray-100",
                      day_selected:
                        "bg-[#8367c7] text-white hover:bg-[#7559b7]",
                      day_today: "border border-[#8367c7]",
                      caption: "px-2",
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
                  <SelectTrigger className="bg-white">
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
