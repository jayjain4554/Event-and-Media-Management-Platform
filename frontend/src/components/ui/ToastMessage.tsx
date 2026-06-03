import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ToastMessageProps {
  open: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ open, message, type = 'info', onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 max-w-sm rounded-3xl border border-glass-border bg-dark-900/95 p-4 shadow-glass-card backdrop-blur-xl text-sm font-semibold text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-dark-800 border border-glass-border">
            {type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : type === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            ) : (
              <Info className="h-4 w-4 text-brand-400" />
            )}
          </span>
          <span className="leading-tight">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto text-dark-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
