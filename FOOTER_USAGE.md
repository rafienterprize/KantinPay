# Cara Menggunakan Footer Baru

Footer baru sudah dibuat di `src/components/ui/Footer.tsx`

## Cara Implementasi di page.tsx:

### 1. Import Footer di bagian atas file `src/app/page.tsx`:

Tambahkan import ini di baris sekitar 24-25 (setelah import lainnya):

```tsx
import { Footer } from "@/components/ui/Footer";
```

### 2. Ganti footer lama dengan footer baru

Cari bagian footer di akhir file (sekitar baris 1070-1178), lalu ganti dengan:

```tsx
      {/* =========================================================================
          11. FOOTER
         ========================================================================= */}
      <Footer scrollTo={scrollTo} />
    </div>
  );
}
```

## Atau jika ingin manual:

Cari bagian yang dimulai dengan:
```tsx
      {/* =========================================================================
          11. FOOTER — CTA Banner + Links + Copyright
         ========================================================================= */}
      <footer className="bg-gradient-to-b from-white to-[#EBF7FF]"...
```

Sampai ke penutup:
```tsx
        {/* Dark Bottom Bar */}
        <div className="h-2 bg-slate-900" />
      </footer>
    </div>
  );
}
```

Ganti semua bagian footer tersebut dengan:
```tsx
      <Footer scrollTo={scrollTo} />
    </div>
  );
}
```

## Fitur Footer Baru:

✅ **CTA Banner** dengan gradient biru yang menarik dan teks "Mulai Gunakan KantinPay Hari Ini"
✅ **Logo KantinPay** menggunakan logo-icon.png
✅ **4 Kolom Footer** (Logo, Fitur, Catatan Koperasi, Contact)
✅ **Copyright Bar** di bagian bawah
✅ **Smooth scroll** terintegrasi dengan navigasi
✅ **Responsive design** untuk mobile dan desktop
✅ **Animasi** pada CTA icon menggunakan Framer Motion

## Desain:
- Background gradient dari putih ke slate-50
- CTA Banner dengan gradient cyan ke biru (#5CC0F7 to #38bdf8)
- Typography menggunakan font heading yang sudah ada
- Spacing dan padding yang konsisten
