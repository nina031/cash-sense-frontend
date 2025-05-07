// hooks/useTransactionCategory.js
import { useMemo } from "react";
import { getCategoryInfo } from "@/utils/categoryUtils";

export function useTransactionCategory(transaction) {
  return useMemo(() => {
    return getCategoryInfo(
      transaction?.category?.id,
      transaction?.category?.subcategory?.id
    );
  }, [transaction?.category]);
}
