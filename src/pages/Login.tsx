
import { LoginForm } from "@/components/LoginForm";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <Logo size="lg" withText={true} className="text-white" />
        </Link>
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-white/70">
        <div className="container mx-auto px-4">
          © 2025 <Logo size="sm" withText={true} className="inline-flex mx-1 text-white" /> - Universidad Siglo 21 - Trabajo Final de Grado en Ingeniería de Software
        </div>
      </footer>
    </div>
  );
};

export default Login;
