import type { ReactNode } from "react";
import { Outlet } from "react-router";

interface AppLayoutProps {
  children?: ReactNode;
  className?: string;
}

function AppLayout({ children, className = "" }: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      {children ?? <Outlet />}
    </div>
  );
}

export default AppLayout;
