import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";

const emailSchema = z.string().email("E-mail inválido");
const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra");
const nameSchema = z
  .string()
  .min(1, "Preencha seu nome")
  .refine((val) => val.trim().split(/\s+/).length >= 2, {
    message: "Digite seu nome completo (nome e sobrenome)",
  });

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const validateField = (field: string, value: string) => {
    let error = "";

    try {
      if (field === "email") {
        emailSchema.parse(value);
      } else if (field === "password") {
        passwordSchema.parse(value);
      } else if (field === "name" && !isLogin) {
        nameSchema.parse(value);
      } else if (field === "confirmPassword" && !isLogin) {
        if (value !== formData.password) {
          error = "As senhas não conferem";
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        error = err.errors[0].message;
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: string) => {
    validateField(field, formData[field as keyof typeof formData]);
  };

  const isFormValid = () => {
    if (isLogin) {
      return (
        formData.email &&
        formData.password &&
        !errors.email &&
        !errors.password
      );
    } else {
      return (
        formData.name &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        acceptTerms &&
        !errors.name &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos os campos
    const fieldsToValidate = isLogin
      ? ["email", "password"]
      : ["name", "email", "password", "confirmPassword"];

    let isValid = true;
    fieldsToValidate.forEach((field) => {
      if (!validateField(field, formData[field as keyof typeof formData])) {
        isValid = false;
      }
    });

    if (!isValid) return;

    setIsLoading(true);

    // Simular chamada de API
    setTimeout(() => {
      setIsLoading(false);
      
      if (isLogin) {
        toast({
          title: "Bem-vindo(a) ao NextWork!",
          description: "Login efetuado com sucesso.",
        });
      } else {
        toast({
          title: "Conta criada com sucesso!",
          description: "Seja bem-vindo(a) à plataforma NextWork.",
        });
      }

      navigate("/seu-perfil");
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });
    setAcceptTerms(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setTimeout(() => {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "Em breve você poderá recuperar sua senha por e-mail.",
      });
      setShowForgotPassword(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar minimal />
      <div className="flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? "Bem-vindo de volta à NextWork"
              : "Comece sua jornada de transformação digital"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-elegant-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome - apenas no cadastro */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Digite sua senha" : "Crie uma senha"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-hint"}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              ) : !isLogin ? (
                <p id="password-hint" className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres, incluindo letra e número
                </p>
              ) : null}
            </div>

            {/* Confirmar Senha - apenas no cadastro */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    onBlur={() => handleBlur("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword ? "confirm-password-error" : undefined
                    }
                    className={
                      errors.confirmPassword ? "border-destructive pr-10" : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Lembrar-me / Esqueci a senha - apenas no login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Lembrar-me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Esqueci a senha
                </button>
              </div>
            )}

            {/* Aceitar termos - apenas no cadastro */}
            {!isLogin && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal cursor-pointer leading-relaxed"
                >
                  Ao criar a conta, você concorda com os{" "}
                  <a href="#" className="text-primary hover:underline">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a href="#" className="text-primary hover:underline">
                    Política de Privacidade
                  </a>
                </Label>
              </div>
            )}

            {/* Botão de submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading
                ? "Processando..."
                : isLogin
                ? "Entrar"
                : "Criar conta"}
            </Button>
          </form>

          {/* Toggle entre login e cadastro */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Auth;
