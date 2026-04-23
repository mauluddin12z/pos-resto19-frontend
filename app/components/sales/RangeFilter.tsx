type RangeType = "thisWeek" | "thisMonth" | "thisYear";

const LABELS: Record<RangeType, string> = {
  thisWeek: "Minggu Ini",
  thisMonth: "Bulan Ini",
  thisYear: "Tahun Ini",
};

const OPTIONS: RangeType[] = ["thisWeek", "thisMonth", "thisYear"];

type Props = {
  value: string;
  onChange: (v: RangeType) => void;
  isLoading?: boolean;
};

function RangeFilterSkeleton() {
  return (
    <div className="flex gap-2 mb-4 animate-pulse">
      {OPTIONS.map((_, i) => (
        <div key={i} className="h-8 w-24 rounded-lg bg-gray-200" />
      ))}
    </div>
  );
}

export default function RangeFilter({ value, onChange, isLoading }: Props) {
  if (isLoading) return <RangeFilterSkeleton />;

  return (
    <div className="flex gap-2 mb-4">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            value === opt
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {LABELS[opt]}
        </button>
      ))}
    </div>
  );
}
