import { redirect } from 'next/navigation';
import { getStudentSession } from '@/lib/session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { SiswaTanpaKode } from '@/lib/types';
import { getMinDateJakarta, getTodayJakarta } from '@/lib/validation';
import { StudentShell } from '@/components/StudentShell';
import { JurnalForm } from '@/components/JurnalForm';

export const dynamic = 'force-dynamic';

export default async function TulisJurnalBaruPage() {
  const siswaId = await getStudentSession();
  if (!siswaId) {
    redirect('/masuk');
  }

  const supabase = getSupabaseAdmin();
  const { data: siswa } = await supabase
    .from('siswa')
    .select('id, nama, kelas, tempat_pkl, pembimbing')
    .eq('id', siswaId)
    .maybeSingle<SiswaTanpaKode>();

  if (!siswa) {
    redirect('/masuk');
  }

  return (
    <StudentShell siswa={siswa} activeNav="baru" breadcrumb="Tulis jurnal baru">
      <JurnalForm
        mode="create"
        siswa={siswa}
        minDate={getMinDateJakarta()}
        maxDate={getTodayJakarta()}
      />
    </StudentShell>
  );
}
