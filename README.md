# Analisis Ekonomi Library - PDF Reader

Proyek ini adalah sebuah aplikasi web ringan bergaya editorial premium (*library reader*) yang dirancang khusus untuk membaca, mencari, dan menampilkan hasil analisis dari dokumen PDF (seperti Analisis Makroekonomi, Cost Effectiveness Analysis, dll). Aplikasi ini menampilkan struktur teks secara interaktif layaknya membaca artikel blog yang profesional.

## ✨ Fitur Utama

- **Tipografi Editorial Premium:** Dirancang menggunakan Tailwind Typography dengan kombinasi *font* modern (Sans-Serif untuk paragraf dan Serif untuk judul). Paragraf dibuat nyaman untuk dibaca dengan jarak baris (*line-height*) ekstra, serta tata letak tabel yang rapi.
- **Ekstraksi PDF Pintar:** Menggunakan *script* Python (`pymupdf4llm`) yang secara akurat mengekstrak struktur teks, tabel, dan halaman dari file PDF tanpa merusak format aslinya.
- **Fitur Pencarian dalam Dokumen:** Anda dapat mencari kata spesifik di dalam teks. Aplikasi akan menandai (*highlight*) kata yang dicari, dan menekan `Enter` akan secara mulus menggulir (*scroll*) otomatis dari satu kata ke kata lainnya.
- **Deteksi Elemen Dinamis:** Sistem JavaScript secara cerdas mendeteksi Nama Penulis (Author) dan Judul untuk memposisikannya tepat di tengah (*Center*) tanpa merusak format tulisan utama.
- **Performa Sangat Cepat:** Menggunakan Vanilla JavaScript dan Vite. Tidak ada beban *framework* berat, sehingga memuat dokumen besar terasa instan.

## 📂 Struktur Direktori

```text
landingPDF/
├── public/               
│   └── data/             # Output JSON dari proses ekstraksi PDF
├── src/                  
│   ├── main.js           # Logika interaktivitas website, rendering Markdown, dan fitur pencarian
│   └── style.css         # Import file Tailwind CSS
├── src-pdf/              # Letakkan file PDF mentah Anda di sini
├── extract.py            # Script Python untuk mengubah PDF menjadi JSON + Markdown
├── index.html            # Halaman utama (Antarmuka Pengguna)
├── package.json          # Konfigurasi dependensi Node.js
└── tailwind.config.js    # Konfigurasi kustom untuk Tailwind & Tipografi
```

## 🛠️ Persyaratan Sistem

Untuk menjalankan dan memodifikasi proyek ini, Anda memerlukan:
1. **Node.js & npm** (Untuk menjalankan *server* website dan Tailwind CSS).
2. **Python 3.x** (Hanya diperlukan jika Anda ingin mengekstrak/menambahkan file PDF baru).

## 🚀 Cara Menjalankan Website (Frontend)

Jika Anda hanya ingin menjalankan dan melihat website:

1. Buka terminal (*Command Prompt / VS Code Terminal*).
2. Pastikan Anda berada di direktori proyek (`landingPDF`).
3. Instal dependensi (*hanya perlu dilakukan sekali pertama kali*):
   ```bash
   npm install
   ```
4. Jalankan *Development Server* Vite:
   ```bash
   npm run dev
   ```
5. Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`) di *browser* Anda.

## 📄 Cara Menambahkan PDF Baru

Jika Anda memiliki file PDF baru yang ingin ditambahkan ke dalam daftar bacaan di web:

1. Masukkan file `.pdf` Anda ke dalam folder `src-pdf/`.
2. Buka terminal dan instal *library* ekstraksi (*hanya perlu sekali*):
   ```bash
   pip install pymupdf4llm pymupdf
   ```
3. Jalankan script ekstraksi:
   ```bash
   python extract.py
   ```
   *Script ini otomatis membaca seluruh PDF di dalam `src-pdf/`, merapikan tabel & teksnya, dan menyimpannya sebagai file `.json` di dalam folder `public/data/`.*
4. Buka file `index.html`.
5. Di bagian `<!-- Navigation Menu -->` (Sekitar baris ke-36), tambahkan tag `<a>` baru untuk dokumen Anda. Pastikan bagian `data-doc-id="nama_file_json_anda_tanpa_ekstensi"` sesuai dengan nama file JSON yang baru saja terbuat.
6. Simpan (`Ctrl` + `S`), dan dokumen PDF Anda sudah bisa dibaca di web!

## 🖌️ Penyesuaian Tampilan (Styling)

- Keseluruhan desain diatur menggunakan kelas dari [Tailwind CSS](https://tailwindcss.com/).
- Untuk mengubah gaya penulisan dokumen (seperti font, spasi, warna border tabel), Anda bisa mengedit kelas `prose-...` di dalam atribut `class` pada elemen `<div id="text-container">` di `index.html`.
- Konfigurasi plugin tipografi telah aktif di `tailwind.config.js`.

---
*Dibuat khusus untuk menampilkan dokumen analitik secara premium dan interaktif.*
