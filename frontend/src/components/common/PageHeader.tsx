import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  icon,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`w-full space-y-4 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "font-medium text-foreground"
                        : ""
                    }
                    aria-current={
                      index === breadcrumbs.length - 1 ? "page" : undefined
                    }
                  >
                    {item.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}

          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
