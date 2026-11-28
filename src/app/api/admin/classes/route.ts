import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = store.getStudents();
    
    // Group by class
    const classMap = new Map();
    
    students.forEach((student) => {
      const className = student.className || "Tidak Ada Kelas";
      
      if (!classMap.has(className)) {
        classMap.set(className, {
          className,
          totalStudents: 0,
          totalBalance: 0,
          classLeader: null,
        });
      }
      
      const classData = classMap.get(className);
      classData.totalStudents++;
      classData.totalBalance += student.balance;
      
      // Find class leader
      if (student.isClassLeader) {
        classData.classLeader = {
          id: student.id,
          name: student.fullName,
        };
      }
    });
    
    const classes = Array.from(classMap.values()).sort((a, b) =>
      a.className.localeCompare(b.className)
    );

    return NextResponse.json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
