import { store } from "@/lib/db/store";
import { MerchantSettlement } from "@/types";

export const settlementService = {
  getAllSettlements(): MerchantSettlement[] {
    return store.getSettlements();
  },

  settleMerchant(settlementId: string, adminId: string): { success: boolean; message: string; settlement?: MerchantSettlement } {
    const updated = store.updateSettlementStatus(settlementId, "settled", adminId);
    if (!updated) {
      return { success: false, message: "Rekap settlement tidak ditemukan" };
    }
    return {
      success: true,
      message: `Pencairan dana untuk ${updated.canteenName} senilai Rp${updated.totalAmount.toLocaleString("id-ID")} berhasil diselesaikan!`,
      settlement: updated,
    };
  },

  processMerchant(settlementId: string, adminId: string): { success: boolean; message: string; settlement?: MerchantSettlement } {
    const updated = store.updateSettlementStatus(settlementId, "processing", adminId);
    if (!updated) {
      return { success: false, message: "Rekap settlement tidak ditemukan" };
    }
    return {
      success: true,
      message: `Status pencairan untuk ${updated.canteenName} diubah menjadi 'Sedang Diproses'.`,
      settlement: updated,
    };
  },
};
