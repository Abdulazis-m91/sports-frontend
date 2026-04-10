import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Home, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorState from "@/components/ErrorState";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

interface Team {
  id: string;
  name: string;
  logo: string;
  country: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
};

const TeamsPage = () => {
  const navigate = useNavigate();
  const { leagueName } = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const leagueId = location.state?.leagueId;
  const displayName = location.state?.leagueName || leagueName?.replace(/-/g, " ") || "Liga";

  useEffect(() => {
    const fetchTeams = async () => {
      if (!leagueId) { setError(true); setLoading(false); return; }
      try {
        setLoading(true);
        setError(false);
        const response = await api.get(`/leagues/${leagueId}/teams`);
        const raw = response.data.data || [];
        const mapped = raw.map((t: any) => ({
          id: t.idTeam,
          name: t.strTeam,
          logo: t.strBadge || t.strTeamBadge || null,
          country: t.strCountry || "",
        }));
        setTeams(mapped);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [leagueId]);

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container flex flex-col min-h-screen">
      <Navbar user={user} />
      <PageTransition>
        <main className="flex-1 content-container py-8 pt-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 mt-0">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
              <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Home className="w-3.5 h-3.5" /> Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-medium">{displayName}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-display font-bold">
              Tim di <span className="gradient-text">{displayName}</span>
            </h1>
          </motion.div>

          {!loading && !error && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 space-y-3">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama tim..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-card border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/30 outline-none text-foreground placeholder:text-muted-foreground transition-all text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Menampilkan {filtered.length} dari {teams.length} tim</p>
            </motion.div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <ErrorState onRetry={() => { setError(false); setLoading(true); }} />
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 gap-3">
              <span className="text-6xl">🔍</span>
              <p className="text-lg font-display font-semibold">Tim tidak ditemukan</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-12">
              <AnimatePresence mode="popLayout">
                {filtered.map((team, i) => (
                  <motion.div
                    key={team.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    onClick={() => navigate(`/team/${team.id}`, { state: { leagueId, leagueName: displayName } })}
                    className="glass-card glow-border hover-glow p-6 cursor-pointer group transition-all duration-200 hover:scale-[1.03]"
                  >
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-14 h-14 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="text-4xl mb-3 text-center">⚽</div>
                    )}
                    <h3 className="text-base font-display font-semibold text-center group-hover:text-secondary transition-colors">{team.name}</h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">{team.country}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default TeamsPage;