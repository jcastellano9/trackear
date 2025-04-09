
import { RegisterForm } from "@/components/RegisterForm";
import { CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <CircleDollarSign className="h-8 w-8 text-white" />
          <span className="font-bold text-2xl text-white">TrackeArBit</span>
        </Link>
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-white/70">
        <div className="container mx-auto px-4">
          © 2025 TrackeArBit - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default Register;
