import Link from 'next/link';
import { BookOpen, FileText, LogOut, Plus } from 'lucide-react';
import { logoutSiswa } from '@/app/jurnal/actions';
import type { SiswaTanpaKode } from '@/lib/types';

interface StudentShellProps {
  siswa: SiswaTanpaKode;
  activeNav: 'jurnal' | 'baru';
  breadcrumb: string;
  children: React.ReactNode;
}

export function StudentShell({
  siswa,
  activeNav,
  breadcrumb,
  children,
}: StudentShellProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border-subtle bg-surface flex flex-col justify-between p-5 gap-6">
        <div className="space-y-6">
          <Link href="/jurnal" className="flex items-center gap-2.5 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-base font-bold tracking-tight">
              jurnal <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">PKL</span>
            </span>
          </Link>

          <div className="space-y-2">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Ruang siswa
            </p>
            <nav className="space-y-1">
              <Link
                href="/jurnal"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeNav === 'jurnal'
                    ? 'bg-accent-soft text-primary font-semibold'
                    : 'text-slate-600 hover:bg-background hover:text-slate-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                Jurnal saya
              </Link>
              <Link
                href="/jurnal/baru"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeNav === 'baru'
                    ? 'bg-accent-soft text-primary font-semibold'
                    : 'text-slate-600 hover:bg-background hover:text-slate-900'
                }`}
              >
                <Plus className="h-4 w-4" />
                Tulis jurnal
              </Link>
            </nav>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-background p-4 space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Tempat PKL
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {siswa.tempat_pkl}
              </p>
              <p className="text-xs text-slate-500">{siswa.kelas}</p>
            </div>
            <div className="border-t border-border-subtle pt-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Pembimbing
              </p>
              <p className="text-xs font-medium text-slate-700 mt-0.5">
                {siswa.pembimbing}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-background p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-800">Jurnalmu bersifat pribadi.</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hanya kamu dan pembimbing yang dapat melihat isinya.
            </p>
          </div>

          <form action={logoutSiswa}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border-subtle bg-surface px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-500">
            <span>Ruang siswa</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-slate-800">{breadcrumb}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{siswa.nama}</p>
            <p className="text-xs text-slate-500">{siswa.kelas} • Sesi siswa aktif</p>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
