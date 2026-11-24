import { Search, X } from "lucide-react";

import Input, { type InputProps } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  inputProps?: Omit<InputProps, "value" | "onChange" | "placeholder">;
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
  inputProps,
}: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <Input
        {...inputProps}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-10 pl-9 ${
          value ? "pr-10" : "pr-3"
        } ${inputProps?.className ?? ""}`}
        aria-label={inputProps?.["aria-label"] ?? "Search"}
      />

      {value && !disabled && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
