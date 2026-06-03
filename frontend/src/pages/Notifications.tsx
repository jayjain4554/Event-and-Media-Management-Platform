import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageSquare, Sparkles, CheckSquare, Eye, Loader2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';

import { useNotifications, useMarkNotificationsRead } from '../hooks/useNotifications';

export const Notifications: React.FC = () => {
  const { data, isLoading: loading } = useNotifications();
  const { notifications = [], unreadCount = 0 } = data || {};
  const markReadMutation = useMarkNotificationsRead();

  const handleMarkAllRead = async () => {
    markReadMutation.mutate();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500 fill-red-500 shrink-0" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-indigo-400 shrink-0" />;
      case 'tag':
        return <Sparkles className="h-5 w-5 text-brand-400 shrink-0 animate-bounce" />;
      default:
        return <Bell className="h-5 w-5 text-teal-400 shrink-0" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="text-brand-500 animate-pulse shrink-0" />
            <span>Activity Feed</span>
          </h1>
          <p className="text-dark-300 text-sm mt-1">
            Realtime notifications on photo likes, comment tags, and spot matching alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-dark-850 hover:bg-dark-800 text-brand-400 hover:text-brand-300 rounded-lg border border-glass-border flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <CheckSquare size={13} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>
      ) : notifications.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center h-[280px] bg-glass-card border-glass-border">
          <Bell size={40} className="text-dark-500 mb-4 animate-pulse" />
          <h4 className="text-white font-bold text-base">Your Feed is Quiet</h4>
          <p className="text-dark-300 text-xs max-w-sm mt-1">
            When users comment on your photos or tag you, live updates will appear here!
          </p>
        </GlassCard>
      ) : (
        /* Notifications lists */
        <div className="space-y-4">
          {notifications.map((notif, index) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <GlassCard
                className={`!p-4 border transition-all duration-300 flex items-center justify-between gap-4
                  ${
                    notif.isRead
                      ? 'bg-glass-card/40 border-glass-border opacity-75'
                      : 'bg-glass-card border-brand-500/20 shadow-glass-glow'
                  }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Action icon badge */}
                  <div className="h-10 w-10 rounded-xl bg-dark-900 border border-glass-border flex items-center justify-center shrink-0">
                    {getNotifIcon(notif.type)}
                  </div>
                  {/* Message body */}
                  <div className="overflow-hidden">
                    <p className={`text-xs ${notif.isRead ? 'text-dark-300' : 'text-white font-semibold'} leading-snug`}>
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-dark-500 font-bold block mt-1">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Redirect trigger */}
                {notif.eventId && (
                  <Link
                    to={`/events/${notif.eventId._id}`}
                    className="p-2 rounded-lg bg-dark-950 border border-glass-border hover:border-brand-500/30 text-dark-400 hover:text-white shrink-0"
                    title="View event details"
                  >
                    <Eye size={14} />
                  </Link>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
