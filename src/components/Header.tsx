import { Link, useLocation } from "react-router-dom";
import { FileText, History, Settings } from "lucide-react";
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
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <FileText className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                  ScribeScan
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:block leading-none">
                  Handwriting Recognition
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-muted/50 rounded-full p-1">
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
                        className="absolute inset-0 bg-background rounded-full shadow-sm"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className={`
                      relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                      }
                    `}>
                      <Icon className="w-4 h-4" />
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2"
              >
                {active && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute inset-x-2 top-1 bottom-1 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div 
                  className="relative z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                </motion.div>
                <span className={`relative z-10 text-xs font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
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
