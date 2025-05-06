
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PasswordSecurityProps {
  attemptCount: number;
  setAttemptCount: (count: number) => void;
  onPasswordAttemptFailed: () => void;
}

export const usePasswordSecurity = () => {
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<Date | null>(null);
  
  // Check for existing block on component mount
  useEffect(() => {
    const blockedUntil = localStorage.getItem('passwordChangeBlockUntil');
    
    if (blockedUntil) {
      const blockEndTime = new Date(blockedUntil);
      
      if (blockEndTime > new Date()) {
        // Still in block period
        setIsBlocked(true);
        setBlockEndTime(blockEndTime);
        
        // Set timeout to clear the block
        const timeoutMs = blockEndTime.getTime() - Date.now();
        setTimeout(() => {
          setIsBlocked(false);
          setAttemptCount(0);
          setBlockEndTime(null);
          localStorage.removeItem('passwordChangeBlockUntil');
        }, timeoutMs);
      } else {
        // Block period has ended, clear it
        localStorage.removeItem('passwordChangeBlockUntil');
      }
    }
  }, []);
  
  const handleFailedAttempt = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    // Block after 5 failed attempts
    if (newAttemptCount >= 5) {
      const blockEndTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      setIsBlocked(true);
      setBlockEndTime(blockEndTime);
      
      // Store block time in localStorage
      localStorage.setItem('passwordChangeBlockUntil', blockEndTime.toISOString());
      
      // Set a timeout to unblock
      setTimeout(() => {
        setIsBlocked(false);
        setAttemptCount(0);
        setBlockEndTime(null);
        localStorage.removeItem('passwordChangeBlockUntil');
      }, 15 * 60 * 1000);
    }
  };
  
  const resetAttemptCount = () => {
    setAttemptCount(0);
  };
  
  return {
    attemptCount,
    isBlocked,
    blockEndTime,
    handleFailedAttempt,
    resetAttemptCount
  };
};

// Component to display block status message
export const BlockStatusMessage = ({ isBlocked, blockEndTime }: { isBlocked: boolean; blockEndTime: Date | null }) => {
  if (!isBlocked || !blockEndTime) return null;
  
  const remainingMinutes = Math.ceil((blockEndTime.getTime() - Date.now()) / 60000);
  
  return (
    <p className="text-sm text-destructive text-center">
      Cuenta bloqueada. Intente nuevamente en {remainingMinutes} minutos.
    </p>
  );
};
