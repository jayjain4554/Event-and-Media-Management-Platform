/**
 * Notification Dropdown Menu
 * Real-time notifications with animation and dismiss
 */

import React, { useState } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/design';
import { dropdownVariants } from '@/design';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: Date;
  read: boolean;
}

/**
 * Notification Dropdown
 */
export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Your event has been created successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: '2',
      message: 'New photos tagged in your event',
      type: 'info',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-success-400';
      case 'danger':
        return 'text-danger-400';
      case 'warning':
        return 'text-warning-400';
      default:
        return 'text-info-400';
    }
  };

  const getTypeBackground = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success-500/10';
      case 'danger':
        return 'bg-danger-500/10';
      case 'warning':
        return 'bg-warning-500/10';
      default:
        return 'bg-info-500/10';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          relative p-2 rounded-lg
          hover:bg-dark-800/50 transition-all duration-200
          border border-glass-border/30 hover:border-glass-border
          group
        "
        aria-label="Notifications"
      >
        {/* Bell Icon */}
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, 15, -15, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bell
            size={20}
            className={`${
              unreadCount > 0 ? 'text-brand-400' : 'text-dark-300 group-hover:text-brand-400'
            } transition-colors`}
          />
        </motion.div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="
              absolute -top-1 -right-1
              bg-danger-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-full
              shadow-lg border border-danger-400
            "
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="
              absolute right-0 mt-2 w-80
              bg-dark-800 border border-glass-border
              rounded-xl shadow-2xl backdrop-blur-xl
              overflow-hidden z-50
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border bg-dark-900/50">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                >
                  <CheckCheck size={14} className="inline mr-1" />
                  Mark all read
                </motion.button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-dark-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-dark-400">No notifications yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        px-4 py-3 border-b border-glass-border last:border-b-0
                        hover:bg-dark-700/50 transition-colors duration-150
                        cursor-pointer group
                        ${notification.read ? 'opacity-60' : ''}
                      `}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Type Indicator */}
                        <div
                          className={`
                            h-2 w-2 rounded-full mt-1.5 shrink-0
                            ${getTypeBackground(notification.type).replace('bg-', 'bg-')}
                            ${getTypeColor(notification.type)}
                          `}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white group-hover:text-brand-200 transition-colors">
                            {notification.message}
                          </p>
                          <p className="text-xs text-dark-400 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        {/* Dismiss Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(notification.id);
                          }}
                          className="text-dark-400 hover:text-danger-400 transition-colors shrink-0"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-glass-border bg-dark-900/50">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page
                  }}
                  className="text-xs"
                >
                  View all notifications
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close on outside click */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
};
