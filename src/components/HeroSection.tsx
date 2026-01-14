import { motion } from "framer-motion";
import { FileText, Sparkles, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Handwriting Recognition
          </motion.div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transform{" "}
            <span className="text-gradient">Messy Handwriting</span>
            <br />
            Into Clear Text
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Upload any handwritten document or image and let our AI decode it instantly. 
            Compare, download, and share your clarified text with ease.
          </p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <div className="flex items-center gap-2 bg-card shadow-soft px-4 py-2 rounded-full text-sm">
              <FileText className="w-4 h-4 text-primary" />
              <span>Any Document Format</span>
            </div>
            <div className="flex items-center gap-2 bg-card shadow-soft px-4 py-2 rounded-full text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant Processing</span>
            </div>
            <div className="flex items-center gap-2 bg-card shadow-soft px-4 py-2 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>High Accuracy</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
