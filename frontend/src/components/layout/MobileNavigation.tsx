import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, CalendarDays, LayoutDashboard, Menu, X } from "lucide-react";
import { NavLink } from "react-router";

import Button from "@/components/ui/button";

import SidebarItem from "@/components/layout/SidebarItem";

const mobileItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Appointments",
    href: "/appointments",
    icon: CalendarDays,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: Activity,
  },
];

function MobileNavigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="grid h-16 grid-cols-4 items-center">
          {mobileItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  `flex h-full flex-col items-center justify-center gap-1 text-xs transition-colors ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <Button
            variant="ghost"
            className="flex h-full flex-col items-center justify-center gap-1 rounded-none text-xs text-muted-foreground"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open more navigation"
          >
            <Menu className="h-5 w-5" />
            <span>More</span>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(82vw,320px)] flex-col border-r border-border bg-card p-4 shadow-xl md:hidden"
            >
              <div className="flex h-12 items-center justify-between border-b border-border pb-3">
                <span className="font-semibold">MediContinuum</span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 space-y-2 overflow-y-auto py-5">
                <p className="mb-3 px-3 text-xs font-semibold text-muted-foreground">
                  NAVIGATION
                </p>

                {mobileItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    {...item}
                    onClick={() => setDrawerOpen(false)}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileNavigation;
