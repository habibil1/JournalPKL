import { Check, Clock, AlertCircle } from 'lucide-react';
import type { StatusJurnal } from '@/lib/types';

const STATUS_CONFIG: Record<
  StatusJurnal,
  { label: string; className: string; icon: typeof Check }
> = {
  disetujui: {
    label: 'Disetujui',
    className: 'bg-[#E6F4EA] text-[#1E7E34]',
    icon: Check,
  },
  diajukan: {
    label: 'Diajukan',
    className: 'bg-[#FEF7E0] text-[#B06000]',
    icon: Clock,
  },
  revisi: {
    label: 'Revisi',
    className: 'bg-[#FCE8E6] text-[#C5221F]',
    icon: AlertCircle,
  },
};

export function StatusBadge({ status }: { status: StatusJurnal }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
