import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorState from "@/components/ErrorState";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const HERO_SLIDES = [
  { title: "Rasakan Atmosfer Stadion", subtitle: "Saksikan pertandingan terbaik dari liga-liga top dunia", image: hero1 },
  { title: "Momen Kemenangan", subtitle: "Ikuti setiap gol dan selebrasi tim favoritmu", image: hero2 },
  { title: "Kejayaan Sang Juara", subtitle: "Pantau klasemen dan raih trofi bersama timmu", image: hero3 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
  }),
};

const SOCCER_LEAGUES = [
  "English Premier League",
  "Spanish La Liga",
  "Italian Serie A",
  "German Bundesliga",
  "French Ligue 1",
  "Dutch Eredivisie",
  "Portuguese Primeira Liga",
  "Major League Soccer",
];

// Memoized league card to avoid re-renders
const LeagueCard = memo(({ league, index, onClick }: { league: any; index: number; onClick: () => void }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    onClick={onClick}
    className="glass-card glow-border hover-glow p-8 cursor-pointer group transition-all duration-200 hover:scale-[1.03] hover:shadow-xl hover:shadow-secondary/10"
  >
    {league.logo ? (
      <img
        src={league.logo}
        alt={league.name}
        className="w-16 h-16 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          (target.nextSibling as HTMLElement).style.display = "block";
        }}
      />
    ) : null}
    <div
      className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-200"
      style={{ display: league.logo ? "none" : "block" }}
    >
      ⚽
    </div>
    <h3 className="text-lg font-display font-semibold text-center text-foreground group-hover:text-secondary transition-colors duration-200">
      {league.name}
    </h3>
    {league.country && (
      <p className="text-sm text-muted-foreground text-center mt-1">{league.country}</p>
    )}
  </motion.div>
));
LeagueCard.displayName = "LeagueCard";

const LeaguesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchLeagues = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get("/leagues");

      const allLeagues = response.data.data || [];
      const soccerLeagues = allLeagues.filter(
        (l: any) => l.strSport === "Soccer" && SOCCER_LEAGUES.includes(l.strLeague)
      );

      const mapped = soccerLeagues.map((l: any) => ({
        id: l.idLeague,
        name: l.strLeague,
        logo: null,
        country: l.strLeagueAlternate || "",
        leagueName: l.strLeague,
      }));

      setLeagues(mapped);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const filtered = useMemo(
    () => leagues.filter((l: any) => l.name.toLowerCase().includes(search.toLowerCase())),
    [leagues, search]
  );

  const handleLeagueClick = useCallback(
    (league: any) => {
      navigate(`/leagues/${encodeURIComponent(league.leagueName)}/teams`, {
        state: { leagueId: league.id, leagueName: league.name },
      });
    },
    [navigate]
  );

  return (
    <div className="page-container flex flex-col min-h-screen">
      <Navbar user={user} />
      <PageTransition>
        <main className="flex-1">
          {/* Hero Carousel */}
          <div className="relative w-full h-[420px] sm:h-[500px] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={HERO_SLIDES[currentSlide].image}
                  alt={HERO_SLIDES[currentSlide].title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-3 drop-shadow-lg">
                    {HERO_SLIDES[currentSlide].title}
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto drop-shadow">
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-background/70 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-background/70 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? "bg-secondary w-8" : "bg-foreground/30 hover:bg-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title + Search */}
          <div className="content-container py-12 sm:py-16 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-5xl font-display font-bold mb-3"
            >
              Masuki Dunia <span className="gradient-text">Liga Olahraga</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto"
            >
              Ikuti setiap pertandingan dan dukung tim favoritmu
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari liga favorit kamu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-card border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/30 outline-none text-foreground placeholder:text-muted-foreground transition-all text-base"
              />
            </motion.div>
          </div>

          {/* League Grid */}
          <div className="content-container pb-20">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <ErrorState onRetry={fetchLeagues} />
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-20 gap-3"
              >
                <span className="text-6xl">🔍</span>
                <p className="text-lg font-display font-semibold text-foreground">Liga tidak ditemukan</p>
                <p className="text-sm text-muted-foreground">Coba kata kunci yang berbeda</p>
              </motion.div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Menampilkan {filtered.length} dari {leagues.length} liga
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.map((league: any, i: number) => (
                    <LeagueCard
                      key={league.id}
                      league={league}
                      index={i}
                      onClick={() => handleLeagueClick(league)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default LeaguesPage;
