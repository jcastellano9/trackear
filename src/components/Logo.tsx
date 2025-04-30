
import { CircleDollarSign } from "lucide-react";
import { motion } from "framer-motion";

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
      <motion.div 
        className="relative"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-400 opacity-70 rounded-full blur-[6px] -z-10"></div>
        <CircleDollarSign className={`${sizes[size]} text-primary`} />
      </motion.div>
      {withText && (
        <motion.span 
          className={`font-bold ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"} bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          TrackeArBit
        </motion.span>
      )}
    </div>
  );
}
