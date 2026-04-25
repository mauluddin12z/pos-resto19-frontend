import { priceFormat } from "@/app/utils/priceFormat";

type Props = {
  data: any[];
  isLoading?: boolean;
};

function CategoryListSkeleton() {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow animate-pulse">
      <div className="h-4 w-40 bg-gray-300 rounded mb-4" />

      <ul className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-300 rounded" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CategoryList({ data = [], isLoading }: Props) {
  if (isLoading) return <CategoryListSkeleton />;

  if (!data.length) {
    return (
      <section className="rounded-2xl border bg-white p-5 shadow">
        <h2 className="mb-4 font-bold">Kategori Terlaris</h2>

        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
          <p className="text-sm font-medium">Belum ada data</p>
          <p className="text-xs">Belum ada penjualan per kategori</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <h2 className="mb-4 font-bold">Kategori Terlaris</h2>

      <ul className="space-y-2">
        {data.map((c: any) => (
          <li key={c.name} className="flex justify-between text-sm">
            <span>{c.name}</span>
            <span className="font-bold">{priceFormat(c.total)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
