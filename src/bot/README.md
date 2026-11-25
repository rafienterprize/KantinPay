# KantinPay WhatsApp Bot Architecture (Separated Module)

Modul ini dikhususkan untuk integrasi **WhatsApp Bot KantinPay** yang dirancang modular dan terpisah dari frontend landing page maupun core web dashboard.

## Arsitektur Modular

1. **Pemisahan Modul**:
   - Skrip bot WA diletakkan secara terisolasi agar dapat dijalankan sebagai layanan microservice mandiri, serverless webhook handler (`/api/whatsapp/webhook`), atau daemon Node.js.
   - Sesuai arahan, implementasi logika interaksi WhatsApp Bot dikembangkan pada fase khusus tersendiri setelah modul website, landing page, dan admin dashboard selesai secara solid.

2. **Integrasi Database Bersama**:
   - WhatsApp Bot dan Website menggunakan database yang sama (Neon PostgreSQL) melalui service layer terpusat (`src/services/`):
     - `payment.service.ts` -> Eksekusi pembayaran kantin secara atomik
     - `balance.service.ts` -> Pengecekan saldo siswa
     - `transaction.service.ts` -> Riwayat transaksi
     - `user.service.ts` -> Pemetaan nomor WhatsApp ke akun siswa

3. **Perintah Utama (Akan diimplementasikan pada Fase Bot)**:
   - `MENU`: Menampilkan menu opsi KantinPay
   - `SALDO`: Cek saldo akun siswa saat ini
   - `BAYAR`: Melakukan transaksi pembayaran ke salah satu dari 8 kantin
   - `RIWAYAT`: Cek 5 transaksi terakhir
   - `BANTUAN`: Panduan dan kontak pengurus koperasi sekolah
