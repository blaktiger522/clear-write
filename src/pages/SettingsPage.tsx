import { motion } from "framer-motion";
import { Settings, Globe, Save, LayoutGrid, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const languages = [
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
  { code: "nld", name: "Dutch" },
  { code: "pol", name: "Polish" },
  { code: "rus", name: "Russian" },
  { code: "jpn", name: "Japanese" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "kor", name: "Korean" },
  { code: "ara", name: "Arabic" },
  { code: "hin", name: "Hindi" },
];

const SettingsPage = () => {
  const { settings, updateSettings, resetSettings } = useSettings();

  const handleReset = () => {
    resetSettings();
    toast.success("Settings reset to defaults");
  };

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
          {/* Language Settings */}
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
                  Select the primary language of your handwritten documents
                </p>
              </div>
            </div>

            <Select
              value={settings.language}
              onValueChange={(value) => updateSettings({ language: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* History Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Save className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Auto-save History</h2>
                <p className="text-sm text-muted-foreground">
                  Automatically save processed documents to history
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="text-sm">
                Save to history after processing
              </Label>
              <Switch
                id="auto-save"
                checked={settings.autoSaveHistory}
                onCheckedChange={(checked) => updateSettings({ autoSaveHistory: checked })}
              />
            </div>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Compact View</h2>
                <p className="text-sm text-muted-foreground">
                  Use a more condensed layout in history
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="text-sm">
                Enable compact view
              </Label>
              <Switch
                id="compact-view"
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSettings({ compactView: checked })}
              />
            </div>
          </motion.div>

          {/* Reset Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl shadow-soft p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold">Reset Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Restore all settings to their default values
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
