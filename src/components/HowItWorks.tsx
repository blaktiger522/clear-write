import { motion } from "framer-motion";
import { Upload, Sparkles, FileText } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Take a photo or upload an image of handwritten text",
  },
  {
    icon: Sparkles,
    title: "AI Processing",
    description: "Our OCR engine analyzes and recognizes the handwriting",
  },
  {
    icon: FileText,
    title: "Get Clear Text",
    description: "View, copy, or download the extracted text instantly",
  },
];

const HowItWorks = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Transform messy handwriting into clear, readable text in three simple steps
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            {/* Connector line for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
            )}

            <div className="bg-card rounded-2xl p-6 shadow-soft text-center relative z-10">
              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>

              <div className="w-14 h-14 mx-auto rounded-xl bg-accent flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
