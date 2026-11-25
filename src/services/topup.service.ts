import { store } from "@/lib/db/store";

export const topupService = {
  performTopUp(studentId: string, amount: number, adminId: string) {
    return store.topUp(studentId, amount, adminId);
  },
};
