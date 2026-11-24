import { Menu, Search } from "lucide-react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import ProfileDropdown from "@/components/layout/ProfileDropdown";
import NotificationBell from "@/components/layout/NotificationBell";

interface TopbarProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
}

function Topbar({ onMenuClick, showSearch = true }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {showSearch && (
          <div className="relative hidden w-full max-w-sm sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
              aria-label="Search"
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default Topbar;
