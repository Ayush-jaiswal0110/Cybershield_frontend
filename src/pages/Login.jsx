import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeProvider";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("admin");

  // Force theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      if (response?.success) {
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_role", loginType);

        toast.success("Login successful! Redirecting...");

        setTimeout(() => {
          navigate(loginType === "admin" ? "/dashboard" : "/user-dashboard");
        }, 1500);
      } else {
        toast.error(response?.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);

      const validCredentials = {
        admin: [
          { email: "admin@CyberShield.com", password: "admin123" },
          { email: "harpriya.sandhu@gmail.com", password: "admin123" },
        ],
        user: [
          { email: "ariz@reqpedia.com", password: "user123" },
          { email: "arpit@reqpedia.com", password: "user123" },
          { email: "rishav@reqpedia.com", password: "user123" },
          { email: "somnath@reqpedia.com", password: "user123" },
          { email: "harpriya@reqpedia.com", password: "user123" },
        ],
      };

      const isValid = validCredentials[loginType].some(
        (cred) => cred.email === email && cred.password === password
      );

      if (isValid) {
        localStorage.setItem("auth_token", "demo-token-12345");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role: loginType,
            name: email
              .split("@")[0]
              .replace(".", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          })
        );
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_role", loginType);

        toast.success("Login successful! Redirecting...");

        setTimeout(() => {
          navigate(loginType === "admin" ? "/dashboard" : "/user-dashboard");
        }, 1500);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-primary/20"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield size={48} />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-chart-1/20"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lock size={40} />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        {/* 🔹 Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-2xl">
          <CardHeader className="space-y-3 text-center">
            <motion.div
              className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary), 0.4)",
                  "0 0 0 20px rgba(var(--primary), 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl">CyberShield</CardTitle>
            <CardDescription>CyberShield AI Defense System</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Login Type Selector */}
            <div className="mb-6">
              <div className="flex bg-muted rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setLoginType("admin")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                    loginType === "admin"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("user")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                    loginType === "user"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" /> User
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPasswordCheck"
                  checked={showPassword}
                  onCheckedChange={(checked) => setShowPassword(checked)}
                />
                <label
                  htmlFor="showPasswordCheck"
                  className="text-sm cursor-pointer"
                >
                  Show password
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Shield className="h-5 w-5" />
                    </motion.div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Helper */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Admin:</strong> admin@CyberShield.com / admin123
                </p>
                <p>
                  <strong>User:</strong> ariz@reqpedia.com / user123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
