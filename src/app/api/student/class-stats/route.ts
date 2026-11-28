import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/db/store";
import { User } from "@/types";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    const currentUser = store.getUserById(sessionData.userId);

    if (!currentUser || currentUser.role !== "student") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all students from the same class
    const allUsers = store.getUsers();
    const classmates = allUsers.filter(
      (u: User) => u.role === "student" && u.className === currentUser.className
    );

    // Calculate stats
    const totalBalance = classmates.reduce((sum: number, s: User) => sum + s.balance, 0);
    const totalStudents = classmates.length;

    // Get transactions for today (this is a placeholder - you'll need to implement actual transaction tracking)
    const today = new Date().toDateString();
    const totalTransactions = 0; // Placeholder

    // Find top spender (placeholder - needs actual transaction data)
    const topSpender = classmates.length > 0 
      ? {
          name: classmates[0].fullName,
          amount: 25000, // Placeholder
        }
      : null;

    // Recent transactions (placeholder)
    const recentTransactions = classmates.slice(0, 3).map((s: User) => ({
      studentName: s.fullName,
      amount: 15000,
      timestamp: new Date().toISOString(),
    }));

    return NextResponse.json({
      totalBalance,
      totalStudents,
      totalTransactions,
      topSpender,
      recentTransactions,
    });
  } catch (error) {
    console.error("Class stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch class stats" },
      { status: 500 }
    );
  }
}
