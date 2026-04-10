import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import logo from "@/assets/logo.png";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import AuthDialog from "@/components/AuthDialog";
import ProfileDialog from "@/components/ProfileDialog";

interface NavbarProps {
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

const Navbar = ({ user: propUser, onLogout }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: storeUser, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [profileOpen, setProfileOpen] = useState(false);

  const user = storeUser || propUser;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {}
    logout();
    onLogout?.();
    toast.success("Berhasil logout. Sampai jumpa! 👋");
    navigate("/");
  };

  const navLinks = user
    ? [{ to: "/favorites", label: "Favorit" }]
    : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-2xl transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-background/50" : ""}`}>
        <div className="content-container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo} alt="Sports App" className="w-9 h-9 object-contain rounded-lg" />
            <span className="text-xl font-display font-bold gradient-text">GOAL WORLD</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(link.to) ? "text-secondary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary rounded-full" />
                )}
              </Link>
            ))}

            <div className="w-px h-6 bg-border mx-2" />

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user ? (
              <>
                <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/10 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-secondary-foreground">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                </button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => openAuth("login")} className="text-muted-foreground hover:text-foreground">
                  Login
                </Button>
                <Button size="sm" onClick={() => openAuth("register")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0">
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground hover:text-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="content-container py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.to) ? "text-secondary bg-secondary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                {user ? (
                  <>
                    <button onClick={() => { setProfileOpen(true); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                        <span className="text-xs font-bold text-secondary-foreground">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-4 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => openAuth("login")} className="flex-1 text-muted-foreground">
                      Login
                    </Button>
                    <Button size="sm" onClick={() => openAuth("register")} className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0">
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
};

export default Navbar;