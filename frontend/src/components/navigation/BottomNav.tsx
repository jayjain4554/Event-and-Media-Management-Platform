/**
 * Modern Bottom Navigation for Mobile
 * Material Design inspired mobile navigation bar
 */

import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Compass,
  UploadCloud,
  Bell,
  Heart,
  Sparkles,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
}

/**
 * Mobile Bottom Navigation Item
 */
const BottomNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({
  to,
  icon,
  label,
}) => {
  return (
    <NavLink to={to} className="flex-1">
      {({ isActive }) => (
        <motion.div
          whileTap={{ scale: 0.85 }}
          className={`
            flex flex-col items-center justify-center gap-1 py-2
            transition-all duration-200
            ${isActive ? 'text-brand-400' : 'text-dark-400 active:text-brand-400'}
          `}
        >
          {/* Icon Container */}
          <motion.div
            animate={isActive ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`
              relative p-2 rounded-lg transition-all duration-200
              ${isActive ? 'bg-brand-500/10 text-brand-400' : 'text-dark-400'}
            `}
          >
            {icon}

            {/* Active indicator pill */}
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-6 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                }}
              />
            )}
          </motion.div>

          {/* Label */}
          <span className={`text-[10px] font-semibold text-center truncate px-1 ${
            isActive ? 'text-brand-400' : 'text-dark-400'
          }`}>
            {label}
          </span>
        </motion.div>
      )}
    </NavLink>
  );
};

/**
 * Bottom Navigation Bar (Mobile)
 */
export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Check if user has certain roles
  const canUpload = user && ['Admin', 'Photographer'].includes(user.role);
  const isAdmin = user?.role === 'Admin';

  const navItems: NavItem[] = [
    { to: '/events', icon: <Compass size={20} />, label: 'Explore' },
    { to: '/my-photos', icon: <Sparkles size={20} />, label: 'Spotted' },
    { to: '/notifications', icon: <Bell size={20} />, label: 'Notify' },
    { to: '/favorites', icon: <Heart size={20} />, label: 'Likes' },
    ...(canUpload ? [{ to: '/upload', icon: <UploadCloud size={20} />, label: 'Upload' }] : []),
    ...(isAdmin ? [{ to: '/admin', icon: <Shield size={20} />, label: 'Admin' }] : []),
  ];

  // Only show on protected routes on mobile
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Hide on desktop (show only on mobile)
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="
        fixed bottom-0 left-0 right-0 z-40 lg:hidden
        h-20 bg-dark-900/95 border-t border-glass-border
        backdrop-blur-xl shadow-2xl
        flex items-center justify-around
        safe-area-inset-bottom
      "
    >
      {/* Navigation Items */}
      <div className="flex w-full h-full items-center justify-around px-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <BottomNavItem
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};
