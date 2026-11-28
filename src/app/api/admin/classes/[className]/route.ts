import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ className: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { className } = await params;
    const decodedClassName = decodeURIComponent(className);

    const allStudents = store.getStudents();
    const students = allStudents.filter(
      (s) => s.className === decodedClassName
    );

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error fetching class students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
