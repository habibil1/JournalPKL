import Link from 'next/link';
import { BookOpen, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { logoutAdmin } from '@/app/login/actions';

interface AdminShellProps {
  activeNav: 'dashboard' | 'siswa';
  breadcrumb: string;
  children: React.ReactNode;
}

export function AdminShell({
  activeNav,
  breadcrumb,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border-subtle bg-surface flex flex-col justify-between p-5 gap-6">
        <div className="space-y-6">
          <Link href="/admin" className="flex items-center gap-2.5 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-base font-bold tracking-tight">
              jurnal <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">PKL</span>
            </span>
          </Link>

          <div className="space-y-2">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Ruang pembimbing
            </p>
            <nav className="space-y-1">
              <Link
                href="/admin"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeNav === 'dashboard'
                    ? 'bg-accent-soft text-primary font-semibold'
                    : 'text-slate-600 hover:bg-background hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/siswa"
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeNav === 'siswa'
                    ? 'bg-accent-soft text-primary font-semibold'
                    : 'text-slate-600 hover:bg-background hover:text-slate-900'
                }`}
              >
                <Users className="h-4 w-4" />
                Kelola siswa
              </Link>
            </nav>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-background p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-800">Bimbing dengan bermakna.</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Catatan yang jelas membantu siswa belajar lebih baik.
            </p>
          </div>

          <form action={logoutAdmin}>
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
            <span>Ruang pembimbing</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-slate-800">{breadcrumb}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Guru pembimbing</p>
            <p className="text-xs text-slate-500">Sesi admin aktif</p>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
