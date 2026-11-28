import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/user.service";
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
    const { fullName, studentId, email, whatsappNumber, className, password } = body;

    // Validate required fields
    if (!fullName || !studentId || !email || !whatsappNumber) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Check if student exists
    const existingStudent = store.getUserById(id);
    if (!existingStudent) {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if studentId or email already used by another student
    const allStudents = store.getStudents();
    const duplicateStudentId = allStudents.find(
      (s) => s.id !== id && s.studentId === studentId
    );
    if (duplicateStudentId) {
      return NextResponse.json(
        { error: "NIS sudah digunakan oleh siswa lain" },
        { status: 400 }
      );
    }

    const duplicateEmail = allStudents.find(
      (s) => s.id !== id && s.email === email
    );
    if (duplicateEmail) {
      return NextResponse.json(
        { error: "Email sudah digunakan oleh siswa lain" },
        { status: 400 }
      );
    }

    // Update student
    const updateData: any = {
      fullName,
      studentId,
      email,
      whatsappNumber,
      className,
    };

    // Hash password jika disediakan
    if (password) {
      const bcrypt = require("bcryptjs");
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedStudent = userService.updateStudent(id, updateData);

    if (!updatedStudent) {
      return NextResponse.json(
        { error: "Gagal memperbarui data siswa" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui data siswa" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if student exists
    const existingStudent = store.getUserById(id);
    if (!existingStudent) {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete student
    const deleted = store.deleteStudent(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Gagal menghapus akun siswa" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Akun siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus akun siswa" },
      { status: 500 }
    );
  }
}
