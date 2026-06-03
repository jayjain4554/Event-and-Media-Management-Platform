import React from 'react';
import { Shield, Users, HardDrive, Film, Calendar, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';

import { useAdminMetrics } from '../hooks/useAdminMetrics';

export const AdminDashboard: React.FC = () => {
  const { data: metrics, isLoading: loading, refetch } = useAdminMetrics();



  if (loading || !metrics) {
    return (
      <div className="h-40 flex items-center justify-center">
        <RefreshCw className="animate-spin text-brand-500" />
      </div>
    );
  }

  // Calculate percentage ratios for chart display
  const maxUploadValue = Math.max(...metrics.charts.uploads.map((u) => u.uploads), 1);

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Shield className="text-brand-500 shrink-0" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-dark-300 text-sm mt-1">
            System overview, cloud storage allocations, popular events, and user demographics.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="px-4 py-2 border border-glass-border hover:border-brand-500/20 text-dark-300 hover:text-white rounded-xl text-xs font-bold bg-dark-950 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex items-center gap-4 bg-glass-card border-glass-border">
          <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest block">
              Total Enrolled
            </span>
            <span className="text-2xl font-black text-white">{metrics.users.total} users</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-glass-card border-glass-border">
          <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <HardDrive size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest block">
              Cloud Storage Usage
            </span>
            <span className="text-2xl font-black text-white">{metrics.storage.formatted}</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-glass-card border-glass-border">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Film size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest block">
              Media count
            </span>
            <span className="text-2xl font-black text-white">{metrics.media.total} files</span>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 bg-glass-card border-glass-border">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest block">
              Total Events
            </span>
            <span className="text-2xl font-black text-white">{metrics.events.total} sessions</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Charts & Demographics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Upload Activity Bar Graph Chart (Notion/Linear Inspired!) */}
        <GlassCard className="lg:col-span-2 space-y-6 bg-glass-card border-glass-border">
          <div className="flex justify-between items-center border-b border-glass-border/30 pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-500" />
              <span>Media upload frequencies</span>
            </h3>
            <span className="text-[10px] text-dark-300 font-bold uppercase">Monthly aggregate</span>
          </div>

          {/* Render custom styled SVG bars grid */}
          <div className="h-[220px] flex items-end justify-between px-6 pt-4 relative">
            {metrics.charts.uploads.map((item, idx) => {
              const heightPercent = (item.uploads / maxUploadValue) * 80 + 10; // offset bounds
              return (
                <div key={idx} className="flex flex-col items-center gap-3 w-16 group select-none">
                  {/* Tooltip bar */}
                  <span className="text-[10px] font-black text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {item.uploads} uploads
                  </span>
                  {/* SVG Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-8 rounded-t-lg bg-gradient-to-t from-brand-600 via-brand-500 to-indigo-400 hover:from-brand-500 hover:to-teal-400 shadow-lg relative cursor-pointer"
                  />
                  {/* Month */}
                  <span className="text-xs font-bold text-dark-300">{item.month}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* User demographics allocations */}
        <GlassCard className="space-y-5 bg-glass-card border-glass-border flex flex-col justify-between">
          <div className="border-b border-glass-border/30 pb-4 shrink-0">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-indigo-400" />
              <span>User Demographics</span>
            </h3>
          </div>

          {/* Allocation rows list */}
          <div className="space-y-4 flex-1 flex flex-col justify-center select-none font-semibold text-xs text-dark-300">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Admins:</span>
                <span className="text-white font-extrabold">{metrics.users.admin}</span>
              </div>
              <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-glass-border">
                <div
                  className="bg-red-400 h-full rounded-full"
                  style={{ width: `${(metrics.users.admin / metrics.users.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Photographers:</span>
                <span className="text-white font-extrabold">{metrics.users.photographer}</span>
              </div>
              <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-glass-border">
                <div
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${(metrics.users.photographer / metrics.users.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Club Members:</span>
                <span className="text-white font-extrabold">{metrics.users.member}</span>
              </div>
              <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-glass-border">
                <div
                  className="bg-indigo-400 h-full rounded-full"
                  style={{ width: `${(metrics.users.member / metrics.users.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Viewers:</span>
                <span className="text-white font-extrabold">{metrics.users.viewer}</span>
              </div>
              <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden border border-glass-border">
                <div
                  className="bg-teal-400 h-full rounded-full"
                  style={{ width: `${(metrics.users.viewer / metrics.users.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Popular Events metrics */}
      <GlassCard className="bg-glass-card border-glass-border space-y-4">
        <div className="border-b border-glass-border/30 pb-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 size={16} className="text-teal-400" />
            <span>Popular active events</span>
          </h3>
        </div>

        {metrics.popularEvents.length === 0 ? (
          <div className="text-center py-6 text-dark-500 text-xs font-bold">
            No dynamic upload rankings available.
          </div>
        ) : (
          <div className="overflow-x-auto select-none">
            <table className="w-full border-collapse text-left text-xs font-semibold text-dark-300">
              <thead>
                <tr className="border-b border-glass-border/30 text-white font-extrabold uppercase">
                  <th className="py-3 px-4">Event title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Media uploaded</th>
                  <th className="py-3 px-4 text-center">Total interactions</th>
                </tr>
              </thead>
              <tbody>
                {metrics.popularEvents.map((item, idx) => (
                  <tr key={idx} className="border-b border-glass-border/10 hover:bg-glass-light transition-colors">
                    <td className="py-3 px-4 text-white font-extrabold truncate max-w-[200px]">
                      {item.event?.title || 'Unknown Event'}
                    </td>
                    <td className="py-3 px-4 text-brand-400 uppercase tracking-widest text-[9px] font-black">
                      {item.event?.category || 'General'}
                    </td>
                    <td className="py-3 px-4 text-center text-white font-bold">{item.mediaCount} files</td>
                    <td className="py-3 px-4 text-center font-medium text-amber-400">
                      {item.totalLikes} likes
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
