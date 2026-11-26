'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { ArrowLeft, ArrowRight, Lock, Minus, Plus } from 'lucide-react';
import { createJurnal, updateJurnal } from '@/app/jurnal/actions';
import type { FormActionState, Jurnal, SiswaTanpaKode } from '@/lib/types';
import { formatTanggalIndonesia, type JurnalField } from '@/lib/validation';
import { StatusBadge } from '@/components/StatusBadge';

interface JurnalFormProps {
  mode: 'create' | 'edit';
  siswa: SiswaTanpaKode;
  minDate: string;
  maxDate: string;
  initialJurnal?: Jurnal;
}

const PANDUAN_JURNAL = [
  {
    nomor: '01',
    judul: 'Apa yang dikerjakan?',
    deskripsi: 'Jelaskan tugas dan hasil kegiatanmu.',
  },
  {
    nomor: '02',
    judul: 'Apa yang dipelajari?',
    deskripsi: 'Tulis keterampilan yang kamu latih.',
  },
  {
    nomor: '03',
    judul: 'Berapa lama?',
    deskripsi: 'Catat durasi kegiatan dengan jujur.',
  },
];

export function JurnalForm({
  mode,
  siswa,
  minDate,
  maxDate,
  initialJurnal,
}: JurnalFormProps) {
  const boundAction =
    mode === 'edit' && initialJurnal
      ? updateJurnal.bind(null, initialJurnal.id)
      : createJurnal;

  const initialState: FormActionState<JurnalField> = {};
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const isLocked = mode === 'edit' && initialJurnal?.status === 'disetujui';
  const isRevisi = mode === 'edit' && initialJurnal?.status === 'revisi';

  const defaultTanggal = state.values?.tanggal ?? initialJurnal?.tanggal ?? maxDate;
  const defaultDurasi = Number(
    state.values?.durasi_jam ?? initialJurnal?.durasi_jam ?? 7
  );
  const defaultKegiatan =
    state.values?.kegiatan ?? initialJurnal?.kegiatan ?? '';
  const defaultKompetensi =
    state.values?.kompetensi ?? initialJurnal?.kompetensi ?? '';

  const [durasi, setDurasi] = useState<number>(
    Number.isFinite(defaultDurasi) ? Math.min(10, Math.max(1, defaultDurasi)) : 7
  );
  const [kegiatanLength, setKegiatanLength] = useState<number>(
    defaultKegiatan.length
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          href="/jurnal"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke jurnal saya
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isLocked
                ? 'Detail jurnal harian.'
                : mode === 'edit'
                ? 'Perbarui catatan jurnal.'
                : 'Hari baru, cerita baru.'}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {isLocked
                ? 'Jurnal ini sudah disetujui oleh pembimbing sehingga tidak dapat diubah.'
                : 'Ceritakan apa yang kamu kerjakan dan pelajari selama PKL hari ini.'}
            </p>
          </div>
          {initialJurnal && <StatusBadge status={initialJurnal.status} />}
        </div>
      </div>

      {isLocked && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          <Lock className="h-4 w-4 shrink-0" />
          <span>Jurnal yang sudah disetujui terkunci dan hanya dapat dibaca.</span>
        </div>
      )}

      {isRevisi && initialJurnal?.catatan && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Catatan revisi dari pembimbing
          </p>
          <p className="text-sm text-amber-950">{initialJurnal.catatan}</p>
          <p className="text-xs text-amber-700 pt-1">
            Setelah disimpan, status jurnal akan kembali menjadi Diajukan dan catatan ini dihapus.
          </p>
        </div>
      )}

      {state.message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <form
          action={formAction}
          noValidate
          className="lg:col-span-8 rounded-2xl border border-border-subtle bg-surface p-6 space-y-5"
        >
          <div>
            <h2 className="text-base font-bold text-slate-900">Jurnal harian</h2>
            <p className="text-xs text-slate-500">Semua kolom wajib diisi.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="tanggal"
                className="block text-xs font-semibold text-slate-800"
              >
                Tanggal kegiatan *
              </label>
              <input
                id="tanggal"
                name="tanggal"
                type="date"
                min={minDate}
                max={maxDate}
                defaultValue={defaultTanggal}
                disabled={isLocked}
                className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 disabled:bg-background disabled:text-slate-600 ${
                  state.errors?.tanggal
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                }`}
              />
              {state.errors?.tanggal ? (
                <p className="text-xs font-medium text-red-600">
                  {state.errors.tanggal}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {formatTanggalIndonesia(minDate, 'short')} –{' '}
                  {formatTanggalIndonesia(maxDate, 'short')} • Satu jurnal per hari.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="durasi_jam"
                className="block text-xs font-semibold text-slate-800"
              >
                Durasi (jam) *
              </label>
              <div className="flex items-center rounded-xl border border-border-subtle bg-surface overflow-hidden">
                <input
                  id="durasi_jam"
                  name="durasi_jam"
                  type="number"
                  min={1}
                  max={10}
                  value={durasi}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!Number.isNaN(val)) setDurasi(val);
                  }}
                  disabled={isLocked}
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none disabled:bg-background disabled:text-slate-600"
                />
                {!isLocked && (
                  <div className="flex items-center border-l border-border-subtle">
                    <button
                      type="button"
                      onClick={() => setDurasi((d) => Math.max(1, d - 1))}
                      aria-label="Kurangi durasi"
                      className="px-3 py-2.5 text-slate-600 hover:bg-background"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurasi((d) => Math.min(10, d + 1))}
                      aria-label="Tambah durasi"
                      className="px-3 py-2.5 text-slate-600 hover:bg-background border-l border-border-subtle"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {state.errors?.durasi_jam ? (
                <p className="text-xs font-medium text-red-600">
                  {state.errors.durasi_jam}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Bilangan bulat, 1–10 jam per hari.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="kegiatan"
              className="block text-xs font-semibold text-slate-800"
            >
              Kegiatan yang dilakukan *
            </label>
            <textarea
              id="kegiatan"
              name="kegiatan"
              rows={5}
              defaultValue={defaultKegiatan}
              onChange={(e) => setKegiatanLength(e.target.value.length)}
              disabled={isLocked}
              placeholder="Tuliskan kegiatan PKL yang kamu kerjakan hari ini secara jelas..."
              className={`w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-background disabled:text-slate-600 ${
                state.errors?.kegiatan
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-border-subtle focus:border-primary focus:ring-primary/20'
              }`}
            />
            <div className="flex items-center justify-between gap-2">
              {state.errors?.kegiatan ? (
                <p className="text-xs font-medium text-red-600">
                  {state.errors.kegiatan}
                </p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Tuliskan kegiatan secara jelas dan spesifik.
                </p>
              )}
              <span className="text-[11px] text-slate-500 shrink-0">
                {kegiatanLength}/500 (min 30)
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="kompetensi"
              className="block text-xs font-semibold text-slate-800"
            >
              Kompetensi yang dipelajari *
            </label>
            <input
              id="kompetensi"
              name="kompetensi"
              type="text"
              defaultValue={defaultKompetensi}
              disabled={isLocked}
              placeholder="Contoh: Pengembangan antarmuka responsif"
              className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-background disabled:text-slate-600 ${
                state.errors?.kompetensi
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-border-subtle focus:border-primary focus:ring-primary/20'
              }`}
            />
            {state.errors?.kompetensi ? (
              <p className="text-xs font-medium text-red-600">
                {state.errors.kompetensi}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                3–60 karakter • Contoh: Perancangan basis data.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/jurnal"
              className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-background transition-colors"
            >
              {isLocked ? 'Kembali' : 'Batal'}
            </Link>

            {!isLocked && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-slate-500">
                  Pastikan isianmu sudah sesuai sebelum dikirim.
                </span>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  {isPending
                    ? 'Menyimpan...'
                    : mode === 'edit'
                    ? 'Simpan perubahan'
                    : 'Kirim jurnal'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </form>

        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border-subtle bg-accent-soft/75 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Jurnal yang baik dimulai dari cerita yang jelas.
            </h3>
            <ul className="space-y-3">
              {PANDUAN_JURNAL.map((item) => (
                <li key={item.nomor} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-primary mt-0.5">
                    {item.nomor}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {item.judul}
                    </p>
                    <p className="text-xs text-slate-600">{item.deskripsi}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-2.5">
            <p className="text-xs font-semibold text-slate-800">
              Setelah jurnal dikirim
            </p>
            <p className="text-xs font-semibold text-amber-700">Diajukan</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pembimbing akan meninjau jurnalmu. Kamu masih dapat mengubahnya
              selama belum disetujui.
            </p>
            <div className="border-t border-border-subtle pt-2.5 text-[11px] text-slate-500">
              <p>Jurnal ini tercatat atas nama</p>
              <p className="font-semibold text-slate-700">
                {siswa.nama} • {siswa.kelas}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
