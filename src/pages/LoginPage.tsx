import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import logo from "@/assets/logo.png";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);
  try {
    const response = await api.post("/login", { email, password });
    const { user, token } = response.data.data;
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setToken(token);
    setSuccess("Login berhasil! Mengalihkan...");
    setTimeout(() => navigate("/"), 1500);
  } catch (err: any) {
    setError(err.response?.data?.message || "Email atau password salah");
  } finally {
    setLoading(false);
  }
};

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-lg bg-card border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-foreground text-sm transition-all placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen flex relative">
      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <img src={logo} alt="Goal World" className="w-8 h-8 object-contain rounded" />
              <span className="font-display font-bold gradient-text">GOAL WORLD</span>
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground">Selamat Datang</h1>
            <p className="text-muted-foreground text-sm mt-2">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-accent/10 border border-accent/30 text-accent rounded-lg p-3 text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="nama@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 py-3"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-secondary hover:underline font-medium">
              Register
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(252 52% 23%), hsl(189 35% 43%))" }}
      >
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[hsl(145_30%_56%)] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[hsl(65_60%_73%)] rounded-full blur-[100px] opacity-15" />

        <div className="relative z-10 text-center px-12">
          <motion.img
            src={logo}
            alt="Goal World"
            className="w-40 h-40 object-contain mx-auto mb-8 drop-shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-display font-bold text-white mb-3"
          >
            GOAL WORLD
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-base max-w-sm mx-auto"
          >
            Skor & Pertandingan Global — Ikuti setiap momen di dunia sepak bola
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
