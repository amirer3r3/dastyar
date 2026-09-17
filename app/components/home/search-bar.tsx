import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "جستجو در کاربرگ‌ها، سوالات و ابزارها...",
}: {
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-card px-4 py-2.5 shadow-sm shadow-black/5 ring-1 ring-black/5 transition-shadow focus-within:shadow-md">
      <Search size={18} className="shrink-0 text-muted" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label="جستجو"
        className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
      />
    </div>
  );
}
