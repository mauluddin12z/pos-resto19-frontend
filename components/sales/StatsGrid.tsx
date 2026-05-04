import StatsCard from "./StatsCard";

export default function StatsGrid({ stats }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s: any) => (
        <StatsCard key={s.label} {...s} />
      ))}
    </div>
  );
}
