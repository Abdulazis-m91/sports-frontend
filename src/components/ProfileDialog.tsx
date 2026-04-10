import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog = ({ open, onClose }: ProfileDialogProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {}
    logout();
    toast.success("Berhasil logout. Sampai jumpa! 👋");
    onClose();
    navigate("/");
  };

  const handleFavorites = () => {
    onClose();
    navigate("/favorites");
  };

  if (!user) return null;

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
            className="relative w-full max-w-sm glass-card glow-border p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-4 text-3xl font-display font-bold text-secondary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">{user.name}</h2>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <Button
              onClick={handleFavorites}
              className="w-full mb-3 bg-primary text-primary-foreground hover:bg-primary/90 border-0 gap-2"
            >
              <Heart className="w-4 h-4" /> Lihat Favorit Saya
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10 gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDialog;