import { FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">ScribeScan</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Handwriting Recognition
              </p>
            </div>
          </div>

          {/* Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Powered by AI
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
