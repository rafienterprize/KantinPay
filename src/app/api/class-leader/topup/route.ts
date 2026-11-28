import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function POST(request: NextRequest) {
  try {
    const user = await getSession(request);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is class leader
    if (!user.isClassLeader) {
      return NextResponse.json({ error: "Only class leaders can perform this action" }, { status: 403 });
    }

    const { targetStudentId, amount } = await request.json();

    // Validation
    if (!targetStudentId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    // Get target student
    const targetStudent = store.getUserById(targetStudentId);
    if (!targetStudent || targetStudent.role !== "student") {
      return NextResponse.json({ error: "Target student not found" }, { status: 404 });
    }

    // Check if target student is in the same class
    if (targetStudent.className !== user.className) {
      return NextResponse.json({ error: "You can only top-up students from your class" }, { status: 403 });
    }

    // Create class leader top-up log (credits balance immediately & adds to 1x24h class billing)
    const log = store.createClassLeaderTopUpLog({
      classLeaderId: user.id,
      classLeaderName: user.fullName,
      className: user.className || "",
      targetStudentId: targetStudent.id,
      targetStudentName: targetStudent.fullName,
      targetStudentNis: targetStudent.studentId || "",
      amount,
      previousBalance: targetStudent.balance,
      newBalance: targetStudent.balance + amount,
      status: "pending",
    });

    const billing = store.getClassBilling(user.className || "");

    return NextResponse.json({
      success: true,
      message: "Top-up berhasil! Saldo langsung bertambah & masuk tagihan 1x24 jam ke Koperasi.",
      log,
      billing,
    });
  } catch (error) {
    console.error("Class leader top-up error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
