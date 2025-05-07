
import { LoginForm } from "@/components/LoginForm";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-0">
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300}px`,
                height: `${Math.random() * 300}px`,
                filter: 'blur(50px)',
                animation: `pulse ${5 + Math.random() * 10}s infinite alternate ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <Logo size="lg" withText={true} className="text-white" />
          </Link>
        </motion.div>
      </div>

      <main className="flex-grow flex items-center justify-center p-4 z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <LoginForm />
          
          <div className="mt-4 text-center">
            <Link 
              to="/reset-password" 
              className="text-sm text-white/80 hover:text-white underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-sm text-white/70 z-10">
        <div className="container mx-auto px-4">
          © 2025 - TrackeAr
        </div>
      </footer>
    </div>
  );
};

export default Login;
