'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyKodeButton({ kode }: { kode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(kode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Salin kode siswa"
      className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-background px-2.5 py-1 font-mono text-xs font-semibold text-slate-800 hover:bg-accent-soft hover:text-primary transition-colors"
    >
      <span>{kode}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-slate-400" />
      )}
    </button>
  );
}
