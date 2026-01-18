import { motion } from "framer-motion";
import { Settings, Globe, HardDrive, Info, FileText, Shield, MessageCircle, Mail, Heart, Coffee } from "lucide-react";
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

          {/* Terms of Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Terms of Use</h2>
                <p className="text-sm text-muted-foreground">
                  Our terms and conditions
                </p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg px-4 py-3 text-sm text-muted-foreground space-y-2">
              <p>
                By using ScribeScan, you agree to use the service for lawful purposes only. 
                You retain ownership of all content you upload and process through our service.
              </p>
              <p>
                ScribeScan is provided "as is" without warranties. We are not liable for any 
                errors in text recognition or data loss. Use of the service is at your own risk.
              </p>
            </div>
          </motion.div>

          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Privacy Policy</h2>
                <p className="text-sm text-muted-foreground">
                  How we handle your data
                </p>
              </div>
            </div>

            <div className="bg-accent/50 rounded-lg px-4 py-3 text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Data Processing:</strong> All document processing 
                happens locally in your browser. Your images and text are never uploaded to our servers.
              </p>
              <p>
                <strong className="text-foreground">Storage:</strong> Processed documents are stored 
                only on your device using local browser storage. We have no access to your data.
              </p>
              <p>
                <strong className="text-foreground">No Tracking:</strong> We do not collect personal 
                information, use cookies for tracking, or share any data with third parties.
              </p>
            </div>
          </motion.div>

          {/* Feedback & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Feedback & Support</h2>
                <p className="text-sm text-muted-foreground">
                  We'd love to hear from you
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a 
                href="mailto:support@scribescan.com" 
                className="flex items-center gap-3 bg-accent/50 rounded-lg px-4 py-3 hover:bg-accent transition-colors group"
              >
                <Mail className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Email Support
                  </span>
                  <p className="text-xs text-muted-foreground">
                    support@scribescan.com
                  </p>
                </div>
              </a>
              
              <div className="bg-accent/50 rounded-lg px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Have a feature request or found a bug? We appreciate your feedback to help 
                  improve ScribeScan. Response time is typically within 24-48 hours.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Support ScribeScan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Support ScribeScan</h2>
                <p className="text-sm text-muted-foreground">
                  Help keep this project alive
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-accent/50 rounded-lg px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  If you find ScribeScan useful, consider supporting its development. 
                  Your contribution helps cover hosting costs and enables new features!
                </p>
              </div>
              
              <a
                href="https://buymeacoffee.com/ClarifAI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-[#000000] font-medium rounded-lg px-4 py-3 transition-colors"
              >
                <Coffee className="w-5 h-5" />
                <span>Buy Me a Coffee</span>
              </a>
            </div>
          </motion.div>

          {/* About Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-accent/50 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">About Us</h3>
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
