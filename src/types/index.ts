export type UserRole = "student" | "admin" | "merchant";

export type AccountStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  whatsappNumber: string;
  studentId?: string; // NIS / Nomor Induk Siswa
  className?: string; // Kelas
  balance: number;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export type CanteenStatus = "active" | "closed" | "maintenance";

export interface Canteen {
  id: string;
  name: string;
  ownerName: string;
  whatsappNumber: string;
  merchantUserId?: string;
  description?: string;
  category?: string;
  status: CanteenStatus;
  dailyTotal: number;
  dailyCount: number;
  connectionStatus: "online" | "offline";
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "payment" | "topup" | "settlement";
export type TransactionStatus = "success" | "pending" | "failed";

export interface Transaction {
  id: string;
  referenceNumber: string;
  studentId?: string;
  studentName?: string;
  studentNis?: string;
  canteenId?: string;
  canteenName?: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface TopUpRecord {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  adminId: string;
  adminName: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  createdAt: string;
}

export type SettlementStatus = "pending" | "processing" | "settled";

export interface MerchantSettlement {
  id: string;
  canteenId: string;
  canteenName: string;
  totalAmount: number;
  transactionCount: number;
  status: SettlementStatus;
  referenceNumber: string;
  processedBy?: string;
  settlementDate: string;
  createdAt: string;
  settledAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  readAt?: string;
  createdAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  balance?: number;
  studentId?: string;
  className?: string;
  whatsappNumber?: string;
  canteenId?: string;
}
