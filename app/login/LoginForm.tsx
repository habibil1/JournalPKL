'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from './actions';
import type { FormActionState } from '@/lib/types';

const initialState: FormActionState<'password'> = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
          Kata sandi admin
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
            className={`w-full rounded-xl border bg-surface px-4 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              state.errors?.password
                ? 'border-red-400 focus:ring-red-200'
                : 'border-border-subtle focus:border-primary focus:ring-primary/20'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {state.errors?.password ? (
          <p className="text-xs font-medium text-red-600">{state.errors.password}</p>
        ) : (
          <p className="text-xs text-slate-500">
            Akses ini hanya untuk guru pembimbing.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        {isPending ? 'Memverifikasi...' : 'Masuk sebagai admin'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
