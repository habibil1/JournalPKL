'use client';

import { useActionState } from 'react';
import { Check } from 'lucide-react';
import { tinjauJurnal } from '@/app/admin/actions';
import type { FormActionState, JurnalDenganSiswa } from '@/lib/types';
import { formatTanggalIndonesia } from '@/lib/validation';
import { StatusBadge } from '@/components/StatusBadge';

const initialState: FormActionState<'catatan'> = {};

export function TinjauJurnalPanel({
  jurnal,
}: {
  jurnal: JurnalDenganSiswa | null;
}) {
  const [state, formAction, isPending] = useActionState(tinjauJurnal, initialState);

  if (!jurnal) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 text-center space-y-2">
        <h3 className="text-sm font-bold text-slate-900">Tinjau jurnal</h3>
        <p className="text-xs text-slate-500">
          Pilih salah satu jurnal siswa di sebelah kiri untuk meninjau isinya.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Tinjau jurnal</h3>
          <p className="text-sm font-semibold text-slate-800 mt-1">
            {jurnal.siswa.nama} • {jurnal.siswa.kelas}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatTanggalIndonesia(jurnal.tanggal, 'short')} / {jurnal.durasi_jam} jam /{' '}
            {jurnal.siswa.tempat_pkl}
          </p>
        </div>
        <StatusBadge status={jurnal.status} />
      </div>

      <div className="space-y-2 rounded-xl border border-border-subtle bg-background p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Kegiatan
        </p>
        <p className="text-sm text-slate-800 leading-relaxed">{jurnal.kegiatan}</p>
        <p className="text-xs text-slate-500 pt-1">
          Kompetensi: <span className="font-medium text-slate-700">{jurnal.kompetensi}</span>
        </p>
      </div>

      {state.message && (
        <div
          className={`rounded-xl px-4 py-2.5 text-xs font-medium ${
            state.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} key={jurnal.id} className="space-y-4" noValidate>
        <input type="hidden" name="jurnal_id" value={jurnal.id} />

        <div className="space-y-1.5">
          <label
            htmlFor="catatan"
            className="block text-xs font-semibold text-slate-800"
          >
            Catatan pembimbing
          </label>
          <textarea
            id="catatan"
            name="catatan"
            rows={3}
            defaultValue={state.values?.catatan ?? jurnal.catatan ?? ''}
            placeholder="Tulis arahan perbaikan untuk siswa..."
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              state.errors?.catatan
                ? 'border-red-400 focus:ring-red-200'
                : 'border-border-subtle focus:border-primary focus:ring-primary/20'
            }`}
          />
          {state.errors?.catatan ? (
            <p className="text-xs font-medium text-red-600">{state.errors.catatan}</p>
          ) : (
            <p className="text-[11px] text-slate-500">
              Wajib diisi saat revisi, minimal 5 karakter.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="submit"
            name="aksi"
            value="revisi"
            disabled={isPending}
            className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors disabled:opacity-60"
          >
            Minta revisi
          </button>
          <button
            type="submit"
            name="aksi"
            value="setujui"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" />
            Setujui jurnal
          </button>
        </div>
      </form>
    </div>
  );
}
