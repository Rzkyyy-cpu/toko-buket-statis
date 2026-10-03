# inayah.store — website

Situs statis (HTML/CSS/JS) + panel admin Decap CMS. Di-host di Vercel, tanpa database dan tanpa proses build.

## Mengubah isi (lewat panel admin)
Buka `https://<domain-kamu>/admin/`, login dengan GitHub, lalu edit:
- **Produk**: buket, kue, papan ucapan (nama, harga, foto, tampil/sembunyi)
- **Ulasan**: ulasan pelanggan
- **Pengaturan situs**: kontak WA, email, alamat, jam buka, teks beranda dan "Tentang kami"

Klik **Publish**. Perubahan jadi commit di GitHub, lalu Vercel deploy otomatis (sekitar 1 menit).

## Struktur
- `content/situs.json`, `content/produk.json`, `content/ulasan.json`: isi situs (diedit panel admin)
- `assets/img/products/`: foto produk (upload lewat panel admin)
- `admin/`: panel admin (Decap CMS) dan konfigurasinya
- `api/auth.js`, `api/callback.js`: login GitHub untuk panel admin (Vercel Functions)
- Warna dan font: bagian `:root` di `assets/css/style.css`

## Setup login admin (sekali saja)
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://<domain-kamu>`
   - Authorization callback URL: `https://<domain-kamu>/api/callback`
2. Salin Client ID, lalu buat Client secret.
3. Vercel → project → Settings → Environment Variables: isi `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET`, lalu Redeploy.

Hanya akun GitHub yang punya akses tulis ke repo ini yang bisa menyimpan perubahan.

## Coba di laptop
Data dimuat dengan `fetch`, jadi jangan buka `index.html` dengan klik dua kali. Pakai Live Server di VS Code.
Untuk panel admin lokal: jalankan `npx decap-server` di folder ini, lalu buka `http://localhost:5501/admin/` (login tanpa GitHub, perubahan langsung ke file).

## Catatan
- Pembayaran tidak diproses di situs. Tombol pesan membuka WhatsApp dengan pesan yang sudah terisi.
- Panduan untuk asisten AI (hemat token): `PROJECT.assist`.
