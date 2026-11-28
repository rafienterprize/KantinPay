import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";
import { User } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = store.getUserById(session.id);
    if (!currentUser || currentUser.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userClassName = currentUser.className || "";

    // Strictly scoped to the logged-in student's class category
    const students = store
      .getStudents()
      .filter((s: User) => s.className === userClassName)
      .sort((a: User, b: User) => {
        if (a.isClassLeader && !b.isClassLeader) return -1;
        if (!a.isClassLeader && b.isClassLeader) return 1;
        return a.fullName.localeCompare(b.fullName);
      });

    // Also compute total spending per student so classmates table can show jajan stats
    const allPayments = store
      .getTransactions()
      .filter((t) => t.type === "payment" && t.status === "success");

    const spendingMap = new Map<string, number>();
    for (const tx of allPayments) {
      if (tx.studentId) {
        spendingMap.set(tx.studentId, (spendingMap.get(tx.studentId) || 0) + tx.amount);
      }
    }

    const enrichedStudents = students.map((s) => ({
      ...s,
      passwordHash: undefined,
      totalSpent: spendingMap.get(s.id) || 0,
    }));

    return NextResponse.json({
      className: userClassName,
      students: enrichedStudents,
    });
  } catch (error) {
    console.error("Error fetching classmates:", error);
    return NextResponse.json(
      { error: "Failed to fetch classmates" },
      { status: 500 }
    );
  }
}
