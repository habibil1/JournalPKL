import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import { getAdminSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { Siswa } from '@/lib/types';
import { AdminShell } from '@/components/AdminShell';
import { CopyKodeButton } from '@/components/CopyKodeButton';
import { TambahSiswaForm } from '@/components/TambahSiswaForm';
import { hapusSiswa } from './actions';

export const dynamic = 'force-dynamic';

export default async function KelolaSiswaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    redirect('/login');
  }

  const supabase = getSupabaseAdmin();

  const [{ data: siswaRows }, { data: jurnalRows }] = await Promise.all([
    supabase
      .from('siswa')
      .select('id, nama, kelas, tempat_pkl, pembimbing, kode')
      .order('id', { ascending: true })
      .returns<Siswa[]>(),
    supabase
      .from('jurnal')
      .select('siswa_id')
      .returns<{ siswa_id: number }[]>(),
  ]);

  const siswaList = siswaRows ?? [];
  const jumlahJurnalMap = new Map<number, number>();
  for (const j of jurnalRows ?? []) {
    jumlahJurnalMap.set(j.siswa_id, (jumlahJurnalMap.get(j.siswa_id) ?? 0) + 1);
  }

  const params = await searchParams;
  const searchQuery = typeof params.q === 'string' ? params.q.trim() : '';

  const filteredSiswa = siswaList.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.nama.toLowerCase().includes(q) ||
      s.kelas.toLowerCase().includes(q) ||
      s.tempat_pkl.toLowerCase().includes(q)
    );
  });

  return (
    <AdminShell activeNav="siswa" breadcrumb="Kelola siswa">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Ruang untuk setiap siswa bertumbuh.
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola data siswa dan bagikan kode akses secara pribadi.
          </p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-accent-soft/75 px-5 py-4 space-y-1">
          <p className="text-xs font-semibold text-primary">
            Kode siswa adalah akses pribadi.
          </p>
          <p className="text-xs text-slate-700">
            Bagikan hanya kepada siswa yang bersangkutan. Kode tidak tampil di halaman publik atau halaman siswa.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden">
              <div className="p-5 border-b border-border-subtle flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Daftar siswa</h2>
                  <p className="text-xs text-slate-500">{siswaList.length} siswa terdaftar</p>
                </div>

                <form method="GET" action="/admin/siswa" className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      name="q"
                      defaultValue={searchQuery}
                      placeholder="Cari nama atau kelas..."
                      className="w-full sm:w-52 rounded-xl border border-border-subtle bg-background pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl border border-border-subtle bg-background px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-accent-soft hover:text-primary transition-colors"
                  >
                    Cari
                  </button>
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-xs font-semibold text-slate-500 border-b border-border-subtle">
                    <tr>
                      <th className="px-5 py-3">Siswa &amp; tempat PKL</th>
                      <th className="px-5 py-3">Kode akses</th>
                      <th className="px-5 py-3">Jurnal</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {filteredSiswa.map((s) => {
                      const jumlahJurnal = jumlahJurnalMap.get(s.id) ?? 0;
                      const terkunci = jumlahJurnal > 0;
                      return (
                        <tr key={s.id} className="hover:bg-background/60">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">{s.nama}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {s.kelas} • {s.tempat_pkl}
                            </p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <CopyKodeButton kode={s.kode} />
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-600">
                            {jumlahJurnal} jurnal
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            {terkunci ? (
                              <div className="inline-flex flex-col items-end">
                                <button
                                  type="button"
                                  disabled
                                  className="text-xs font-medium text-slate-400 cursor-not-allowed"
                                >
                                  Hapus
                                </button>
                                <span className="text-[10px] text-slate-400">Terkunci</span>
                              </div>
                            ) : (
                              <form action={hapusSiswa}>
                                <input type="hidden" name="siswa_id" value={s.id} />
                                <button
                                  type="submit"
                                  className="text-xs font-semibold text-red-600 hover:underline"
                                >
                                  Hapus
                                </button>
                              </form>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border-subtle bg-background/50 px-5 py-3 text-xs text-slate-500">
                Menampilkan {filteredSiswa.length} dari {siswaList.length} siswa
              </div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-1">
              <p className="text-xs font-semibold text-slate-800">
                Mengapa tombol hapus terkunci?
              </p>
              <p className="text-xs text-slate-600">
                Siswa yang sudah memiliki jurnal tidak dapat dihapus agar riwayat belajar tetap tersimpan.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4">
            <TambahSiswaForm />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
