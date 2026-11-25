import { store } from "@/lib/db/store";
import { Canteen } from "@/types";

export const canteenService = {
  getCanteens(search = "", categoryFilter = "", statusFilter = ""): Canteen[] {
    let list = store.getCanteens();

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      list = list.filter((c) => c.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (statusFilter && statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }

    return list;
  },

  getCanteenById(id: string): Canteen | undefined {
    return store.getCanteenById(id);
  },

  createCanteen(data: {
    name: string;
    ownerName: string;
    whatsappNumber: string;
    description?: string;
    category?: string;
  }): { success: boolean; message: string; canteen?: Canteen } {
    const newCanteen = store.addCanteen({
      name: data.name,
      ownerName: data.ownerName,
      whatsappNumber: data.whatsappNumber,
      description: data.description,
      category: data.category || "Makanan & Minuman",
      status: "active",
      connectionStatus: "online",
    });

    return {
      success: true,
      message: `Kantin ${newCanteen.name} berhasil didaftarkan!`,
      canteen: newCanteen,
    };
  },
};
