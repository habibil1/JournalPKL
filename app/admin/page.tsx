import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type {
  Jurnal,
  JurnalDenganSiswa,
  RekapSiswa,
  SiswaTanpaKode,
  StatusJurnal,
} from '@/lib/types';
import { formatTanggalIndonesia, getTodayJakarta } from '@/lib/validation';
import { AdminShell } from '@/components/AdminShell';
import { StatusBadge } from '@/components/StatusBadge';
import { TinjauJurnalPanel } from '@/components/TinjauJurnalPanel';

export const dynamic = 'force-dynamic';

type FilterStatus = 'semua' | StatusJurnal;

export default async function AdminDashboardPage({
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
      .select('id, nama, kelas, tempat_pkl, pembimbing')
      .order('nama', { ascending: true })
      .returns<SiswaTanpaKode[]>(),
    supabase
      .from('jurnal')
      .select('id, siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan, dibuat')
      .order('tanggal', { ascending: false })
      .order('id', { ascending: false })
      .returns<Jurnal[]>(),
  ]);

  const siswaList = siswaRows ?? [];
  const jurnalList = jurnalRows ?? [];

  const siswaMap = new Map<number, SiswaTanpaKode>();
  for (const s of siswaList) {
    siswaMap.set(s.id, s);
  }

  const jurnalDenganSiswa: JurnalDenganSiswa[] = [];
  for (const j of jurnalList) {
    const s = siswaMap.get(j.siswa_id);
    if (s) {
      jurnalDenganSiswa.push({ ...j, siswa: s });
    }
  }

  const rekapList: RekapSiswa[] = siswaList.map((s) => {
    const milik = jurnalList.filter((j) => j.siswa_id === s.id);
    return {
      id: s.id,
      nama: s.nama,
      kelas: s.kelas,
      tempat_pkl: s.tempat_pkl,
      jumlah_jurnal: milik.length,
      total_jam: milik.reduce((acc, item) => acc + item.durasi_jam, 0),
      menunggu: milik.filter((item) => item.status === 'diajukan').length,
    };
  });

  const totalSiswa = siswaList.length;
  const totalJurnal = jurnalList.length;
  const totalDurasi = jurnalList.reduce((acc, item) => acc + item.durasi_jam, 0);
  const totalMenunggu = jurnalList.filter((j) => j.status === 'diajukan').length;

  const params = await searchParams;
  const rawStatus = typeof params.status === 'string' ? params.status : 'semua';
  const activeStatus: FilterStatus =
    rawStatus === 'diajukan' || rawStatus === 'disetujui' || rawStatus === 'revisi'
      ? rawStatus
      : 'semua';

  const rawSiswa = typeof params.siswa === 'string' ? params.siswa : 'semua';
  const activeSiswaId =
    rawSiswa !== 'semua' && Number.isInteger(Number(rawSiswa))
      ? Number(rawSiswa)
      : null;

  const filteredJurnal = jurnalDenganSiswa.filter((j) => {
    const matchStatus = activeStatus === 'semua' || j.status === activeStatus;
    const matchSiswa = activeSiswaId === null || j.siswa_id === activeSiswaId;
    return matchStatus && matchSiswa;
  });

  const selectedJurnalId =
    typeof params.jurnal === 'string' && Number.isInteger(Number(params.jurnal))
      ? Number(params.jurnal)
      : null;

  const selectedJurnal =
    filteredJurnal.find((j) => j.id === selectedJurnalId) ??
    filteredJurnal[0] ??
    null;

  const buildSelectHref = (jurnalId: number) => {
    const query = new URLSearchParams();
    if (activeSiswaId !== null) query.set('siswa', String(activeSiswaId));
    if (activeStatus !== 'semua') query.set('status', activeStatus);
    query.set('jurnal', String(jurnalId));
    return `/admin?${query.toString()}`;
  };

  const todayStr = formatTanggalIndonesia(getTodayJakarta(), 'weekday');

  return (
    <AdminShell activeNav="dashboard" breadcrumb="Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Dampingi proses, lihat progres.
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Ringkasan kegiatan PKL siswa dan jurnal yang perlu kamu tinjau.
            </p>
          </div>
          <p className="text-xs text-slate-500">{todayStr}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Siswa aktif</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalSiswa}</span>
              <span className="text-xs text-slate-500">siswa</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Jurnal terkumpul</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalJurnal}</span>
              <span className="text-xs text-slate-500">jurnal</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Total durasi PKL</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalDurasi}</span>
              <span className="text-xs text-slate-500">jam</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-accent-soft/75 p-5">
            <p className="text-xs font-medium text-primary">Menunggu tinjauan</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{totalMenunggu}</span>
              <span className="text-xs text-primary/80">jurnal diajukan</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Rekap per siswa</h2>
            <span className="text-xs text-slate-500">{totalSiswa} siswa terdaftar</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background text-xs font-semibold text-slate-500 border-b border-border-subtle">
                <tr>
                  <th className="px-5 py-3">Nama siswa</th>
                  <th className="px-5 py-3">Kelas</th>
                  <th className="px-5 py-3">Tempat PKL</th>
                  <th className="px-5 py-3">Jurnal</th>
                  <th className="px-5 py-3">Total jam</th>
                  <th className="px-5 py-3">Menunggu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {rekapList.map((r) => (
                  <tr key={r.id} className="hover:bg-background/60">
                    <td className="px-5 py-3 font-semibold text-slate-900">{r.nama}</td>
                    <td className="px-5 py-3 text-xs text-slate-600">{r.kelas}</td>
                    <td className="px-5 py-3 text-xs text-slate-600">{r.tempat_pkl}</td>
                    <td className="px-5 py-3 text-xs text-slate-700">{r.jumlah_jurnal}</td>
                    <td className="px-5 py-3 text-xs text-slate-700">{r.total_jam} jam</td>
                    <td className="px-5 py-3 text-xs text-slate-700">{r.menunggu} jurnal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-border-subtle bg-surface overflow-hidden">
            <div className="p-5 border-b border-border-subtle space-y-3">
              <h2 className="text-base font-bold text-slate-900">Jurnal siswa</h2>

              <form method="GET" action="/admin" className="flex flex-wrap gap-2">
                <select
                  name="siswa"
                  defaultValue={activeSiswaId !== null ? String(activeSiswaId) : 'semua'}
                  className="rounded-xl border border-border-subtle bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary focus:outline-none"
                >
                  <option value="semua">Semua siswa</option>
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama}
                    </option>
                  ))}
                </select>

                <select
                  name="status"
                  defaultValue={activeStatus}
                  className="rounded-xl border border-border-subtle bg-background px-3 py-2 text-xs font-medium text-slate-700 focus:border-primary focus:outline-none"
                >
                  <option value="semua">Semua status</option>
                  <option value="diajukan">Diajukan</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="revisi">Revisi</option>
                </select>

                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  Terapkan filter
                </button>
              </form>
            </div>

            {filteredJurnal.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Tidak ada jurnal yang cocok dengan filter ini.
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {filteredJurnal.map((item) => {
                  const isSelected = selectedJurnal?.id === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={buildSelectHref(item.id)}
                      className={`block px-5 py-4 transition-colors ${
                        isSelected
                          ? 'bg-accent-soft/75'
                          : 'hover:bg-background/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.siswa.nama}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                            {item.kegiatan}
                          </p>
                        </div>
                        <div className="shrink-0 text-right space-y-1">
                          <StatusBadge status={item.status} />
                          <p className="text-[11px] text-slate-500">
                            {formatTanggalIndonesia(item.tanggal, 'short')} • {item.durasi_jam} jam
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <TinjauJurnalPanel jurnal={selectedJurnal} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
