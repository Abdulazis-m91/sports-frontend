import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SkeletonCard from "@/components/SkeletonCard";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

interface FavoriteTeam {
  id: number;
  team_id: string;
  team_name: string;
  team_logo: string;
  league_name: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
  }),
};

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [favorites, setFavorites] = useState<FavoriteTeam[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
          navigate("/");
          return;
        }
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        setFavorites(response.data.data || []);
      } catch (err) {
        toast.error("Gagal memuat favorit");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const removeFavorite = async (teamId: string) => {
    try {
      await api.delete(`/favorites/${teamId}`);
      setFavorites((prev) => prev.filter((f) => f.team_id !== teamId));
      toast.success("Tim berhasil dihapus dari favorit 🗑️");
    } catch (err) {
      toast.error("Gagal menghapus favorit");
    }
  };

  return (
    <div className="page-container flex flex-col min-h-screen">
      <Navbar user={user} />
      <PageTransition>
        <main className="flex-1 content-container py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-display font-bold mb-8"
          >
            Tim <span className="gradient-text">Favorit Saya</span>
          </motion.h1>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="w-24 h-24 rounded-full bg-muted/80 flex items-center justify-center mb-2">
                <HeartOff className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-xl font-display font-semibold">Belum ada tim favorit</p>
              <p className="text-sm text-muted-foreground">Jelajahi liga dan tambahkan tim ke daftar favoritmu!</p>
              <Button onClick={() => navigate("/")} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                Jelajahi Liga
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {favorites.map((team, i) => (
                <motion.div
                  key={team.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="glass-card glow-border p-6 group transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-secondary/10"
                >
                  {team.team_logo ? (
                    <img src={team.team_logo} alt={team.team_name} className="w-16 h-16 object-contain mx-auto mb-4" />
                  ) : (
                    <div className="text-5xl mb-4 text-center">⚽</div>
                  )}
                  <h3 className="text-base font-display font-semibold text-center mb-1">{team.team_name}</h3>
                  {team.league_name && (
                    <p className="text-xs text-muted-foreground text-center mb-4">{team.league_name}</p>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => removeFavorite(team.team_id)}
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus dari Favorit
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default FavoritesPage;