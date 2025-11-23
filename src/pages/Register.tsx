import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Flower2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem!"
      });
      return;
    }
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      {/* Background decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight flex items-center gap-2 justify-center mb-8 text-foreground">
          <div className="w-2 h-2 bg-foreground rounded-full"></div>
          PsyMind
        </Link>

        {/* Decorative Flower Icon */}
        <div className="flex justify-center mb-6 opacity-80">
          <div className="w-16 h-16 bg-orange-200 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Flower2 className="w-8 h-8" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-2xl shadow-orange-200/50 dark:shadow-none border border-border p-8">
          <h1 className="font-serif text-3xl text-foreground mb-2 text-center">Comece sua jornada</h1>
          <p className="text-muted-foreground text-center mb-8">Crie sua conta e organize sua mente</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background"
                required
                minLength={6}
              />
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <input 
                type="checkbox" 
                className="rounded border-border text-orange-500 focus:ring-orange-500 mt-0.5" 
                required 
              />
              <label>
                Concordo com os{" "}
                <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                  Política de Privacidade
                </a>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-foreground hover:opacity-90 text-background rounded-full py-6 text-base font-medium transition-all flex items-center justify-center gap-2"
            >
              Criar conta <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Fazer login
            </Link>
          </div>
        </div>

        {/* Back to home link */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-orange-500 transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;