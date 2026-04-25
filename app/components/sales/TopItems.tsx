import { priceFormat } from "@/app/utils/priceFormat";
import Image from "next/image";

type Props = {
  items: any[];
  isLoading?: boolean;
};

function TopItemsSkeleton() {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <div className="h-4 w-40 bg-gray-300 rounded mb-4 animate-pulse" />

      <ul className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-7 w-7 rounded-full bg-gray-200" />
            <div className="h-10 w-10 rounded-lg bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-2 w-20 bg-gray-300 rounded" />
            </div>

            <div className="h-3 w-16 bg-gray-300 rounded" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TopItems({ items = [], isLoading }: Props) {
  if (isLoading) return <TopItemsSkeleton />;

  if (!items.length) {
    return (
      <section className="rounded-2xl border bg-white p-5 shadow">
        <h2 className="mb-4 font-bold">Menu Terlaris</h2>

        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
          <p className="text-sm font-medium">Belum ada data</p>
          <p className="text-xs">Menu belum memiliki penjualan</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <h2 className="mb-4 font-bold">Menu Terlaris</h2>

      <ul className="flex flex-col gap-3">
        {items.map((data: any, idx: number) => (
          <li key={data.item.menuId} className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
              {idx + 1}
            </span>

            <Image
              src={data.item.menuImageUrl || "/no-image.png"}
              alt={data.item.menuName}
              width={80}
              height={80}
              className="h-10 w-10 rounded-lg object-cover"
              unoptimized
            />

            <div className="flex-1">
              <p className="text-sm font-semibold">{data.item.menuName}</p>
              <p className="text-xs text-gray-500">{data.sold} terjual</p>
            </div>

            <p className="text-sm font-bold">{priceFormat(data.revenue)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
