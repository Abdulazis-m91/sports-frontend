import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = "Oops! Tidak ada data yang ditemukan", onRetry }: ErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-24 gap-5"
  >
    <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
      <AlertTriangle className="w-10 h-10 text-destructive" />
    </div>
    <div className="text-center">
      <p className="text-lg font-display font-semibold text-foreground mb-1">{message}</p>
      <p className="text-sm text-muted-foreground">Coba lagi nanti atau periksa koneksi kamu</p>
    </div>
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="w-4 h-4" /> Coba Lagi
      </Button>
    )}
  </motion.div>
);

export default ErrorState;
