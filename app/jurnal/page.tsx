import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { getStudentSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { formatTanggalIndonesia, getTodayJakarta } from '@/lib/validation';
import type { Jurnal, SiswaTanpaKode, StatusJurnal } from '@/lib/types';
import { StudentShell } from '@/components/StudentShell';
import { StatusBadge } from '@/components/StatusBadge';

export const dynamic = 'force-dynamic';

type FilterStatus = 'semua' | StatusJurnal;

export default async function JurnalSayaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const siswaId = await getStudentSession();
  if (!siswaId) {
    redirect('/masuk');
  }

  const supabase = getSupabaseAdmin();

  const { data: siswa, error: siswaError } = await supabase
    .from('siswa')
    .select('id, nama, kelas, tempat_pkl, pembimbing')
    .eq('id', siswaId)
    .maybeSingle<SiswaTanpaKode>();

  if (siswaError || !siswa) {
    redirect('/masuk');
  }

  const { data: jurnalList } = await supabase
    .from('jurnal')
    .select('id, siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan, dibuat')
    .eq('siswa_id', siswa.id)
    .order('tanggal', { ascending: false })
    .returns<Jurnal[]>();

  const semuaJurnal = jurnalList ?? [];

  const totalJurnal = semuaJurnal.length;
  const totalDurasi = semuaJurnal.reduce((acc, item) => acc + item.durasi_jam, 0);
  const countDisetujui = semuaJurnal.filter((j) => j.status === 'disetujui').length;
  const countDiajukan = semuaJurnal.filter((j) => j.status === 'diajukan').length;
  const jurnalRevisi = semuaJurnal.filter((j) => j.status === 'revisi');
  const countRevisi = jurnalRevisi.length;
  const countPerluDitinjau = countDiajukan + countRevisi;

  const params = await searchParams;
  const rawStatus = typeof params.status === 'string' ? params.status : 'semua';
  const activeStatus: FilterStatus =
    rawStatus === 'diajukan' || rawStatus === 'disetujui' || rawStatus === 'revisi'
      ? rawStatus
      : 'semua';
  const searchQuery = typeof params.q === 'string' ? params.q.trim() : '';

  const filteredJurnal = semuaJurnal.filter((item) => {
    const matchStatus = activeStatus === 'semua' || item.status === activeStatus;
    const matchQuery =
      !searchQuery ||
      item.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kompetensi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const namaDepan = siswa.nama.split(' ')[0] || siswa.nama;
  const todayStr = formatTanggalIndonesia(getTodayJakarta(), 'weekday').toUpperCase();

  const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua jurnal', count: totalJurnal },
    { key: 'diajukan', label: 'Diajukan', count: countDiajukan },
    { key: 'disetujui', label: 'Disetujui', count: countDisetujui },
    { key: 'revisi', label: 'Revisi', count: countRevisi },
  ];

  const buildFilterHref = (status: FilterStatus) => {
    const query = new URLSearchParams();
    if (status !== 'semua') query.set('status', status);
    if (searchQuery) query.set('q', searchQuery);
    const qs = query.toString();
    return qs ? `/jurnal?${qs}` : '/jurnal';
  };

  return (
    <StudentShell siswa={siswa} activeNav="jurnal" breadcrumb="Jurnal saya">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {todayStr}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Setiap hari, selangkah lebih baik.
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Halo, {namaDepan}. Yuk, simpan cerita dan pembelajaran PKL-mu hari ini.
            </p>
          </div>

          <Link
            href="/jurnal/baru"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Tulis jurnal baru
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Total jurnal</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalJurnal}</span>
              <span className="text-xs text-slate-500">jurnal tercatat</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Total durasi</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{totalDurasi}</span>
              <span className="text-xs text-slate-500">jam pembelajaran</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Disetujui</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{countDisetujui}</span>
              <span className="text-xs text-slate-500">jurnal disetujui</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5">
            <p className="text-xs font-medium text-slate-500">Perlu ditinjau</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{countPerluDitinjau}</span>
              <span className="text-xs text-slate-500">
                {countDiajukan} diajukan • {countRevisi} revisi
              </span>
            </div>
          </div>
        </div>

        {jurnalRevisi.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900">
                {jurnalRevisi.length} jurnal perlu kamu perbaiki
              </p>
              <p className="text-xs text-amber-800">
                {formatTanggalIndonesia(jurnalRevisi[0].tanggal, 'short')} •{' '}
                {jurnalRevisi[0].catatan || 'Silakan perbaiki sesuai arahan pembimbing.'}
              </p>
            </div>
            <Link
              href={`/jurnal/${jurnalRevisi[0].id}/ubah`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline shrink-0"
            >
              Perbaiki jurnal
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden">
          <div className="p-5 border-b border-border-subtle space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-bold text-slate-900">Riwayat jurnal</h2>

              <form method="GET" action="/jurnal" className="flex items-center gap-2">
                {activeStatus !== 'semua' && (
                  <input type="hidden" name="status" value={activeStatus} />
                )}
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Cari kegiatan..."
                    className="w-full sm:w-56 rounded-xl border border-border-subtle bg-background pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none"
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

            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => {
                const isActive = activeStatus === tab.key;
                return (
                  <Link
                    key={tab.key}
                    href={buildFilterHref(tab.key)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-accent-soft text-primary font-semibold'
                        : 'text-slate-600 hover:bg-background'
                    }`}
                  >
                    {tab.label} <span className="ml-1 opacity-75">{tab.count}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {filteredJurnal.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-sm font-medium text-slate-700">
                Belum ada jurnal yang cocok dengan filter ini.
              </p>
              <p className="text-xs text-slate-500">
                Coba ubah filter status atau tulis jurnal PKL baru.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background text-xs font-semibold text-slate-500 border-b border-border-subtle">
                  <tr>
                    <th className="px-5 py-3">Tanggal</th>
                    <th className="px-5 py-3">Kegiatan &amp; kompetensi</th>
                    <th className="px-5 py-3">Durasi</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredJurnal.map((item) => (
                    <tr key={item.id} className="hover:bg-background/60 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-600">
                        {formatTanggalIndonesia(item.tanggal, 'short')}
                      </td>
                      <td className="px-5 py-4 max-w-md">
                        <p className="font-medium text-slate-900 line-clamp-1">
                          {item.kegiatan}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.kompetensi}</p>
                        {item.status === 'revisi' && item.catatan && (
                          <p className="text-xs text-red-700 bg-red-50 rounded-lg px-2.5 py-1.5 mt-2">
                            Catatan pembimbing: {item.catatan}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-600">
                        {item.durasi_jam} jam
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/jurnal/${item.id}/ubah`}
                          className={`text-xs font-semibold hover:underline ${
                            item.status === 'revisi'
                              ? 'text-red-700'
                              : item.status === 'disetujui'
                              ? 'text-slate-600'
                              : 'text-primary'
                          }`}
                        >
                          {item.status === 'revisi'
                            ? 'Perbaiki'
                            : item.status === 'disetujui'
                            ? 'Lihat jurnal'
                            : 'Lihat / Ubah'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-border-subtle bg-background/50 px-5 py-3 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Menampilkan {filteredJurnal.length} dari {totalJurnal} jurnal
            </span>
            <span>Jurnal yang sudah disetujui terkunci dan tidak dapat diubah.</span>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
