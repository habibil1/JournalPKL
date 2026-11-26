export type StatusJurnal = "diajukan" | "disetujui" | "revisi";

export interface Siswa {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
  kode: string;
}

export type SiswaTanpaKode = Omit<Siswa, "kode">;

export interface Jurnal {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
  status: StatusJurnal;
  catatan: string | null;
  dibuat: string;
}

export interface JurnalDenganSiswa extends Jurnal {
  siswa: SiswaTanpaKode;
}

export interface RekapSiswa {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  jumlah_jurnal: number;
  total_jam: number;
  menunggu: number;
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export interface FormActionState<K extends string = string> {
  success?: boolean;
  message?: string;
  errors?: FieldErrors<K>;
  values?: Partial<Record<K, string>>;
}
