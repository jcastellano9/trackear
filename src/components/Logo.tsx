
import { CircleDollarSign } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

export function Logo({ size = "md", withText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <CircleDollarSign className={`${sizes[size]} text-primary`} />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-400 opacity-50 rounded-full blur-[2px] -z-10"></div>
      </div>
      {withText && (
        <span className={`font-bold ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"}`}>
          TrackeArBit
        </span>
      )}
    </div>
  );
}
