# KantinPay — School Digital Payment Ecosystem

**KantinPay** adalah ekosistem pembayaran digital tertutup (*closed-loop payment system*) yang dirancang khusus untuk lingkungan sekolah. Sistem ini hadir sebagai alternatif praktis bagi siswa yang sering terkendala kuota reguler internet saat jam istirahat sekolah, mendukung akses melalui portal Website modern dan integrasi WhatsApp Bot.

---

## 🏗️ Arsitektur & Pemisahan Modular

Sesuai instruksi pengembangan, kode dan modul disusun secara terpisah (*decoupled architecture*):

1. **Database Layer (`src/lib/db/` & `src/services/`)**:
   - Sumber kebenaran tunggal (*single source of truth*) yang mendukung **Neon PostgreSQL** melalui Drizzle ORM.
   - Menyediakan integritas transaksi atomik ACID, pencegahan saldo negatif, validasi sisi server, dan catatan riwayat audit yang kekal (*immutable audit trails*).
   - Dilengkapi in-memory fallback store siap uji dengan 10 siswa aktif, 8 kantin resmi, riwayat transaksi, dan rekap harian settlement.

2. **Landing Page & Public Website (`src/app/` & `src/components/landing/`)**:
   - Mengadaptasi estetika visual Deflexai SaaS: *floating pill navbar*, *orbit-style decorations*, kartu preview saldo realtime, visualisasi paket WhatsApp bot, dan informasi ekosistem 8 kantin.
   - Halaman Autentikasi (`/login`) dengan pemilih peran (*Role Picker*), validasi kredensial, dan perlindungan rute berbasis peran.

3. **Admin / Cooperative Dashboard (`src/app/admin/`)**:
   - Layout bersama (*Shared Admin Layout*) dengan desktop sidebar dan mobile bottom tab bar.
   - **Dashboard Utama (`/admin`)**: Salam pengurus, 4 KPI finansial, 2 Quick Actions, dan grafik aktivitas transaksi harian.
   - **Manajemen Siswa (`/admin/students`)**: Tabel data 10 siswa, filter kelas/status/saldo, pagination, modal pendaftaran siswa baru, dan modal eksekusi **Top Up Saldo** tunai koperasi dengan validasi server.
   - **Manajemen Tenant (`/admin/tenants`)**: Kartu 8 unit kantin sekolah, toggle *Box/List view*, monitoring penjualan harian, modal tambah tenant, serta integrasi *Invite Vendor WhatsApp*.
   - **Rekap & Settlement (`/admin/settlement`)**: Monitoring rekap harian 8 kantin, status *Pending / Processing / Settled*, dan aksi pencairan dana sore hari.

4. **Modul WhatsApp Bot (`src/bot/`)**:
   - Dibuat dalam modul terpisah (`src/bot/`) dan webhook handler terisolasi (`src/app/api/whatsapp/`).
   - Sesuai arahan pengguna, implementasi skrip interaksi WhatsApp Bot dikembangkan pada fase khusus tersendiri setelah modul website, landing page, dan admin dashboard selesai secara solid.

---

## 🎨 Identitas Visual & Tipografi

- **Palet Warna Utama**:
  - `Primary Blue`: `#5CC0F7`
  - `White Blue`: `#D6EFFF`
  - `White`: `#FFFFFF`
  - `Grey`: `#D1D1D1`
- **Tipografi**:
  - Headings & Navigasi: **Fredoka** (Google Fonts)
  - Isi & Form: **Balsamiq Sans** (Google Fonts)
- **Ikonografi**: Lucide React

---

## 🔑 Akun Demo Pengujian

Anda dapat langsung menguji aplikasi menggunakan kredensial bawaan berikut:

| Peran Akun | Email / Username | Kata Sandi | Halaman Tujuan |
|---|---|---|---|
| **Pengurus Koperasi (Admin)** | `admin@kantinpay.sch.id` | `admin123` | `/admin` |
| **Siswa (Ahmad Rifai - XII SIJA 1)** | `ahmad@kantinpay.sch.id` | `password123` | `/student` |
| **Merchant (Kantin 1 - Bu Nur)** | `kantin1@kantinpay.sch.id` | `password123` | `/merchant` |

---

## 🚀 Menjalankan Aplikasi

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

2. **Konfigurasi Database (Opsional)**:
   Salin `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Masukkan `DATABASE_URL` dari project Neon PostgreSQL Anda. Jika belum diisi, sistem otomatis berjalan dengan in-memory state yang tersimpan selama server aktif.

3. **Jalankan Mode Pengembangan**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

4. **Build Produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📱 Responsivitas Mobile

- **Desktop**: *Floating Pill Navbar* di bagian atas untuk landing page, serta *Admin Sidebar* vertikal di panel koperasi.
- **Mobile / Smartphone**: *Native Bottom Tab Bar* 5 tombol yang ergonomis dan mendukung *safe-area-inset-bottom*.
