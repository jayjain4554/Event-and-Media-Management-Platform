import React, { useEffect, useState } from 'react';
import { TopNav, BottomNav } from '../navigation';
import { useAuth } from '../../context/AuthContext';
import { connectSocket, disconnectSocket } from '../../services/socket';
import { Bell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationVariants } from '@/design';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [activeToast, setActiveToast] = useState<{ message: string; type: string } | null>(null);

  // Set up socket integration real-time push events
  useEffect(() => {
    if (isAuthenticated && token) {
      const socket = connectSocket(token);

      // Listen for push notifications
      socket.on('notification', (notif: any) => {
        console.log('🔔 Notification push received real-time:', notif);
        // Display animated dynamic toast
        setActiveToast({
          message: notif.message,
          type: notif.type,
        });

        // Auto-dismiss toast in 5 seconds
        setTimeout(() => {
          setActiveToast(null);
        }, 5000);
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, token]);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 overflow-x-hidden text-dark-100">
      {/* Premium Top Navigation Bar */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content View Container - with padding for mobile bottom nav */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto box-border">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Real-time Dynamic Toast alerts */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            variants={notificationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-24 lg:bottom-6 right-4 sm:right-6 z-50 p-4 rounded-xl border glass-panel shadow-glass-card border-brand-500/30 flex items-center gap-3 select-none max-w-sm"
          >
            {activeToast.type === 'tag' ? (
              <Sparkles className="h-5 w-5 text-brand-400 shrink-0 animate-bounce" />
            ) : (
              <Bell className="h-5 w-5 text-indigo-400 shrink-0 animate-pulse" />
            )}
            <div className="text-sm font-semibold text-white leading-tight">
              {activeToast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
