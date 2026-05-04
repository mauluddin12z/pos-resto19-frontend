import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { MenuInterface } from "@/types";
import { priceFormat } from "@/utils/priceFormat";

interface MenuSearchSelectProps {
  value: number;
  menus: MenuInterface[];
  onChange: (id: number) => void;
}

/* ── Searchable Menu Picker ─────────────────────────────── */
export default function MenuSearchSelect({
  value,
  menus,
  onChange,
}: MenuSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => menus.find((m) => m.menuId === value),
    [menus, value],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return menus;

    const q = query.toLowerCase();
    return menus.filter(
      (m) =>
        m.menuName.toLowerCase().includes(q) || String(m.menuId).includes(q),
    );
  }, [menus, query]);

  // close on outside click
  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // focus search when open
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
      >
        <span className="truncate">
          {selected
            ? `${selected.menuName} · ${priceFormat(selected.price)}`
            : "Pilih menu..."}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari menu..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* List */}
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                Tidak ditemukan
              </p>
            )}

            {filtered.map((menu) => (
              <button
                key={menu.menuId}
                type="button"
                onClick={() => {
                  onChange(menu.menuId);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                  menu.menuId === value ? "bg-accent font-semibold" : ""
                }`}
              >
                {/* image */}
                {menu.menuImageUrl && (
                  <img
                    src={menu.menuImageUrl}
                    alt={menu.menuName}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}

                {/* text */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{menu.menuName}</p>
                  <p className="text-xs text-muted-foreground">
                    {priceFormat(menu.price)}
                  </p>
                </div>

                {/* check */}
                {menu.menuId === value && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
