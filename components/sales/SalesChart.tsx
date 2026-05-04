import { priceFormat } from "@/utils/priceFormat";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  data: any[];
  title: string;
  isLoading?: boolean;
};

function SalesChartSkeleton() {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <div className="h-4 w-48 bg-gray-300 rounded mb-4 animate-pulse" />

      <div className="h-64 w-full animate-pulse bg-gray-100 rounded" />
    </section>
  );
}

export default function SalesChart({ data, title, isLoading }: Props) {
  if (isLoading) return <SalesChartSkeleton />;

  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <h2 className="mb-4 font-bold">{title}</h2>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip
              contentStyle={{ borderRadius: 8 }}
              formatter={(v: any) => priceFormat(v)}
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
