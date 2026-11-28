import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Fetch fresh balance and details from store
  const user = store.getUserById(session.id);
  return NextResponse.json({
    user: user
      ? {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          balance: user.balance,
          studentId: user.studentId,
          className: user.className,
          isClassLeader: Boolean(user.isClassLeader),
          whatsappNumber: user.whatsappNumber,
          status: user.status,
        }
      : session,
  });
}
