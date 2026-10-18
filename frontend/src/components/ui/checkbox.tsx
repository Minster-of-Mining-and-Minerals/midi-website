"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, ...props }, ref) => {
    return (
      <span className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <span
          onClick={() => onCheckedChange?.(!checked)}
          className={cn(
            "h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors cursor-pointer",
            checked
              ? "bg-primary border-primary text-white"
              : "border-slate-300 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900",
            className
          )}
        >
          {checked && <Check className="h-3 w-3 text-white stroke-[3]" />}
        </span>
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
