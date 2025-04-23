// src/components/ui.d.ts
declare module "@/components/ui/button" {
  import { ComponentType } from "react";

  interface ButtonProps {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  }

  const Button: ComponentType<
    ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
  >;
  export default Button;
}
