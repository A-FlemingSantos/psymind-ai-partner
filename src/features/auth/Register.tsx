import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ArrowRight, Flower2, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string; confirmPassword?: string}>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; password?: string; confirmPassword?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "As senhas não coincidem!"
        });
      }
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Conta criada!",
      description: "Bem-vindo ao PsyMind",
    });
    
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
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({...errors, name: undefined});
                }}
                className={`rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background transition-all ${
                  errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({...errors, email: undefined});
                }}
                className={`rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background transition-all ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: undefined});
                  }}
                  className={`rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background pr-10 transition-all ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Removed Password Strength Indicator Block */}
              {errors.password && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
                  }}
                  className={`rounded-xl border-border focus:border-orange-500 focus:ring-orange-500 bg-background pr-10 transition-all ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  } ${
                    confirmPassword && password === confirmPassword && !errors.confirmPassword
                      ? 'border-green-500 focus:border-green-500' : ''
                  }`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                  <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 animate-fade-in">{errors.confirmPassword}</p>
              )}
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
              disabled={isLoading}
              className="w-full bg-foreground hover:opacity-90 text-background rounded-full py-6 text-base font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta <ArrowRight className="w-4 h-4" />
                </>
              )}
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