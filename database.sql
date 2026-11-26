-- Skema Basis Data Aplikasi Jurnal PKL
-- Sesuai PRD & Studi Kasus Paket 3

CREATE TABLE IF NOT EXISTS public.siswa (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama text NOT NULL CHECK (char_length(trim(nama)) BETWEEN 3 AND 40),
  kelas text NOT NULL CHECK (char_length(trim(kelas)) > 0),
  tempat_pkl text NOT NULL CHECK (char_length(trim(tempat_pkl)) > 0),
  pembimbing text NOT NULL CHECK (char_length(trim(pembimbing)) > 0),
  kode text NOT NULL UNIQUE CHECK (kode ~ '^[A-Z0-9-]{6,12}$')
);

CREATE TABLE IF NOT EXISTS public.jurnal (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  siswa_id bigint NOT NULL REFERENCES public.siswa(id) ON DELETE RESTRICT,
  tanggal date NOT NULL CHECK (
    tanggal <= (now() AT TIME ZONE 'Asia/Jakarta')::date
    AND tanggal >= ((now() AT TIME ZONE 'Asia/Jakarta')::date - 7)
  ),
  kegiatan text NOT NULL CHECK (char_length(trim(kegiatan)) BETWEEN 30 AND 500),
  kompetensi text NOT NULL CHECK (char_length(trim(kompetensi)) BETWEEN 3 AND 60),
  durasi_jam integer NOT NULL CHECK (durasi_jam BETWEEN 1 AND 10),
  status text NOT NULL DEFAULT 'diajukan' CHECK (status IN ('diajukan', 'disetujui', 'revisi')),
  catatan text CHECK (
    status <> 'revisi'
    OR (catatan IS NOT NULL AND char_length(trim(catatan)) >= 5)
  ),
  dibuat timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT jurnal_siswa_tanggal_unique UNIQUE (siswa_id, tanggal)
);

-- Row Level Security (RLS) aktif pada semua tabel
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal ENABLE ROW LEVEL SECURITY;

-- Cabut seluruh hak akses kunci publik (anon & authenticated)
REVOKE ALL ON TABLE public.siswa FROM anon, authenticated;
REVOKE ALL ON TABLE public.jurnal FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- Data contoh minimal: 5 siswa fiktif dengan kode unik
INSERT INTO public.siswa (nama, kelas, tempat_pkl, pembimbing, kode) VALUES
  ('Aditya Pratama', 'XI RPL 1', 'PT Kreasi Digital', 'Bu Rina Wulandari', 'PKL-X7N2A'),
  ('Nadia Putri', 'XI RPL 1', 'CV Teknologi Nusantara', 'Bu Rina Wulandari', 'PKL-B4K8P'),
  ('Bima Saputra', 'XI RPL 2', 'PT Solusi Media', 'Bu Rina Wulandari', 'PKL-M6R3T'),
  ('Salsabila Rahma', 'XI RPL 2', 'CV Teknologi Nusantara', 'Bu Rina Wulandari', 'PKL-Q9L5D'),
  ('Rafi Ramadhan', 'XI RPL 1', 'PT Kreasi Digital', 'Bu Rina Wulandari', 'PKL-H2W7F');

-- Data contoh minimal: 12 jurnal dengan kombinasi status diajukan, disetujui, dan revisi
INSERT INTO public.jurnal (siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan) VALUES
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-X7N2A'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date,
    'Mengembangkan halaman profil pengguna dengan formulir ubah data dan validasi input pada aplikasi.',
    'Pengembangan antarmuka web',
    7,
    'diajukan',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-X7N2A'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 1,
    'Membangun halaman dashboard ringkasan aktivitas PKL dan integrasi komponen kartu statistik.',
    'Pengembangan antarmuka web',
    7,
    'disetujui',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-X7N2A'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 2,
    'Mendesain struktur database aplikasi menggunakan relasi antar tabel serta constraint validasi.',
    'Perancangan basis data',
    7,
    'disetujui',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-X7N2A'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 3,
    'Membuat validasi formulir pendaftaran pengguna agar menampilkan pesan galat per kolom secara jelas.',
    'Validasi data dan penanganan galat',
    7,
    'diajukan',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-X7N2A'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 4,
    'Menguji fitur autentikasi pengguna menggunakan sesi cookie dan mencatat skenario pengujian.',
    'Pengujian perangkat lunak',
    7,
    'revisi',
    'Lengkapi hasil pengujian dan jelaskan kendala yang ditemukan.'
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-B4K8P'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date,
    'Membuat desain halaman katalog produk responsif untuk tampilan desktop maupun perangkat seluler.',
    'Desain antarmuka responsif',
    6,
    'diajukan',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-B4K8P'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 1,
    'Mengimplementasikan filter pencarian kategori pada daftar produk menggunakan query parameter URL.',
    'Pemrograman web dinamis',
    8,
    'disetujui',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-M6R3T'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date,
    'Melakukan pengujian fitur pencarian data dan memverifikasi kesesuaian hasil dengan basis data.',
    'Pengujian fungsional aplikasi',
    7,
    'diajukan',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-M6R3T'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 2,
    'Memperbaiki bug tampilan tabel yang terpotong pada layar kecil dan merapikan jarak antar elemen.',
    'Perbaikan antarmuka pengguna',
    6,
    'revisi',
    'Sertakan nama halaman yang diperbaiki agar lebih spesifik.'
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-Q9L5D'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 1,
    'Menyiapkan skrip migrasi tabel pengguna dan melakukan uji coba pengisian data awal fiktif.',
    'Administrasi basis data',
    7,
    'disetujui',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-Q9L5D'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 3,
    'Menyusun dokumentasi alur API server untuk proses login dan pengelolaan data harian.',
    'Dokumentasi teknis sistem',
    5,
    'diajukan',
    NULL
  ),
  (
    (SELECT id FROM public.siswa WHERE kode = 'PKL-H2W7F'),
    (now() AT TIME ZONE 'Asia/Jakarta')::date - 1,
    'Mengoptimalkan query pengambilan rekap data agar waktu muat halaman dashboard lebih cepat.',
    'Optimasi query basis data',
    8,
    'disetujui',
    NULL
  );
