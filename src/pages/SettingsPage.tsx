import { motion } from "framer-motion";
import { Settings, Globe, HardDrive, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your ScribeScan experience
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Language Settings - Read only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Recognition Language</h2>
                <p className="text-sm text-muted-foreground">
                  Language detection for handwritten documents
                </p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-foreground">Automatic</span>
              <p className="text-xs text-muted-foreground mt-1">
                ScribeScan automatically detects the language of your handwriting
              </p>
            </div>
          </motion.div>

          {/* Storage Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Data Storage</h2>
                <p className="text-sm text-muted-foreground">
                  Where your processed documents are stored
                </p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-foreground">Local Storage</span>
              <p className="text-xs text-muted-foreground mt-1">
                All processed documents are saved locally on your device. Your data never leaves your browser.
              </p>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-accent/50 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">About ScribeScan</h3>
                <p className="text-sm text-muted-foreground">
                  ScribeScan uses advanced AI-powered OCR technology to recognize and convert 
                  handwritten text into digital format. Your documents are processed locally 
                  in your browser for privacy.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Version 1.0.0
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;
