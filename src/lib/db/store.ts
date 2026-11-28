import {
  User,
  Canteen,
  Transaction,
  MerchantSettlement,
  NotificationItem,
  TopUpRecord,
  ClassLeaderTopUpLog,
} from "@/types";
import bcrypt from "bcryptjs";

// Initial seed data with hashed password "password123" and admin "admin123"
const defaultPasswordHash = bcrypt.hashSync("password123", 10);
const adminPasswordHash = bcrypt.hashSync("admin123", 10);

const initialUsers: User[] = [
  {
    id: "usr-admin-1",
    fullName: "Pengurus Koperasi Sekolah",
    email: "admin@kantinpay.sch.id",
    passwordHash: adminPasswordHash,
    role: "admin",
    whatsappNumber: "081234567890",
    balance: 0,
    status: "active",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "usr-stu-1",
    fullName: "Ahmad Rifai",
    email: "ahmad@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887701",
    studentId: "20241001",
    className: "XII SIJA 1",
    isClassLeader: true,
    balance: 85000,
    status: "active",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "usr-stu-2",
    fullName: "Nurul Hidayah",
    email: "nurul@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887702",
    studentId: "20241002",
    className: "XII SIJA 2",
    isClassLeader: true,
    balance: 120000,
    status: "active",
    createdAt: "2026-01-15T09:05:00Z",
    updatedAt: "2026-01-15T09:05:00Z",
  },
  {
    id: "usr-stu-3",
    fullName: "Dimas Pratama",
    email: "dimas@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887703",
    studentId: "20241003",
    className: "XI TKJ 1",
    balance: 45000,
    status: "active",
    createdAt: "2026-01-15T09:10:00Z",
    updatedAt: "2026-01-15T09:10:00Z",
  },
  {
    id: "usr-stu-4",
    fullName: "Siti Rahmawati",
    email: "siti@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887704",
    studentId: "20241004",
    className: "XI RPL 2",
    balance: 65000,
    status: "active",
    createdAt: "2026-01-16T08:30:00Z",
    updatedAt: "2026-01-16T08:30:00Z",
  },
  {
    id: "usr-stu-5",
    fullName: "Bagus Setiawan",
    email: "bagus@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887705",
    studentId: "20241005",
    className: "XII SIJA 1",
    balance: 15000,
    status: "active",
    createdAt: "2026-01-16T08:45:00Z",
    updatedAt: "2026-01-16T08:45:00Z",
  },
  {
    id: "usr-stu-5b",
    fullName: "Rudi Hartono",
    email: "rudi@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887721",
    studentId: "20241021",
    className: "XII SIJA 1",
    balance: 35000,
    status: "active",
    createdAt: "2026-01-16T08:50:00Z",
    updatedAt: "2026-01-16T08:50:00Z",
  },
  {
    id: "usr-stu-5c",
    fullName: "Indah Permata",
    email: "indah@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887722",
    studentId: "20241022",
    className: "XII SIJA 1",
    balance: 42000,
    status: "active",
    createdAt: "2026-01-16T08:55:00Z",
    updatedAt: "2026-01-16T08:55:00Z",
  },
  {
    id: "usr-stu-6",
    fullName: "Dewi Anggraini",
    email: "dewi@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887706",
    studentId: "20241006",
    className: "X DKV 1",
    balance: 95000,
    status: "active",
    createdAt: "2026-01-17T09:15:00Z",
    updatedAt: "2026-01-17T09:15:00Z",
  },
  {
    id: "usr-stu-7",
    fullName: "Fajar Maulana",
    email: "fajar@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887707",
    studentId: "20241007",
    className: "X TKJ 2",
    balance: 30000,
    status: "active",
    createdAt: "2026-01-17T09:30:00Z",
    updatedAt: "2026-01-17T09:30:00Z",
  },
  {
    id: "usr-stu-8",
    fullName: "Rina Kusuma",
    email: "rina@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887708",
    studentId: "20241008",
    className: "XII RPL 1",
    balance: 110000,
    status: "active",
    createdAt: "2026-01-18T10:00:00Z",
    updatedAt: "2026-01-18T10:00:00Z",
  },
  {
    id: "usr-stu-9",
    fullName: "Rizky Ramadhan",
    email: "rizky@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887709",
    studentId: "20241009",
    className: "XI SIJA 2",
    balance: 50000,
    status: "active",
    createdAt: "2026-01-18T10:15:00Z",
    updatedAt: "2026-01-18T10:15:00Z",
  },
  {
    id: "usr-stu-10",
    fullName: "Aditya Pratama",
    email: "aditya@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887710",
    studentId: "20241010",
    className: "X RPL 1",
    isClassLeader: true,
    balance: 75000,
    status: "active",
    createdAt: "2026-01-19T11:00:00Z",
    updatedAt: "2026-01-19T11:00:00Z",
  },
  // More students for X DKV 1
  {
    id: "usr-stu-11",
    fullName: "Budi Santoso",
    email: "budi.santoso@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887711",
    studentId: "20241011",
    className: "X DKV 1",
    isClassLeader: true,
    balance: 55000,
    status: "active",
    createdAt: "2026-01-19T11:05:00Z",
    updatedAt: "2026-01-19T11:05:00Z",
  },
  // More students for XI RPL 2
  {
    id: "usr-stu-12",
    fullName: "Citra Lestari",
    email: "citra@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887712",
    studentId: "20241012",
    className: "XI RPL 2",
    isClassLeader: true,
    balance: 68000,
    status: "active",
    createdAt: "2026-01-19T11:10:00Z",
    updatedAt: "2026-01-19T11:10:00Z",
  },
  // More students for XI TKJ 1
  {
    id: "usr-stu-13",
    fullName: "Eko Prasetyo",
    email: "eko@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887713",
    studentId: "20241013",
    className: "XI TKJ 1",
    isClassLeader: true,
    balance: 72000,
    status: "active",
    createdAt: "2026-01-19T11:15:00Z",
    updatedAt: "2026-01-19T11:15:00Z",
  },
  // More students for XI SIJA 2
  {
    id: "usr-stu-14",
    fullName: "Fitri Handayani",
    email: "fitri@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887714",
    studentId: "20241014",
    className: "XI SIJA 2",
    isClassLeader: true,
    balance: 83000,
    status: "active",
    createdAt: "2026-01-19T11:20:00Z",
    updatedAt: "2026-01-19T11:20:00Z",
  },
  // More students for XII RPL 1
  {
    id: "usr-stu-15",
    fullName: "Galih Ramadhan",
    email: "galih@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887715",
    studentId: "20241015",
    className: "XII RPL 1",
    isClassLeader: true,
    balance: 92000,
    status: "active",
    createdAt: "2026-01-19T11:25:00Z",
    updatedAt: "2026-01-19T11:25:00Z",
  },
  // More students for X TKJ 2
  {
    id: "usr-stu-16",
    fullName: "Hana Safitri",
    email: "hana@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887716",
    studentId: "20241016",
    className: "X TKJ 2",
    isClassLeader: true,
    balance: 48000,
    status: "active",
    createdAt: "2026-01-19T11:30:00Z",
    updatedAt: "2026-01-19T11:30:00Z",
  },
  // Additional students for XII SIJA 2
  {
    id: "usr-stu-17",
    fullName: "Ilham Maulana",
    email: "ilham@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887717",
    studentId: "20241017",
    className: "XII SIJA 2",
    balance: 61000,
    status: "active",
    createdAt: "2026-01-19T11:35:00Z",
    updatedAt: "2026-01-19T11:35:00Z",
  },
  {
    id: "usr-stu-18",
    fullName: "Joko Widodo",
    email: "joko.w@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887718",
    studentId: "20241018",
    className: "XII SIJA 2",
    balance: 73000,
    status: "active",
    createdAt: "2026-01-19T11:40:00Z",
    updatedAt: "2026-01-19T11:40:00Z",
  },
  // Additional students for X DKV 1
  {
    id: "usr-stu-19",
    fullName: "Kartika Sari",
    email: "kartika@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887719",
    studentId: "20241019",
    className: "X DKV 1",
    balance: 58000,
    status: "active",
    createdAt: "2026-01-19T11:45:00Z",
    updatedAt: "2026-01-19T11:45:00Z",
  },
  {
    id: "usr-stu-20",
    fullName: "Lina Marlina",
    email: "lina@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887720",
    studentId: "20241020",
    className: "X DKV 1",
    balance: 42000,
    status: "active",
    createdAt: "2026-01-19T11:50:00Z",
    updatedAt: "2026-01-19T11:50:00Z",
  },
  // Additional students for X RPL 1
  {
    id: "usr-stu-21",
    fullName: "Maya Putri",
    email: "maya@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887721",
    studentId: "20241021",
    className: "X RPL 1",
    balance: 65000,
    status: "active",
    createdAt: "2026-01-19T11:55:00Z",
    updatedAt: "2026-01-19T11:55:00Z",
  },
  {
    id: "usr-stu-22",
    fullName: "Nanda Pratama",
    email: "nanda@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887722",
    studentId: "20241022",
    className: "X RPL 1",
    balance: 52000,
    status: "active",
    createdAt: "2026-01-19T12:00:00Z",
    updatedAt: "2026-01-19T12:00:00Z",
  },
  // Additional students for X TKJ 2
  {
    id: "usr-stu-23",
    fullName: "Oscar Ramadhan",
    email: "oscar@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887723",
    studentId: "20241023",
    className: "X TKJ 2",
    balance: 38000,
    status: "active",
    createdAt: "2026-01-19T12:05:00Z",
    updatedAt: "2026-01-19T12:05:00Z",
  },
  {
    id: "usr-stu-24",
    fullName: "Putri Ayu",
    email: "putri.ayu@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887724",
    studentId: "20241024",
    className: "X TKJ 2",
    balance: 44000,
    status: "active",
    createdAt: "2026-01-19T12:10:00Z",
    updatedAt: "2026-01-19T12:10:00Z",
  },
  // Additional students for XI RPL 2
  {
    id: "usr-stu-25",
    fullName: "Qori Auliya",
    email: "qori@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887725",
    studentId: "20241025",
    className: "XI RPL 2",
    balance: 71000,
    status: "active",
    createdAt: "2026-01-19T12:15:00Z",
    updatedAt: "2026-01-19T12:15:00Z",
  },
  {
    id: "usr-stu-26",
    fullName: "Reza Firmansyah",
    email: "reza@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887726",
    studentId: "20241026",
    className: "XI RPL 2",
    balance: 59000,
    status: "active",
    createdAt: "2026-01-19T12:20:00Z",
    updatedAt: "2026-01-19T12:20:00Z",
  },
  // Additional students for XI TKJ 1
  {
    id: "usr-stu-27",
    fullName: "Santi Wulandari",
    email: "santi@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887727",
    studentId: "20241027",
    className: "XI TKJ 1",
    balance: 48000,
    status: "active",
    createdAt: "2026-01-19T12:25:00Z",
    updatedAt: "2026-01-19T12:25:00Z",
  },
  {
    id: "usr-stu-28",
    fullName: "Tomi Hidayat",
    email: "tomi@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887728",
    studentId: "20241028",
    className: "XI TKJ 1",
    balance: 55000,
    status: "active",
    createdAt: "2026-01-19T12:30:00Z",
    updatedAt: "2026-01-19T12:30:00Z",
  },
  // Additional students for XI SIJA 2
  {
    id: "usr-stu-29",
    fullName: "Umi Salamah",
    email: "umi@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887729",
    studentId: "20241029",
    className: "XI SIJA 2",
    balance: 62000,
    status: "active",
    createdAt: "2026-01-19T12:35:00Z",
    updatedAt: "2026-01-19T12:35:00Z",
  },
  // Additional students for XII RPL 1
  {
    id: "usr-stu-30",
    fullName: "Vina Anggraini",
    email: "vina@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887730",
    studentId: "20241030",
    className: "XII RPL 1",
    balance: 88000,
    status: "active",
    createdAt: "2026-01-19T12:40:00Z",
    updatedAt: "2026-01-19T12:40:00Z",
  },
  {
    id: "usr-stu-31",
    fullName: "Wahyu Santoso",
    email: "wahyu@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887731",
    studentId: "20241031",
    className: "XII RPL 1",
    balance: 76000,
    status: "active",
    createdAt: "2026-01-19T12:45:00Z",
    updatedAt: "2026-01-19T12:45:00Z",
  },
  // Additional students for XII SIJA 1
  {
    id: "usr-stu-32",
    fullName: "Xena Permata",
    email: "xena@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887732",
    studentId: "20241032",
    className: "XII SIJA 1",
    balance: 54000,
    status: "active",
    createdAt: "2026-01-19T12:50:00Z",
    updatedAt: "2026-01-19T12:50:00Z",
  },
  {
    id: "usr-stu-33",
    fullName: "Yoga Pratama",
    email: "yoga@kantinpay.sch.id",
    passwordHash: defaultPasswordHash,
    role: "student",
    whatsappNumber: "082199887733",
    studentId: "20241033",
    className: "XII SIJA 1",
    balance: 68000,
    status: "active",
    createdAt: "2026-01-19T12:55:00Z",
    updatedAt: "2026-01-19T12:55:00Z",
  },
];

const initialCanteens: Canteen[] = [
  {
    id: "canteen-1",
    name: "Kantin 1",
    ownerName: "Ibu Nurhasanah",
    whatsappNumber: "081311223301",
    description: "Kantin Sehat — Nasi Rames, Ayam Goreng & Sayur Asem",
    category: "Makanan Berat",
    status: "active",
    dailyTotal: 345000,
    dailyCount: 28,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-2",
    name: "Kantin 2",
    ownerName: "Pak Joko Susilo",
    whatsappNumber: "081311223302",
    description: "Kantin Berkah — Mie Ayam Pangsit & Bakso Sapi Segar",
    category: "Mie & Bakso",
    status: "active",
    dailyTotal: 290000,
    dailyCount: 22,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-3",
    name: "Kantin 3",
    ownerName: "Ibu Siti Fatimah",
    whatsappNumber: "081311223303",
    description: "Dapur Bu Siti — Nasi Goreng Spesial & Ayam Geprek Sambal Korek",
    category: "Ayam & Nasi Goreng",
    status: "active",
    dailyTotal: 420000,
    dailyCount: 31,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-4",
    name: "Kantin 4",
    ownerName: "Pak Budi Hartono",
    whatsappNumber: "081311223304",
    description: "Kantin Pojok — Gorengan Hangat, Risol Mayo & Tahu Walik",
    category: "Snack & Gorengan",
    status: "active",
    dailyTotal: 185000,
    dailyCount: 37,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-5",
    name: "Kantin 5",
    ownerName: "Ibu Maya Anggraeni",
    whatsappNumber: "081311223305",
    description: "Kantin Ceria — Aneka Jus Buah Segar, Es Teh Manis & Pop Ice",
    category: "Minuman Segar",
    status: "active",
    dailyTotal: 260000,
    dailyCount: 45,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-6",
    name: "Kantin 6",
    ownerName: "Pak Slamet Riyadi",
    whatsappNumber: "081311223306",
    description: "Kantin Makmur — Soto Ayam Lamongan, Rawon Daging & Pecel Lele",
    category: "Makanan Tradisional",
    status: "active",
    dailyTotal: 310000,
    dailyCount: 24,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-7",
    name: "Kantin 7",
    ownerName: "Ibu Dewi Sartika",
    whatsappNumber: "081311223307",
    description: "Kantin Barokah — Roti Bakar Coklat Keju & Donat Kentang",
    category: "Kue & Bakery",
    status: "active",
    dailyTotal: 175000,
    dailyCount: 19,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "canteen-8",
    name: "Kantin 8",
    ownerName: "Ibu Rita Wulandari",
    whatsappNumber: "081311223308",
    description: "Kantin Harmoni — Salad Buah, Siomay Bandung & Dimsum Kukus",
    category: "Dimsum & Salad",
    status: "active",
    dailyTotal: 215000,
    dailyCount: 20,
    connectionStatus: "online",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    referenceNumber: "KP-20260125-001",
    studentId: "usr-stu-1",
    studentName: "Ahmad Rifai",
    studentNis: "20241001",
    canteenId: "canteen-1",
    canteenName: "Kantin 1",
    type: "payment",
    amount: 15000,
    status: "success",
    description: "Pembayaran Nasi Rames Ayam di Kantin 1",
    createdAt: "2026-01-25T09:45:00Z",
  },
  {
    id: "tx-2",
    referenceNumber: "KP-20260125-002",
    studentId: "usr-stu-2",
    studentName: "Nurul Hidayah",
    studentNis: "20241002",
    canteenId: "canteen-3",
    canteenName: "Kantin 3",
    type: "payment",
    amount: 12000,
    status: "success",
    description: "Pembayaran Nasi Goreng Spesial di Kantin 3",
    createdAt: "2026-01-25T10:05:00Z",
  },
  {
    id: "tx-3",
    referenceNumber: "KP-20260125-003",
    studentId: "usr-stu-3",
    studentName: "Dimas Pratama",
    studentNis: "20241003",
    canteenId: "canteen-5",
    canteenName: "Kantin 5",
    type: "payment",
    amount: 5000,
    status: "success",
    description: "Pembayaran Es Jeruk Segar di Kantin 5",
    createdAt: "2026-01-25T10:15:00Z",
  },
  {
    id: "tx-4",
    referenceNumber: "KP-20260125-004",
    studentId: "usr-stu-4",
    studentName: "Siti Rahmawati",
    studentNis: "20241004",
    canteenId: "canteen-2",
    canteenName: "Kantin 2",
    type: "payment",
    amount: 14000,
    status: "success",
    description: "Pembayaran Mie Ayam Bakso di Kantin 2",
    createdAt: "2026-01-25T10:30:00Z",
  },
  {
    id: "tx-5",
    referenceNumber: "KP-20260125-005",
    studentId: "usr-stu-5",
    studentName: "Bagus Setiawan",
    studentNis: "20241005",
    canteenId: "canteen-4",
    canteenName: "Kantin 4",
    type: "payment",
    amount: 8000,
    status: "success",
    description: "Pembayaran Risol Mayo & Tahu Walik di Kantin 4",
    createdAt: "2026-01-25T10:40:00Z",
  },
  {
    id: "tx-top-1",
    referenceNumber: "TOP-20260125-001",
    studentId: "usr-stu-1",
    studentName: "Ahmad Rifai",
    studentNis: "20241001",
    type: "topup",
    amount: 50000,
    status: "success",
    description: "Top up saldo via Koperasi Sekolah oleh Pengurus",
    createdAt: "2026-01-25T08:15:00Z",
  },
  {
    id: "tx-top-2",
    referenceNumber: "TOP-20260125-002",
    studentId: "usr-stu-2",
    studentName: "Nurul Hidayah",
    studentNis: "20241002",
    type: "topup",
    amount: 100000,
    status: "success",
    description: "Top up saldo via Koperasi Sekolah oleh Pengurus",
    createdAt: "2026-01-25T08:30:00Z",
  },
];

const initialSettlements: MerchantSettlement[] = [
  {
    id: "stl-1",
    canteenId: "canteen-1",
    canteenName: "Kantin 1 (Bu Nurhasanah)",
    totalAmount: 345000,
    transactionCount: 28,
    status: "pending",
    referenceNumber: "STL-20260125-K01",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "stl-2",
    canteenId: "canteen-2",
    canteenName: "Kantin 2 (Pak Joko)",
    totalAmount: 290000,
    transactionCount: 22,
    status: "processing",
    referenceNumber: "STL-20260125-K02",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "stl-3",
    canteenId: "canteen-3",
    canteenName: "Kantin 3 (Ibu Siti)",
    totalAmount: 420000,
    transactionCount: 31,
    status: "settled",
    referenceNumber: "STL-20260125-K03",
    processedBy: "usr-admin-1",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
    settledAt: "2026-01-25T11:45:00Z",
  },
  {
    id: "stl-4",
    canteenId: "canteen-4",
    canteenName: "Kantin 4 (Pak Budi)",
    totalAmount: 185000,
    transactionCount: 37,
    status: "pending",
    referenceNumber: "STL-20260125-K04",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "stl-5",
    canteenId: "canteen-5",
    canteenName: "Kantin 5 (Bu Maya)",
    totalAmount: 260000,
    transactionCount: 45,
    status: "settled",
    referenceNumber: "STL-20260125-K05",
    processedBy: "usr-admin-1",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
    settledAt: "2026-01-25T12:00:00Z",
  },
  {
    id: "stl-6",
    canteenId: "canteen-6",
    canteenName: "Kantin 6 (Pak Slamet)",
    totalAmount: 310000,
    transactionCount: 24,
    status: "processing",
    referenceNumber: "STL-20260125-K06",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "stl-7",
    canteenId: "canteen-7",
    canteenName: "Kantin 7 (Ibu Dewi)",
    totalAmount: 175000,
    transactionCount: 19,
    status: "pending",
    referenceNumber: "STL-20260125-K07",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "stl-8",
    canteenId: "canteen-8",
    canteenName: "Kantin 8 (Bu Rita)",
    totalAmount: 215000,
    transactionCount: 20,
    status: "pending",
    referenceNumber: "STL-20260125-K08",
    settlementDate: "2026-01-25",
    createdAt: "2026-01-25T11:00:00Z",
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "usr-admin-1",
    title: "Rekap Harian Siap Diselesaikan",
    message: "8 kantin telah selesai beroperasi hari ini. Total nilai transaksi mencapai Rp2.200.000.",
    type: "info",
    createdAt: "2026-01-25T12:30:00Z",
  },
  {
    id: "notif-2",
    userId: "usr-admin-1",
    title: "Top-up Berhasil",
    message: "Top-up saldo siswa Nurul Hidayah sebesar Rp100.000 sukses dicatat.",
    type: "success",
    createdAt: "2026-01-25T08:30:00Z",
  },
];

// Single state holder for live operation
class DataStore {
  private users: User[] = [...initialUsers];
  private canteens: Canteen[] = [...initialCanteens];
  private transactions: Transaction[] = [...initialTransactions];
  private topups: TopUpRecord[] = [];
  private settlements: MerchantSettlement[] = [...initialSettlements];
  private notifications: NotificationItem[] = [...initialNotifications];
  private classLeaderTopUpLogs: ClassLeaderTopUpLog[] = [];

  // Users
  getUsers(): User[] {
    return [...this.users];
  }

  getStudents(): User[] {
    return this.users.filter((u) => u.role === "student");
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
  }

  getUserByWhatsapp(whatsapp: string): User | undefined {
    const clean = whatsapp.replace(/\D/g, "");
    return this.users.find((u) => u.whatsappNumber.replace(/\D/g, "") === clean);
  }

  addStudent(student: Omit<User, "id" | "role" | "createdAt" | "updatedAt">): User {
    const newUser: User = {
      id: `usr-stu-${Date.now()}`,
      role: "student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...student,
    };
    this.users.unshift(newUser);
    return newUser;
  }

  updateCanteen(id: string, updates: Partial<Canteen>): Canteen | null {
    const index = this.canteens.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.canteens[index] = {
      ...this.canteens[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.canteens[index];
  }
  deleteStudent(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
  updateStudent(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[index];
  }

  // Canteens
  getCanteens(): Canteen[] {
    return [...this.canteens];
  }

  getCanteenById(id: string): Canteen | undefined {
    return this.canteens.find((c) => c.id === id);
  }

  addCanteen(canteen: Omit<Canteen, "id" | "createdAt" | "updatedAt" | "dailyTotal" | "dailyCount">): Canteen {
    const newCanteen: Canteen = {
      id: `canteen-${this.canteens.length + 1}`,
      dailyTotal: 0,
      dailyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...canteen,
    };
    this.canteens.push(newCanteen);
    return newCanteen;
  }

  // Transactions
  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getTransactionsByStudent(studentId: string): Transaction[] {
    return this.transactions.filter((t) => t.studentId === studentId);
  }

  getTransactionsByCanteen(canteenId: string): Transaction[] {
    return this.transactions.filter((t) => t.canteenId === canteenId);
  }

  // Top Up Operation (Server-side validation & Atomic update)
  topUp(studentId: string, amount: number, adminId: string): { success: boolean; message: string; topup?: TopUpRecord; user?: User } {
    if (amount <= 0) {
      return { success: false, message: "Nominal top up harus lebih besar dari 0" };
    }
    const student = this.getUserById(studentId);
    if (!student || student.role !== "student") {
      return { success: false, message: "Siswa tidak ditemukan" };
    }
    if (student.status !== "active") {
      return { success: false, message: "Akun siswa sedang dinonaktifkan" };
    }

    const admin = this.getUserById(adminId) || {
      id: "usr-admin-1",
      fullName: "Pengurus Koperasi Sekolah",
    };

    const previousBalance = student.balance;
    const newBalance = previousBalance + amount;
    student.balance = newBalance;
    student.updatedAt = new Date().toISOString();

    const txId = `tx-top-${Date.now()}`;
    const txRef = `TOP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    const transaction: Transaction = {
      id: txId,
      referenceNumber: txRef,
      studentId: student.id,
      studentName: student.fullName,
      studentNis: student.studentId,
      type: "topup",
      amount: amount,
      status: "success",
      description: `Top up saldo via Koperasi Sekolah oleh ${admin.fullName}`,
      createdAt: new Date().toISOString(),
    };
    this.transactions.unshift(transaction);

    const topUpRecord: TopUpRecord = {
      id: `rec-${Date.now()}`,
      transactionId: txId,
      studentId: student.id,
      studentName: student.fullName,
      studentNis: student.studentId || "-",
      adminId: admin.id,
      adminName: admin.fullName,
      amount: amount,
      previousBalance: previousBalance,
      newBalance: newBalance,
      createdAt: new Date().toISOString(),
    };
    this.topups.unshift(topUpRecord);

    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: student.id,
      title: "Top-up Saldo Berhasil",
      message: `Saldo sebesar Rp${amount.toLocaleString("id-ID")} berhasil ditambahkan. Saldo saat ini: Rp${newBalance.toLocaleString("id-ID")}`,
      type: "success",
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `Top up Rp${amount.toLocaleString("id-ID")} untuk ${student.fullName} berhasil!`,
      topup: topUpRecord,
      user: student,
    };
  }

  // Payment Operation (Server-side atomic transaction)
  processPayment(
    studentId: string,
    canteenId: string,
    amount: number,
    description?: string
  ): { success: boolean; message: string; transaction?: Transaction; remainingBalance?: number } {
    if (amount <= 0) {
      return { success: false, message: "Nominal pembayaran tidak valid" };
    }

    const student = this.getUserById(studentId);
    if (!student || student.role !== "student") {
      return { success: false, message: "Identitas siswa tidak valid" };
    }

    if (student.status !== "active") {
      return { success: false, message: "Akun siswa tidak aktif" };
    }

    if (student.balance < amount) {
      return {
        success: false,
        message: `Saldo tidak mencukupi. Saldo Anda Rp${student.balance.toLocaleString("id-ID")}, dibutuhkan Rp${amount.toLocaleString("id-ID")}`,
      };
    }

    const canteen = this.getCanteenById(canteenId);
    if (!canteen) {
      return { success: false, message: "Kantin tujuan tidak ditemukan" };
    }

    // Atomic execution
    student.balance -= amount;
    student.updatedAt = new Date().toISOString();

    canteen.dailyTotal += amount;
    canteen.dailyCount += 1;
    canteen.updatedAt = new Date().toISOString();

    const txRef = `KP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      referenceNumber: txRef,
      studentId: student.id,
      studentName: student.fullName,
      studentNis: student.studentId,
      canteenId: canteen.id,
      canteenName: canteen.name,
      type: "payment",
      amount: amount,
      status: "success",
      description: description || `Pembayaran di ${canteen.name} (${canteen.ownerName})`,
      createdAt: new Date().toISOString(),
    };
    this.transactions.unshift(transaction);

    // Update settlement record for this canteen
    const stl = this.settlements.find((s) => s.canteenId === canteen.id);
    if (stl) {
      stl.totalAmount += amount;
      stl.transactionCount += 1;
    }

    return {
      success: true,
      message: `Pembayaran sebesar Rp${amount.toLocaleString("id-ID")} di ${canteen.name} berhasil!`,
      transaction: transaction,
      remainingBalance: student.balance,
    };
  }

  // Settlements
  getSettlements(): MerchantSettlement[] {
    return [...this.settlements];
  }

  updateSettlementStatus(id: string, status: "pending" | "processing" | "settled", adminId: string): MerchantSettlement | null {
    const stl = this.settlements.find((s) => s.id === id);
    if (!stl) return null;
    stl.status = status;
    if (status === "settled") {
      stl.settledAt = new Date().toISOString();
      stl.processedBy = adminId;
    }
    return stl;
  }

  // Analytics & KPIs
  getKPIs() {
    const students = this.getStudents();
    const totalStudents = students.length;
    const totalStudentBalance = students.reduce((acc, curr) => acc + curr.balance, 0);
    const payments = this.transactions.filter((t) => t.type === "payment" && t.status === "success");
    const totalTransactions = payments.length;
    const totalTransactionValue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalStudents,
      totalStudentBalance,
      totalTransactions,
      totalTransactionValue,
    };
  }

  // Notifications
  getNotifications(): NotificationItem[] {
    return [...this.notifications];
  }

  // Class Leader Top-Up Logs
  getClassLeaderTopUpLogs(): ClassLeaderTopUpLog[] {
    return [...this.classLeaderTopUpLogs];
  }

  getPendingClassLeaderTopUps(): ClassLeaderTopUpLog[] {
    return this.classLeaderTopUpLogs.filter((log) => log.status === "pending");
  }

  createClassLeaderTopUpLog(data: Omit<ClassLeaderTopUpLog, "id" | "createdAt">): ClassLeaderTopUpLog {
    const newLog: ClassLeaderTopUpLog = {
      id: `cltop-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.classLeaderTopUpLogs.unshift(newLog);

    // Create notification for admin
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: "usr-admin-1", // Admin user ID
      title: "Permintaan Top-Up dari Ketua Kelas",
      message: `${data.classLeaderName} (Kelas ${data.className}) mengajukan top-up sebesar Rp${data.amount.toLocaleString("id-ID")} untuk ${data.targetStudentName} (NIS: ${data.targetStudentNis})`,
      type: "info",
      createdAt: new Date().toISOString(),
    });

    return newLog;
  }

  approveClassLeaderTopUp(logId: string, adminId: string): { success: boolean; message: string; log?: ClassLeaderTopUpLog } {
    const log = this.classLeaderTopUpLogs.find((l) => l.id === logId);
    if (!log) {
      return { success: false, message: "Log tidak ditemukan" };
    }

    if (log.status !== "pending") {
      return { success: false, message: "Log sudah diproses sebelumnya" };
    }

    // Get target student
    const student = this.getUserById(log.targetStudentId);
    if (!student || student.role !== "student") {
      return { success: false, message: "Siswa tidak ditemukan" };
    }

    // Update student balance
    student.balance += log.amount;
    student.updatedAt = new Date().toISOString();

    // Update log status
    log.status = "approved";
    log.approvedBy = adminId;
    log.approvedAt = new Date().toISOString();

    // Create notification for student
    this.notifications.unshift({
      id: `notif-${Date.now()}-student`,
      userId: student.id,
      title: "Top-Up Saldo Berhasil",
      message: `Saldo sebesar Rp${log.amount.toLocaleString("id-ID")} berhasil ditambahkan oleh ketua kelas ${log.classLeaderName}. Saldo saat ini: Rp${student.balance.toLocaleString("id-ID")}`,
      type: "success",
      createdAt: new Date().toISOString(),
    });

    // Create notification for class leader
    const classLeader = this.getUserById(log.classLeaderId);
    if (classLeader) {
      this.notifications.unshift({
        id: `notif-${Date.now()}-leader`,
        userId: classLeader.id,
        title: "Top-Up Disetujui",
        message: `Top-up untuk ${log.targetStudentName} sebesar Rp${log.amount.toLocaleString("id-ID")} telah disetujui oleh koperasi.`,
        type: "success",
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      message: `Top-up untuk ${log.targetStudentName} sebesar Rp${log.amount.toLocaleString("id-ID")} berhasil disetujui!`,
      log,
    };
  }

  rejectClassLeaderTopUp(logId: string, adminId: string, reason?: string): { success: boolean; message: string; log?: ClassLeaderTopUpLog } {
    const log = this.classLeaderTopUpLogs.find((l) => l.id === logId);
    if (!log) {
      return { success: false, message: "Log tidak ditemukan" };
    }

    if (log.status !== "pending") {
      return { success: false, message: "Log sudah diproses sebelumnya" };
    }

    // Update log status
    log.status = "rejected";
    log.approvedBy = adminId;
    log.approvedAt = new Date().toISOString();
    if (reason) {
      log.rejectionReason = reason;
    }

    // Create notification for class leader
    const classLeader = this.getUserById(log.classLeaderId);
    if (classLeader) {
      this.notifications.unshift({
        id: `notif-${Date.now()}-leader`,
        userId: classLeader.id,
        title: "Top-Up Ditolak",
        message: `Top-up untuk ${log.targetStudentName} sebesar Rp${log.amount.toLocaleString("id-ID")} ditolak oleh koperasi.${reason ? ` Alasan: ${reason}` : ""}`,
        type: "error",
        createdAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      message: `Top-up untuk ${log.targetStudentName} berhasil ditolak.`,
      log,
    };
  }
}

// Global singleton pattern to prevent resets during HMR in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __kantinpayStore: DataStore | undefined;
}

export const store = global.__kantinpayStore || new DataStore();
if (process.env.NODE_ENV !== "production") {
  global.__kantinpayStore = store;
}


