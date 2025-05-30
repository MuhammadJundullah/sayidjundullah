"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Archive } from "lucide-react";

interface StatusDropdownProps {
  currentStatus: "published" | "archived";
  onStatusChange: (newStatus: "published" | "archived") => void;
}

const StatusDropdown = ({
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) => {
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = (newStatus: "published" | "archived") => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="capitalize hover:cursor-pointer">
          {status === "published" ? (
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Archive className="mr-2 h-4 w-4 text-yellow-500" />
          )}
          {status}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange("published")}
          className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>Published</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("archived")}
          className="flex items-center gap-2">
          <Archive className="h-4 w-4 text-yellow-500" />
          <span>Archived</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
