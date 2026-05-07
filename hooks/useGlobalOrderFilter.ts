"use client";

import { useState, useCallback, useEffect } from "react";

export interface GlobalFilterState {
  page: number;
  pageSize: number;

  searchQuery: string;

  paymentStatus?: string;
  paymentMethod?: string;

  sort: string;

  fromDate?: string;
  toDate?: string;
  dateRange?: string;
}

export default function useGlobalFilter(initial?: Partial<GlobalFilterState>) {
  const [filters, setFilters] = useState<GlobalFilterState>({
    page: 1,
    pageSize: 10,

    searchQuery: "",

    paymentStatus: "paid",
    paymentMethod: "",

    sort: "-createdAt",

    fromDate: "",
    toDate: "",
    dateRange: "",

    ...initial,
  });

  const updateFilter = useCallback(
    (
      key: keyof GlobalFilterState,
      value: any,
      options?: { resetPage?: boolean },
    ) => {
      const resetPage = options?.resetPage ?? true;
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        ...(resetPage ? { page: 1 } : {}),
      }));
    },
    [],
  );

  const setDateRange = useCallback((range: string) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
      fromDate: "",
      toDate: "",
      page: 1,
    }));
  }, []);

  const setDate = useCallback((key: "fromDate" | "toDate", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      dateRange: "",
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 10,

      searchQuery: "",

      paymentStatus: "",
      paymentMethod: "",

      sort: "-createdAt",

      fromDate: "",
      toDate: "",
    });
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    setDateRange,
    setDate,
    resetFilters,
  };
}
