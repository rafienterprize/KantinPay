import { store } from "@/lib/db/store";
import { Transaction } from "@/types";

export const transactionService = {
  getAllTransactions(typeFilter?: string): Transaction[] {
    const list = store.getTransactions();
    if (typeFilter && typeFilter !== "all") {
      return list.filter((t) => t.type === typeFilter);
    }
    return list;
  },

  getTransactionsByStudent(studentId: string): Transaction[] {
    return store.getTransactionsByStudent(studentId);
  },

  getTransactionsByCanteen(canteenId: string): Transaction[] {
    return store.getTransactionsByCanteen(canteenId);
  },
};
