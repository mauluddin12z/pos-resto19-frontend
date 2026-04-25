"use client";

import RangeFilter from "../sales/RangeFilter";
import { FormInput } from "../ui/FormInput";

export default function GlobalFilter({
  filters,
  updateFilter,
  setDate,
  setDateRange,
  isLoading,
}: any) {
  return (
    <section className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold">Filter Global</h2>
          <p className="text-xs text-muted-foreground">
            Semua ringkasan mengikuti filter ini.
          </p>
        </div>

        <RangeFilter
          value={filters.dateRange}
          onChange={setDateRange}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <FormInput
          type="date"
          value={filters.fromDate || ""}
          onChange={(e) => setDate("fromDate", e.target.value)}
        />

        <FormInput
          type="date"
          value={filters.toDate || ""}
          onChange={(e) => setDate("toDate", e.target.value)}
        />

        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.paymentStatus}
          onChange={(e) => updateFilter("paymentStatus", e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="paid">Lunas</option>
          <option value="unpaid">Belum Bayar</option>
        </select>

        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={filters.paymentMethod}
          onChange={(e) => updateFilter("paymentMethod", e.target.value)}
        >
          <option value="">Semua Metode</option>
          <option value="CASH">Tunai</option>
          <option value="QRIS">QRIS</option>
          <option value="BANK">Kartu</option>
        </select>
      </div>
    </section>
  );
}
