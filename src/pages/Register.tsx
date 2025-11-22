import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Flower2 } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    // TODO: Implement registration logic
    console.log("Register:", { name, email, password });
  };

  return (
    <div className="min-h-screen bg-peach-50 flex items-center justify-center px-6 py-12">
      {/* Background decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-peach-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight flex items-center gap-2 justify-center mb-8">
          <div className="w-2 h-2 bg-black-soft rounded-full"></div>
          PsyMind
        </Link>

        {/* Decorative Flower Icon */}
        <div className="flex justify-center mb-6 opacity-80">
          <div className="w-16 h-16 bg-peach-200 rounded-full flex items-center justify-center text-peach-600">
            <Flower2 className="w-8 h-8" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-peach-200/50 border border-peach-100 p-8">
          <h1 className="font-serif text-3xl text-black-soft mb-2 text-center">Comece sua jornada</h1>
          <p className="text-gray-600 text-center mb-8">Crie sua conta e organize sua mente</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black-soft font-medium">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-peach-200 focus:border-peach-500 focus:ring-peach-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black-soft font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-peach-200 focus:border-peach-500 focus:ring-peach-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black-soft font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-peach-200 focus:border-peach-500 focus:ring-peach-500"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black-soft font-medium">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-peach-200 focus:border-peach-500 focus:ring-peach-500"
                required
                minLength={6}
              />
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                className="rounded border-peach-300 text-peach-500 focus:ring-peach-500 mt-0.5" 
                required 
              />
              <label>
                Concordo com os{" "}
                <a href="#" className="text-peach-500 hover:text-peach-600 font-medium">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-peach-500 hover:text-peach-600 font-medium">
                  Política de Privacidade
                </a>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black-soft hover:bg-gray-800 text-white rounded-full py-6 text-base font-medium transition-all flex items-center justify-center gap-2"
            >
              Criar conta <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-peach-500 hover:text-peach-600 font-medium">
              Fazer login
            </Link>
          </div>
        </div>

        {/* Back to home link */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-peach-500 transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
