import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

export declare const Button: React.ForwardRefExoticComponent<ButtonProps>; 