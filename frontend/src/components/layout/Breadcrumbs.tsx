import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router";

interface BreadcrumbsProps {
  labels?: Record<string, string>;
  className?: string;
  showHome?: boolean;
}

function Breadcrumbs({
  labels = {},
  className = "",
  showHome = true,
}: BreadcrumbsProps) {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`;

    return {
      label:
        labels[path] ??
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (character) => character.toUpperCase()),
      path,
    };
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {showHome && (
          <li className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>

            {breadcrumbs.length > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </li>
        )}

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
