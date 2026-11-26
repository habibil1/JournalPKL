import Link from 'next/link';
import { ArrowRight, BookOpen, Check, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

const LANGKAH_KERJA = [
  {
    nomor: '01',
    judul: 'Masuk dengan kode siswa',
    deskripsi: 'Gunakan kode pribadi yang diberikan oleh guru pembimbing.',
  },
  {
    nomor: '02',
    judul: 'Ceritakan kegiatanmu',
    deskripsi: 'Tulis kegiatan, kompetensi yang dipelajari, dan durasi PKL setiap hari.',
  },
  {
    nomor: '03',
    judul: 'Dapatkan arahan',
    deskripsi: 'Pembimbing meninjau jurnal dan memberi persetujuan atau catatan revisi.',
  },
];

export default function BerandaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border-subtle bg-surface/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen className="h-4.5 w-4.5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              jurnal <span className="text-xs font-semibold uppercase tracking-wider text-primary">PKL</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hidden sm:inline text-primary font-semibold">
              Beranda
            </Link>
            <Link href="#cara-kerja" className="hidden sm:inline hover:text-primary transition-colors">
              Cara kerja
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors">
              Masuk admin
            </Link>
            <Link
              href="/masuk"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Masuk siswa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:items-center lg:py-16">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block rounded-full bg-accent-soft px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Ruang tumbuh selama PKL
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-tight">
              Langkah kecil hari ini. Bekal besar esok hari.
            </h1>

            <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
              Catat pengalaman, pantau perkembangan, dan terhubung dengan guru
              pembimbing. Semua dalam satu jurnal digital.
            </p>

            <div className="space-y-3 pt-1">
              <Link
                href="/masuk"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Mulai tulis jurnal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs text-slate-500">
                Masuk dengan kode siswa dari pembimbing.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Lebih rapi
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Mudah dipantau
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Aman &amp; pribadi
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border-subtle bg-accent-soft/75 p-5 sm:p-7 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Jurnal harianmu, lebih terarah
              </p>

              <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-xs space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Jurnal saya</h2>
                  <p className="text-xs text-slate-500">Selasa, 24 November 2026</p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-primary">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Total waktu belajar</p>
                    <p className="text-xl font-bold text-slate-900">84 jam</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle px-3.5 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        Membangun halaman dashboard
                      </p>
                      <p className="text-xs text-slate-500">24 Nov 2026 • 7 jam</p>
                    </div>
                    <StatusBadge status="disetujui" />
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle px-3.5 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        Mendesain struktur database
                      </p>
                      <p className="text-xs text-slate-500">23 Nov 2026 • 7 jam</p>
                    </div>
                    <StatusBadge status="disetujui" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-panel-dark px-4 py-3 text-sm text-white">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>Setiap pengalaman layak dicatat.</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="cara-kerja"
          className="border-t border-border-subtle bg-surface py-12 sm:py-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Dari kegiatan jadi perkembangan.
              </h2>
              <p className="text-sm text-slate-600">
                Tiga langkah sederhana untuk perjalanan PKL yang lebih terarah.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {LANGKAH_KERJA.map((item) => (
                <div
                  key={item.nomor}
                  className="rounded-2xl border border-border-subtle bg-background p-6 space-y-3"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-xs font-bold text-primary">
                    {item.nomor}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Jurnal PKL. Ruang untuk belajar dan bertumbuh.</p>
          <p>Dibuat untuk siswa dan guru pembimbing.</p>
        </div>
      </footer>
    </div>
  );
}
