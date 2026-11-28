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
          whatsapp: student.whatsappNumber,
        };
      }
    });
    
    const classes = Array.from(classMap.values())
      .map((cls) => ({
        ...cls,
        billing: store.getClassBilling(cls.className),
      }))
      .sort((a, b) => {
        // Prioritize classes with unpaid billing first, then alphabetically
        if (b.billing.remainingAmount !== a.billing.remainingAmount) {
          return b.billing.remainingAmount - a.billing.remainingAmount;
        }
        return a.className.localeCompare(b.className);
      });

    const unpaidClasses = classes.filter((c) => c.billing.remainingAmount > 0);
    const summary = {
      unpaidClassesCount: unpaidClasses.length,
      totalUnpaidAmount: unpaidClasses.reduce((sum, c) => sum + c.billing.remainingAmount, 0),
      frozenClassesCount: unpaidClasses.filter((c) => c.billing.isFrozen).length,
    };

    return NextResponse.json({ classes, summary });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}
