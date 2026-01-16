import { FileText, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8">
          {/* Top section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & tagline */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                  ScribeScan
                </span>
              </Link>
              <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
                Transform handwritten notes into clear, readable text with AI-powered recognition.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/history" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </Link>
              <Link 
                to="/settings" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              © {currentYear} ScribeScan. All rights reserved.
            </p>

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
              <span>&</span>
              <Sparkles className="w-4 h-4 text-primary" />
              <span>for clearer communication</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
