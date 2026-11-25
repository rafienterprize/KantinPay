import { store } from "@/lib/db/store";
import { User } from "@/types";
import bcrypt from "bcryptjs";

export const userService = {
  getStudents(search = "", classFilter = "", statusFilter = ""): User[] {
    let list = store.getStudents();

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          (s.studentId && s.studentId.includes(q)) ||
          s.email.toLowerCase().includes(q) ||
          s.whatsappNumber.includes(q)
      );
    }

    if (classFilter && classFilter !== "all") {
      list = list.filter((s) => s.className?.toLowerCase().includes(classFilter.toLowerCase()));
    }

    if (statusFilter && statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }

    return list;
  },

  getStudentById(id: string): User | undefined {
    return store.getUserById(id);
  },

  async createStudent(data: {
    fullName: string;
    studentId: string;
    email: string;
    whatsappNumber: string;
    className: string;
    initialBalance?: number;
    password?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> {
    // Check duplicates
    const existingEmail = store.getUserByEmail(data.email);
    if (existingEmail) {
      return { success: false, message: "Email sudah terdaftar untuk siswa lain." };
    }

    const existingNis = store.getStudents().find((s) => s.studentId === data.studentId);
    if (existingNis) {
      return { success: false, message: `NIS ${data.studentId} sudah digunakan.` };
    }

    const passwordHash = await bcrypt.hash(data.password || "password123", 10);
    const newStudent = store.addStudent({
      fullName: data.fullName,
      email: data.email,
      studentId: data.studentId,
      className: data.className,
      whatsappNumber: data.whatsappNumber,
      balance: data.initialBalance || 0,
      status: "active",
      passwordHash: passwordHash,
    });

    return {
      success: true,
      message: `Siswa ${newStudent.fullName} berhasil ditambahkan ke KantinPay!`,
      user: newStudent,
    };
  },

  updateStudent(id: string, updates: Partial<User>) {
    return store.updateStudent(id, updates);
  },
};
