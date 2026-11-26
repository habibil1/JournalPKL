"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { loginSiswa } from "./actions";
import type { FormActionState } from "@/lib/types";

const initialState: FormActionState<"kode"> = {};

export function MasukForm() {
  const [state, formAction, isPending] = useActionState(
    loginSiswa,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="kode"
          className="block text-sm font-semibold text-slate-800"
        >
          Kode siswa
        </label>
        <input
          id="kode"
          name="kode"
          type="text"
          defaultValue={state.values?.kode ?? ""}
          placeholder="Masukkan kode siswa"
          autoComplete="off"
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            state.errors?.kode
              ? "border-red-400 focus:ring-red-200"
              : "border-border-subtle focus:border-primary focus:ring-primary/20"
          }`}
        />
        {state.errors?.kode ? (
          <p className="text-xs font-medium text-red-600">
            {state.errors.kode}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Kode bersifat pribadi. Jangan bagikan kepada siapa pun.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60"
      >
        {isPending ? "Memeriksa kode..." : "Masuk ke jurnal saya"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
