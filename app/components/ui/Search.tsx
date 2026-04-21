import { Search as SearchIcon } from "lucide-react";
import React from "react";

interface Props {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  width?: string;
}

export default function Search({
  searchQuery,
  setSearchQuery,
  width,
}: Props) {
  return (
    <div className={`relative flex-1 ${width ?? "min-w-64 max-w-md"}`}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cari menu..."
        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
