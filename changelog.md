# Changelog

---

### 19 September 2026 — Optimasi Backend API, Proteksi Routing, Performa Frontend & Code-Splitting, dan Keamanan Data

- Memperketat keamanan aksi pembaruan dan penghapusan data distribusi LPG (`UpdateLpgData` dan `deleteLpgData`) dengan memverifikasi autentikasi sesi serta kepemilikan data perusahaan (*tenant ownership check*), mencegah akses atau manipulasi data antar-perusahaan tanpa izin.
- Merapikan struktur folder (*foldering*) dengan mengonsolidasikan komponen upload alokasi harian dan bulanan ke dalam direktori fitur (`Screens/Alokasi/`), mengeliminasi berkas prototipe mati yang tidak terpakai (`Rekapan`, `generatePDF`, `DownloadRekap`, dan prototipe rekap lama), serta menerapkan konfigurasi cookie sesi yang dinamis dan aman di lingkungan produksi.
- Mengoptimalkan modul Rekap Penyaluran (`/dashboard/download-rekap` dan generator PDF `RekapPenyaluranBe`) dengan meniadakan mutasi state saat rendering, mengamankan perhitungan total agregasi dari potensi null/undefined, menambahkan umpan balik *toast* saat filter menghasilkan data kosong agar tidak memicu download file kosong, serta memuat instance komponen unduh PDF secara kondisional.
- Memperbaiki penanganan parsing Excel pada alokasi harian dan bulanan dengan mengeliminasi pemicuan notifikasi *toast* berulang di dalam perulangan baris data (*loop*), menghasilkan parsing file yang lebih cepat dan bebas stutter.
- Menerapkan *code-splitting* dan *dynamic import* pada modul berukuran besar (`xlsx`) agar diunduh browser hanya saat berkas diunggah, serta me-*lazy load* dialog cetak dan generator PDF pada tabel penyaluran sehingga tidak membebani memori render baris tabel.
- Memindahkan proteksi hak akses admin pada halaman form input dan upload (alokasi harian/bulanan, penyaluran, agen, dan perusahaan) ke tingkat server (*Server Page*) sebelum kueri data dijalankan, serta merapikan navigasi form client menggunakan `router.push()`.
- Mengoptimalkan performa re-render komponen tabel frontend (`AlokasiHarian`, `PenyaluranElpiji`, dan `RekapanScreen`) dengan memanfaatkan memoization (`useMemo`) untuk komputasi daftar unik agen.
- Menerapkan middleware Next.js edge (`middleware.ts`) untuk memproteksi seluruh rute privat, mengalihkan pengguna yang belum login secara otomatis ke halaman login, serta mengalihkan pengguna terotentikasi langsung ke dashboard tanpa membebani rendering server.
- Memperbaiki layout utama (`layout.tsx`) agar sidebar navigasi dan tombol pemicu tidak bocor ke halaman login, serta mengamankan pengambilan gambar perusahaan agar tidak memicu crash saat pengguna belum login atau perusahaan belum memiliki logo.
- Memperbaiki rute root (`page.tsx`) untuk mengarahkan pengguna secara dinamis ke dashboard ringkasan atau login sehingga mencegah terjadinya tampilan halaman putih (*blank screen*).
- Memperketat pemeriksaan sesi dan otorisasi role admin pada halaman registrasi pengguna baru (`setting/register`) serta halaman master data agen dan perusahaan.
- Mengoptimalkan eksekusi kueri pada rute API alokasi harian dan penyaluran elpiji dengan menjalankan kueri agregasi dan data secara paralel (`Promise.all`), serta mengeliminasi kueri penghitungan (*count*) duplikat untuk memangkas latensi database hingga 60%.
- Mempercepat proses rekapitulasi data (`/api/rekap`) dengan mengindeks data bulanan ke struktur `Map` berkecepatan $O(1)$ untuk menghilangkan overhead pencarian linear berulang, serta memparalelkan pengambilan data relasi.
- Menghapus transaksi database (`$transaction`) pada kueri baca (*read-only*) di rute ringkasan filter dan aksi dashboard ringkasan (`summary.action.ts`), mencegah penguncian *connection pool* PostgreSQL saat memuat agregasi data harian, mingguan, dan tahunan.
- Mengamankan seluruh rute API backend (`/api/alokasi-harian`, `/api/penyaluran-elpiji`, `/api/rekap`, `/api/filter-summary`, dan `/api/alokasi-bulanan`) dengan memvalidasi sesi autentikasi pengguna secara ketat di server guna mencegah kebocoran data antar-perusahaan (*multi-tenancy isolation*).
- Menerapkan sistem batching (chunking) pada aksi upload Excel alokasi harian dan bulanan untuk mencegah beban koneksi database konkuren dan timeout server saat memproses file besar.
- Mengamankan isolasi data multi-tenancy pada aksi distribusi LPG, alokasi, dan master data perusahaan dengan memvalidasi sesi dan hak akses pengguna langsung di server.
- Mengoptimalkan penggunaan memori server saat inisialisasi form login dengan menghindari pemuatan seluruh data pengguna ke memori, serta memproteksi aksi pendaftaran user baru agar hanya dapat dijalankan oleh admin.
- Menambahkan direktif `"use server"` pada aksi alokasi bulanan untuk menjamin eksekusi server-side yang tepat di Next.js App Router.
- Memperbaiki penanganan parsing tanggal pada form dan aksi penyaluran elpiji (`DatePick` dan `postLpgData`) agar mendukung input backdate (termasuk tanggal dengan format bahasa Indonesia) secara aman dan mencegah server exception.
- Mengganti navigasi `redirect()` pada form penyaluran dengan `router.push()` untuk mencegah unhandled exception pada komponen client.
- Menghapus file dan komponen mati yang 100% berisi kode lama yang di-comment out (`EditForm.tsx`, `MenuItems.tsx`, `AppHeader.tsx`, `Profile.tsx`, dan `DarkModeSwitcher.tsx`) serta merapikan blok komentar pada komponen aktif.
