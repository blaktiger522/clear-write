import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Eye, Download, Clock, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistory, HistoryItem } from "@/contexts/HistoryContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const HistoryPage = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const handleDownload = (item: HistoryItem) => {
    const blob = new Blob([item.processedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scribe-${item.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Text file downloaded!");
  };

  const handleDelete = (id: string) => {
    removeFromHistory(id);
    toast.success("Item removed from history");
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    clearHistory();
    setSelectedItem(null);
    toast.success("History cleared");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              History
            </h1>
            <p className="text-muted-foreground mt-1">
              View your previously processed documents
            </p>
          </div>

          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {history.length} items from your history. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {history.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              No history yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Your processed documents will appear here
            </p>
            <Button asChild>
              <a href="/">Process your first document</a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* History list */}
            <div className="space-y-4">
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      bg-card rounded-xl shadow-soft p-4 cursor-pointer transition-all
                      ${selectedItem?.id === item.id 
                        ? "ring-2 ring-primary" 
                        : "hover:shadow-card"
                      }
                    `}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.originalImage}
                          alt="Document"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.timestamp)}
                        </div>
                        <p className="text-sm text-foreground line-clamp-2 mb-2">
                          {item.processedText || "No text recognized"}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                            {Math.round(item.confidence)}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Detail view */}
            <div className="hidden lg:block">
              {selectedItem ? (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-2xl shadow-card overflow-hidden sticky top-24"
                >
                  <div className="p-4 bg-secondary/50 border-b border-border">
                    <h3 className="font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      Document Preview
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <img
                      src={selectedItem.originalImage}
                      alt="Original"
                      className="w-full rounded-lg"
                    />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recognized Text</h4>
                      <div className="bg-muted rounded-lg p-4 max-h-60 overflow-auto">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedItem.processedText || "No text recognized"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-card rounded-2xl shadow-soft p-8 text-center sticky top-24">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select an item to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
