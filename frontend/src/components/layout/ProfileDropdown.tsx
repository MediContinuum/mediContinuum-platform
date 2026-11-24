import { LogOut, Settings, User, UserRound } from "lucide-react";
import { useNavigate } from "react-router";

import Button from "@/components/ui/button";

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileDropdownProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

function ProfileDropdown({
  name = "User",
  email = "",
  avatarUrl,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: ProfileDropdownProps) {
  const navigate = useNavigate();

  const handleProfile = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate("/profile");
    }
  };

  const handleSettings = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate("/settings");
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-10 items-center gap-2 px-2"
          aria-label="Open profile menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
            {name}
          </span>
        </Button>
      </DropdownTrigger>

      <DropdownContent align="end" className="w-56">
        <DropdownLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium">{name}</span>
            {email && (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {email}
              </span>
            )}
          </div>
        </DropdownLabel>

        <DropdownSeparator />

        <DropdownItem onSelect={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownItem>

        <DropdownItem onSelect={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownItem>

        <DropdownSeparator />

        <DropdownItem
          onSelect={onLogout}
          disabled={!onLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export default ProfileDropdown;
