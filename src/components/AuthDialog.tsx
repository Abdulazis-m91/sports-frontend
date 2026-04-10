
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import { useState, useEffect } from "react";

type AuthMode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

const AuthDialog = ({ open, onClose, initialMode = "login" }: AuthDialogProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  useEffect(() => {
  setMode(initialMode);
}, [initialMode]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  
  const resetForm = () => {
    setName(""); setEmail(""); setPassword("");
    setConfirmPassword(""); setError(""); setSuccess(""); setLoading(false);
  };

  const switchMode = (newMode: AuthMode) => { resetForm(); setMode(newMode); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const response = await api.post("/login", { email, password });
        const { user, token } = response.data.data;
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setToken(token);
        toast.success("Login berhasil! Selamat datang 👋");
        onClose();
      } else {
        await api.post("/register", {
          name, email, password,
          password_confirmation: confirmPassword,
        });
        toast.success("Registrasi berhasil! Silakan login.");
        switchMode("login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-foreground text-sm transition-all placeholder:text-muted-foreground";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-card glow-border p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <img src={logo} alt="Goal World" className="w-36 h-36 object-contain mx-auto mb-3 rounded-xl" />
              <h2 className="text-xl font-display font-bold text-foreground">
                {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === "login" ? "Masuk ke akun Anda" : "Daftar untuk mulai menjelajahi"}
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm mb-4">
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/30 text-accent rounded-lg p-3 text-sm mb-4">
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Nama</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} placeholder="Nama lengkap" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="nama@email.com" />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} placeholder="••••••••" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Konfirmasi Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} placeholder="••••••••" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border-0 py-3">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Memproses..." : mode === "login" ? "Login" : "Register"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
              <button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")} className="text-secondary hover:underline font-medium">
                {mode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthDialog;