
import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const session = useSession();
  
  useEffect(() => {
    if (!session) {
      toast.error("Debes iniciar sesión para acceder a esta página");
    }
  }, []);
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

export default PrivateRoute;
