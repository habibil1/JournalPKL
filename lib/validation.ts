import crypto from 'crypto';
import type { FieldErrors } from './types';

export type JurnalField = 'tanggal' | 'kegiatan' | 'kompetensi' | 'durasi_jam';
export type SiswaField = 'nama' | 'kelas' | 'tempat_pkl' | 'pembimbing';

export function getTodayJakarta(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function shiftDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function getMinDateJakarta(): string {
  return shiftDate(getTodayJakarta(), -7);
}

export function validateJurnalInput(input: {
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: string;
}): {
  errors: FieldErrors<JurnalField>;
  data?: {
    tanggal: string;
    kegiatan: string;
    kompetensi: string;
    durasi_jam: number;
  };
} {
  const errors: FieldErrors<JurnalField> = {};
  const today = getTodayJakarta();
  const minDate = getMinDateJakarta();

  const tanggal = input.tanggal.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    errors.tanggal = 'Tanggal wajib diisi dengan format yang benar.';
  } else if (tanggal > today) {
    errors.tanggal = 'Tanggal jurnal tidak boleh di masa depan.';
  } else if (tanggal < minDate) {
    errors.tanggal = 'Tanggal jurnal maksimal 7 hari ke belakang dari hari ini.';
  }

  const durasiNum = Number(input.durasi_jam);
  if (
    !input.durasi_jam.trim() ||
    !Number.isInteger(durasiNum) ||
    durasiNum < 1 ||
    durasiNum > 10
  ) {
    errors.durasi_jam = 'Durasi harus bilangan bulat antara 1 sampai 10 jam.';
  }

  const kegiatan = input.kegiatan.trim();
  if (kegiatan.length < 30 || kegiatan.length > 500) {
    errors.kegiatan = 'Kegiatan wajib diisi antara 30 sampai 500 karakter.';
  }

  const kompetensi = input.kompetensi.trim();
  if (kompetensi.length < 3 || kompetensi.length > 60) {
    errors.kompetensi = 'Kompetensi wajib diisi antara 3 sampai 60 karakter.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors: {},
    data: {
      tanggal,
      kegiatan,
      kompetensi,
      durasi_jam: durasiNum,
    },
  };
}

export function validateSiswaInput(input: {
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
}): {
  errors: FieldErrors<SiswaField>;
  data?: {
    nama: string;
    kelas: string;
    tempat_pkl: string;
    pembimbing: string;
  };
} {
  const errors: FieldErrors<SiswaField> = {};

  const nama = input.nama.trim();
  if (nama.length < 3 || nama.length > 40) {
    errors.nama = 'Nama siswa wajib diisi antara 3 sampai 40 karakter.';
  }

  const kelas = input.kelas.trim();
  if (!kelas) {
    errors.kelas = 'Kelas wajib diisi.';
  }

  const tempat_pkl = input.tempat_pkl.trim();
  if (!tempat_pkl) {
    errors.tempat_pkl = 'Tempat PKL wajib diisi.';
  }

  const pembimbing = input.pembimbing.trim();
  if (!pembimbing) {
    errors.pembimbing = 'Nama pembimbing wajib diisi.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors: {},
    data: { nama, kelas, tempat_pkl, pembimbing },
  };
}

export function generateKodeSiswa(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(4);
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[bytes[i] % chars.length];
  }
  return `PKL-${suffix}`;
}

export function formatTanggalIndonesia(
  dateStr: string,
  variant: 'short' | 'long' | 'weekday' = 'short'
): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(Date.UTC(y, m - 1, d));

  if (variant === 'weekday') {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'UTC',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  if (variant === 'long') {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
