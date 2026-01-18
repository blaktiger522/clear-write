import { Heart, Coffee } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {currentYear} ScribeScan</p>
          <a
            href="https://buymeacoffee.com/ClarifAI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Coffee className="w-4 h-4" />
            <span>Buy me a coffee</span>
          </a>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
