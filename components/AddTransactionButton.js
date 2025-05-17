// components/AddTransactionButton.js
"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTransactionForm from "@/components/AddTransactionForm";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function AddTransactionButton({ onTransactionAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Gestionnaire pour l'ajout réussi d'une transaction
  const handleTransactionAdded = useCallback(() => {
    toast.success("Transaction ajoutée avec succès");
    setIsOpen(false);

    // Appeler le callback du parent si fourni
    if (onTransactionAdded) {
      onTransactionAdded();
    }
  }, [onTransactionAdded]);

  // Gestionnaire d'ouverture du modal
  const handleOpenChange = useCallback((open) => {
    setIsOpen(open);
  }, []);

  // Gestionnaire de clic sur le bouton
  const handleButtonClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Gestionnaire d'annulation
  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Bouton d'ajout de transaction */}
      <Button
        onClick={handleButtonClick}
        className="bg-[var(--primary-light)] hover:bg-[#7559b7] flex items-center gap-2 text-gray-600"
        aria-label="Ajouter une transaction"
      >
        <Plus size={16} />
        Ajouter une transaction
      </Button>

      {/* Dialog pour le formulaire */}
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[550px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Ajouter une transaction
            </DialogTitle>
          </DialogHeader>

          {/* Formulaire d'ajout de transaction */}
          {userId && (
            <AddTransactionForm
              userId={userId}
              onSuccess={handleTransactionAdded}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
