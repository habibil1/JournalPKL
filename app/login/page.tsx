import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { getAdminSession } from '@/lib/session';
import { LoginForm } from './LoginForm';

const ALUR_ADMIN = [
  { nomor: '01', teks: 'Pantau jurnal dan total jam setiap siswa' },
  { nomor: '02', teks: 'Setujui jurnal atau kirim catatan revisi' },
  { nomor: '03', teks: 'Kelola data dan kode akses siswa' },
];

export default async function LoginAdminPage() {
  const isAdmin = await getAdminSession();
  if (isAdmin) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12">
      <aside className="lg:col-span-5 bg-panel-dark text-white p-8 sm:p-12 flex flex-col justify-between gap-10">
        <div className="space-y-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
              <BookOpen className="h-4.5 w-4.5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              jurnal <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">PKL</span>
            </span>
          </Link>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              Ruang pembimbing
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Arahan yang baik, masa depan yang lebih siap.
            </h1>
            <p className="text-sm text-teal-100/80 leading-relaxed">
              Dampingi perkembangan siswa, tinjau kegiatan harian, dan berikan umpan balik yang berarti.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-sm font-semibold">Semua perkembangan, satu tempat.</h2>
            <ul className="space-y-3 text-sm text-teal-100/90">
              {ALUR_ADMIN.map((item) => (
                <li key={item.nomor} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-teal-300">{item.nomor}</span>
                  <span>{item.teks}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-teal-200/70">
          Jurnal PKL / Belajar dari pengalaman
        </p>
      </aside>

      <main className="lg:col-span-7 bg-surface flex flex-col justify-between p-6 sm:p-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke beranda
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md py-10 space-y-6">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              Akses admin
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Selamat datang, Bapak/Ibu pembimbing.
            </h2>
            <p className="text-sm text-slate-600">
              Masuk untuk meninjau perjalanan PKL siswa.
            </p>
          </div>

          <LoginForm />

          <div className="rounded-xl border border-border-subtle bg-background p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-800">Tidak dapat masuk?</p>
            <p className="text-xs text-slate-600">
              Hubungi pengelola untuk memulihkan akses admin.
            </p>
          </div>

          <div className="pt-2 text-sm text-slate-600">
            Kamu siswa?{' '}
            <Link
              href="/masuk"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Masuk dengan kode siswa
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div />
      </main>
    </div>
  );
}
