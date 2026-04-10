import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, Building, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SkeletonBanner, SkeletonMatches, SkeletonStandings } from "@/components/SkeletonCard";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";

const sectionAnim = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const getZone = (pos: number, total: number) => {
  if (pos <= 4) return { color: "border-l-blue-500", badge: "UCL", badgeColor: "bg-blue-500/20 text-blue-400" };
  if (pos <= 6) return { color: "border-l-orange-500", badge: "UEL", badgeColor: "bg-orange-500/20 text-orange-400" };
  if (pos === 7) return { color: "border-l-emerald-400", badge: "UECL", badgeColor: "bg-emerald-400/20 text-emerald-400" };
  if (pos > total - 3) return { color: "border-l-red-500", badge: "Degradasi", badgeColor: "bg-red-500/20 text-red-400" };
  return { color: "border-l-transparent", badge: "", badgeColor: "" };
};

const TeamDetailPage = () => {
  const { teamId } = useParams();
  console.log("TeamID:", teamId);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [team, setTeam] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const leagueId = location.state?.leagueId;
  const leagueName = location.state?.leagueName || "Liga";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [teamRes, matchRes] = await Promise.all([
          api.get(`/teams/${teamId}`),
          api.get(`/teams/${teamId}/previous-matches`),
        ]);
        setTeam(teamRes.data.data);
        setMatches(matchRes.data.data?.slice(0, 5) || []);

        if (leagueId) {
          const standRes = await api.get(`/leagues/${leagueId}/standings`);
          setStandings(standRes.data.data || []);
        }

        if (user) {
          const favRes = await api.get("/favorites");
          const favs = favRes.data.data || [];
          setIsFavorite(favs.some((f: any) => f.team_id === teamId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [teamId, leagueId, user]);

  const toggleFavorite = async () => {
    if (!user) { toast.error("Silakan login terlebih dahulu"); return; }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${teamId}`);
        setIsFavorite(false);
        toast.success("Tim dihapus dari favorit");
      } else {
        await api.post("/favorites", {
          team_id: teamId,
          team_name: team?.strTeam,
          team_logo: team?.strBadge,
          league_id: leagueId,
          league_name: leagueName,
        });
        setIsFavorite(true);
        toast.success("Tim ditambahkan ke favorit ❤️");
      }
    } catch (err) {
      toast.error("Gagal mengubah favorit");
    } finally {
      setFavLoading(false);
    }
  };

  const convertToWIB = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "-";
    try {
      const dt = new Date(`${dateStr}T${timeStr || "00:00:00"}Z`);
      return dt.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }) + " WIB";
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="page-container flex flex-col min-h-screen">
        <Navbar user={user} />
        <main className="flex-1">
          <SkeletonBanner />
          <div className="content-container py-12 space-y-12">
            <SkeletonMatches />
            <SkeletonStandings />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col min-h-screen">
      <Navbar user={user} />
      <PageTransition>
        <main className="flex-1">
          <motion.div {...sectionAnim(0)}>
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              <div className="content-container relative py-12 sm:py-20">
                <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
                  <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Home className="w-3.5 h-3.5" /> Home
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="hover:text-foreground cursor-pointer" onClick={() => navigate(-1)}>{leagueName}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-foreground font-medium">{team?.strTeam}</span>
                </nav>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {team?.strBadge ? (
                    <img src={team.strBadge} alt={team.strTeam} className="w-28 h-28 object-contain" />
                  ) : (
                    <div className="text-8xl">⚽</div>
                  )}
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-5xl font-display font-bold mb-3">{team?.strTeam}</h1>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-muted-foreground text-sm">
                      {team?.intFormedYear && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Berdiri: {team.intFormedYear}</span>}
                      {team?.strStadium && <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {team.strStadium}</span>}
                      {team?.strCountry && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {team.strCountry}</span>}
                    </div>
                    {team?.strDescriptionEN && (
                      <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed line-clamp-3">{team.strDescriptionEN}</p>
                    )}
                    <div className="mt-5">
                      <Button
                        onClick={toggleFavorite}
                        disabled={favLoading}
                        className={isFavorite
                          ? "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20"
                          : "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20"
                        }
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                        {isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="content-container py-12 space-y-12 pb-20">
            {/* Matches */}
            <motion.div {...sectionAnim(0.2)}>
              <h2 className="text-2xl font-display font-bold mb-6">Pertandingan Terakhir</h2>
              {matches.length === 0 ? (
                <p className="text-muted-foreground">Tidak ada data pertandingan.</p>
              ) : (
                <div className="space-y-3">
                  {matches.map((match, i) => (
                    <motion.div
                      key={match.idEvent}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
                      className="glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform"
                    >
                      <span className="text-sm font-medium flex-1 text-right">{match.strHomeTeam}</span>
                      <div className="mx-4 px-4 py-1 rounded-lg bg-secondary/20 font-display font-bold text-lg min-w-[80px] text-center">
                        {match.intHomeScore} - {match.intAwayScore}
                      </div>
                      <span className="text-sm font-medium flex-1">{match.strAwayTeam}</span>
                      <span className="text-xs text-muted-foreground ml-4 hidden sm:block">
                        {convertToWIB(match.dateEvent, match.strTime)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Standings */}
            {standings.length > 0 && (
              <motion.div {...sectionAnim(0.4)}>
                <h2 className="text-2xl font-display font-bold mb-6">Klasemen Liga</h2>
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                          <th className="py-3 px-3 text-left w-10">#</th>
                          <th className="py-3 px-3 text-left">Tim</th>
                          <th className="py-3 px-3 text-center">M</th>
                          <th className="py-3 px-3 text-center">W</th>
                          <th className="py-3 px-3 text-center">D</th>
                          <th className="py-3 px-3 text-center">L</th>
                          <th className="py-3 px-3 text-center">GF</th>
                          <th className="py-3 px-3 text-center">GA</th>
                          <th className="py-3 px-3 text-center font-bold">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((s: any) => {
                          const pos = parseInt(s.intRank);
                          const zone = getZone(pos, standings.length);
                          const isCurrent = s.strTeam === team?.strTeam;
                          return (
                            <tr key={s.intRank} className={`border-b border-border/50 border-l-4 ${zone.color} hover:bg-secondary/10 transition-colors ${isCurrent ? "bg-secondary/10" : ""}`}>
                              <td className="py-3 px-3 text-sm font-bold">{s.intRank}</td>
                              <td className="py-3 px-3 text-sm">
                                <div className="flex items-center gap-2">
                                  {s.strBadge && <img src={s.strBadge} alt={s.strTeam} className="w-5 h-5 object-contain" />}
                                  <span className={isCurrent ? "font-bold text-secondary" : "font-medium"}>{s.strTeam}</span>
                                  {zone.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${zone.badgeColor}`}>{zone.badge}</span>}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-sm text-center text-muted-foreground">{s.intPlayed}</td>
                              <td className="py-3 px-3 text-sm text-center text-accent">{s.intWin}</td>
                              <td className="py-3 px-3 text-sm text-center text-muted-foreground">{s.intDraw}</td>
                              <td className="py-3 px-3 text-sm text-center text-destructive">{s.intLoss}</td>
                              <td className="py-3 px-3 text-sm text-center text-muted-foreground">{s.intGoalsFor}</td>
                              <td className="py-3 px-3 text-sm text-center text-muted-foreground">{s.intGoalsAgainst}</td>
                              <td className={`py-3 px-3 text-sm text-center font-bold ${isCurrent ? "text-secondary" : ""}`}>{s.intPoints}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" /> Champions League</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-500" /> Europa League</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400" /> Conference League</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500" /> Zona Degradasi</div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default TeamDetailPage;