import { store } from "@/lib/db/store";

export const paymentService = {
  /**
   * Process school cafeteria payment
   * Server-side atomic validation and execution
   */
  async processPayment(params: {
    studentId: string;
    canteenId: string;
    amount: number;
    description?: string;
  }) {
    // Basic validations
    if (!params.studentId) {
      return { success: false, message: "Identitas siswa harus disertakan" };
    }
    if (!params.canteenId) {
      return { success: false, message: "Kantin tujuan harus dipilih" };
    }
    if (typeof params.amount !== "number" || params.amount <= 0) {
      return { success: false, message: "Nominal pembayaran tidak valid" };
    }

    return store.processPayment(
      params.studentId,
      params.canteenId,
      params.amount,
      params.description
    );
  },
};
