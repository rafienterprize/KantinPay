import { pgTable, text, timestamp, integer, varchar, pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["student", "admin", "merchant"]);
export const accountStatusEnum = pgEnum("account_status", ["active", "inactive", "suspended"]);
export const canteenStatusEnum = pgEnum("canteen_status", ["active", "closed", "maintenance"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["payment", "topup", "settlement"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["success", "pending", "failed"]);
export const settlementStatusEnum = pgEnum("settlement_status", ["pending", "processing", "settled"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("student").notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 32 }).notNull(),
  studentId: varchar("student_id", { length: 64 }),
  className: varchar("class_name", { length: 64 }),
  balance: integer("balance").default(0).notNull(),
  status: accountStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const canteens = pgTable("canteens", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 32 }).notNull(),
  merchantUserId: text("merchant_user_id").references(() => users.id),
  description: text("description"),
  category: varchar("category", { length: 128 }),
  status: canteenStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  referenceNumber: varchar("reference_number", { length: 64 }).notNull().unique(),
  studentId: text("student_id").references(() => users.id),
  canteenId: text("canteen_id").references(() => canteens.id),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  status: transactionStatusEnum("status").default("success").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topups = pgTable("topups", {
  id: text("id").primaryKey(),
  transactionId: text("transaction_id").references(() => transactions.id),
  studentId: text("student_id").references(() => users.id).notNull(),
  adminId: text("admin_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const merchantSettlements = pgTable("merchant_settlements", {
  id: text("id").primaryKey(),
  canteenId: text("canteen_id").references(() => canteens.id).notNull(),
  totalAmount: integer("total_amount").notNull(),
  transactionCount: integer("transaction_count").notNull(),
  status: settlementStatusEnum("status").default("pending").notNull(),
  referenceNumber: varchar("reference_number", { length: 64 }).notNull().unique(),
  processedBy: text("processed_by").references(() => users.id),
  settlementDate: varchar("settlement_date", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  settledAt: timestamp("settled_at"),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
