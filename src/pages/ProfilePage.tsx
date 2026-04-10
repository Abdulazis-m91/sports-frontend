import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
          navigate("/");
        }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      // tetap logout meski request gagal
    } finally {
      logout();
      toast.success("Berhasil logout");
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <div className="page-container flex flex-col min-h-screen">
      <Navbar user={user} />
      <PageTransition>
        <main className="flex-1 content-container py-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card glow-border p-10 w-full max-w-md text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-6 text-3xl font-display font-bold text-secondary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-display font-bold mb-1">{user.name}</h1>
            <div className="space-y-3 mt-6 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => navigate("/favorites")}
              className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2"
            >
              <Heart className="w-4 h-4" /> Lihat Favorit Saya
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full mt-3 text-destructive hover:bg-destructive/10 gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </motion.div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default ProfilePage;