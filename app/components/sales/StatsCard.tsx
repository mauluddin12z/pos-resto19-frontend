import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
  bg: string;
  tone: string;
};

export default function StatsCard({
  label,
  value,
  icon: Icon,
  bg,
  tone,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow">
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
      >
        <Icon className={`h-5 w-5 ${tone}`} />
      </div>

      <p className="mt-3 text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}