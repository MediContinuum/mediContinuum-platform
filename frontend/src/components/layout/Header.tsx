import type { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

function Header({ title, description, actions, className = "" }: HeaderProps) {
  return (
    <header
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="min-w-0 space-y-1">
        {title && (
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}

export default Header;
