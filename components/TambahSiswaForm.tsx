'use client';

import { useActionState } from 'react';
import { Plus } from 'lucide-react';
import { tambahSiswa } from '@/app/admin/siswa/actions';
import type { FormActionState } from '@/lib/types';
import type { SiswaField } from '@/lib/validation';

const initialState: FormActionState<SiswaField> = {};

export function TambahSiswaForm() {
  const [state, formAction, isPending] = useActionState(tambahSiswa, initialState);

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">Tambah siswa baru</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Siapkan akses untuk perjalanan PKL berikutnya.
        </p>
      </div>

      {state.message && (
        <div
          className={`rounded-xl px-4 py-3 text-xs font-medium ${
            state.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="nama" className="block text-xs font-semibold text-slate-800">
            Nama lengkap *
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            defaultValue={state.success ? '' : (state.values?.nama ?? '')}
            placeholder="Nama siswa"
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              state.errors?.nama
                ? 'border-red-400 focus:ring-red-200'
                : 'border-border-subtle focus:border-primary focus:ring-primary/20'
            }`}
          />
          {state.errors?.nama ? (
            <p className="text-xs font-medium text-red-600">{state.errors.nama}</p>
          ) : (
            <p className="text-[11px] text-slate-500">3–40 karakter</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="kelas" className="block text-xs font-semibold text-slate-800">
            Kelas *
          </label>
          <input
            id="kelas"
            name="kelas"
            type="text"
            defaultValue={state.success ? '' : (state.values?.kelas ?? '')}
            placeholder="Contoh: XI RPL 1"
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              state.errors?.kelas
                ? 'border-red-400 focus:ring-red-200'
                : 'border-border-subtle focus:border-primary focus:ring-primary/20'
            }`}
          />
          {state.errors?.kelas && (
            <p className="text-xs font-medium text-red-600">{state.errors.kelas}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="tempat_pkl" className="block text-xs font-semibold text-slate-800">
            Tempat PKL *
          </label>
          <input
            id="tempat_pkl"
            name="tempat_pkl"
            type="text"
            defaultValue={state.success ? '' : (state.values?.tempat_pkl ?? '')}
            placeholder="Nama perusahaan atau instansi"
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              state.errors?.tempat_pkl
                ? 'border-red-400 focus:ring-red-200'
                : 'border-border-subtle focus:border-primary focus:ring-primary/20'
            }`}
          />
          {state.errors?.tempat_pkl && (
            <p className="text-xs font-medium text-red-600">{state.errors.tempat_pkl}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pembimbing" className="block text-xs font-semibold text-slate-800">
            Pembimbing *
          </label>
          <input
            id="pembimbing"
            name="pembimbing"
            type="text"
            defaultValue={state.success ? '' : (state.values?.pembimbing ?? '')}
            placeholder="Nama guru pembimbing"
            className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              state.errors?.pembimbing
                ? 'border-red-400 focus:ring-red-200'
                : 'border-border-subtle focus:border-primary focus:ring-primary/20'
            }`}
          />
          {state.errors?.pembimbing && (
            <p className="text-xs font-medium text-red-600">{state.errors.pembimbing}</p>
          )}
        </div>

        <div className="rounded-xl border border-border-subtle bg-background p-3.5 space-y-0.5">
          <p className="text-xs font-semibold text-slate-800">
            Kode akses dibuat otomatis
          </p>
          <p className="text-[11px] text-slate-500">
            Kode unik akan muncul setelah siswa ditambahkan.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          {isPending ? 'Menambahkan...' : 'Tambah siswa'}
        </button>
      </form>
    </div>
  );
}
