import { Link, useLocation } from "react-router-dom";
import { FileText, History, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", icon: FileText },
    { to: "/history", label: "History", icon: History },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 overflow-hidden"
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
                <FileText className="w-5 h-5 text-primary-foreground relative z-10" />
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                    ScribeScan
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-primary/60 hidden sm:block" />
                </div>
                <span className="text-[10px] text-muted-foreground hidden sm:block leading-none tracking-wide uppercase">
                  AI Handwriting
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-0.5 bg-muted/40 backdrop-blur-sm rounded-full p-1 border border-border/50">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative"
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-background rounded-full shadow-sm border border-border/50"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className={`
                      relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                      }
                    `}>
                      <Icon className={`w-4 h-4 transition-colors ${active ? "text-primary" : ""}`} />
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-2xl border-t border-border/30 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
              >
                {active && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div 
                  className="relative z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground"}`} />
                </motion.div>
                <span className={`relative z-10 text-[11px] font-medium transition-colors duration-200 ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Header;
