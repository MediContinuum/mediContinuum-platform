import { Building2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  value: string;
  onChange: (workspaceId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function WorkspaceSwitcher({
  workspaces,
  value,
  onChange,
  placeholder = "Select workspace",
  disabled = false,
  className = "",
}: WorkspaceSwitcherProps) {
  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || workspaces.length === 0}
      >
        <SelectTrigger className="w-full min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default WorkspaceSwitcher;
