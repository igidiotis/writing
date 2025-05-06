import { cn } from "../../lib/utils";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variantClasses = {
      primary: "button-primary",
      secondary: "button-secondary",
      ghost: "text-foreground hover:bg-secondary/60",
    };

    const sizeClasses = {
      sm: "text-sm px-3 py-1",
      md: "px-4 py-2",
      lg: "text-lg px-5 py-3",
    };

    return (
      <button
        className={cn(
          "button",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button }; 