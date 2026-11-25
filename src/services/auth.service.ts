import { store } from "@/lib/db/store";
import bcrypt from "bcryptjs";
import { User, SessionUser } from "@/types";

export const authService = {
  async authenticate(emailOrUsername: string, passwordPlain: string): Promise<{ user?: SessionUser; error?: string }> {
    const user = store.getUserByEmail(emailOrUsername);
    if (!user) {
      return { error: "Email atau akun tidak terdaftar di KantinPay." };
    }

    if (user.status !== "active") {
      return { error: "Akun Anda saat ini tidak aktif. Silakan hubungi pengurus koperasi." };
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      return { error: "Kata sandi yang Anda masukkan salah." };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      balance: user.balance,
      studentId: user.studentId,
      className: user.className,
      whatsappNumber: user.whatsappNumber,
    };

    return { user: sessionUser };
  },

  async getProfile(userId: string): Promise<User | null> {
    const user = store.getUserById(userId);
    return user || null;
  },
};
