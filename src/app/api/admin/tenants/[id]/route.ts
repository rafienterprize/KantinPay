import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, ownerName, whatsappNumber, category, description, password } = body;

    // Validate required fields
    if (!name || !ownerName || !whatsappNumber || !category) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Check if tenant exists
    const existingTenant = store.getCanteenById(id);
    if (!existingTenant) {
      return NextResponse.json(
        { error: "Tenant tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if name already used by another tenant
    const allCanteens = store.getCanteens();
    const duplicateName = allCanteens.find(
      (c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicateName) {
      return NextResponse.json(
        { error: "Nama kantin sudah digunakan oleh tenant lain" },
        { status: 400 }
      );
    }

    // Update tenant
    const updateData: any = {
      name,
      ownerName,
      whatsappNumber,
      category,
      description,
    };

    const updatedTenant = store.updateCanteen(id, updateData);

    if (!updatedTenant) {
      return NextResponse.json(
        { error: "Gagal memperbarui data tenant" },
        { status: 500 }
      );
    }

    // Update merchant user password jika ada merchantUserId dan password baru
    if (password && updatedTenant.merchantUserId) {
      const bcrypt = require("bcryptjs");
      const passwordHash = await bcrypt.hash(password, 10);
      
      const merchantUser = store.getUserById(updatedTenant.merchantUserId);
      if (merchantUser) {
        store.updateStudent(updatedTenant.merchantUserId, { passwordHash });
      }
    }

    return NextResponse.json({
      success: true,
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui data tenant" },
      { status: 500 }
    );
  }
}
