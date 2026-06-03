/**
 * Premium Top Navigation Bar
 * Desktop navigation with glassmorphism, animated indicators, and dropdowns
 */

import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  Compass,
  UploadCloud,
  Shield,
  Sparkles,
  Heart,
  Camera,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Flex } from '@/design';
import { UserMenu } from './UserMenu';
import { NotificationDropdown } from './NotificationDropdown';
import { slideInDownVariants, hoverLiftVariants } from '@/design';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
}

/**
 * Animated nav indicator - follows active link
 */
/**
 * Individual nav link with hover effects
 */
const NavLinkItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({
  to,
  icon,
  label,
}) => {
  return (
    <NavLink
      to={to}
      className="relative group"
    >
      {({ isActive }) => (
        <motion.div
          variants={hoverLiftVariants}
          whileHover="whileHover"
          whileTap="whileTap"
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 relative overflow-hidden
            ${isActive ? 'text-brand-400' : 'text-dark-300 hover:text-white'}
          `}
        >
          {/* Background hover effect */}
          <motion.div
            className="absolute inset-0 bg-brand-500/10 rounded-lg -z-10"
            initial={false}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Icon with color transition */}
          <motion.div
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>

          {/* Label */}
          <span>{label}</span>

          {/* Active indicator underline */}
          {isActive && (
            <motion.div
              layoutId="navIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent"
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  );
};

/**
 * Premium Top Navigation Bar
 */
export const TopNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);

  // Handle smooth scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user has certain roles
  const canUpload = user && ['Admin', 'Photographer'].includes(user.role);
  const isAdmin = user?.role === 'Admin';

  const navItems: NavItem[] = [
    { to: '/events', icon: <Compass size={18} />, label: 'Explore' },
    { to: '/my-photos', icon: <Sparkles size={18} />, label: 'Spotted' },
    { to: '/favorites', icon: <Heart size={18} />, label: 'Favorites' },
    ...(canUpload ? [{ to: '/upload', icon: <UploadCloud size={18} />, label: 'Upload' }] : []),
    ...(isAdmin ? [{ to: '/admin', icon: <Shield size={18} />, label: 'Admin' }] : []),
  ];

  // Only show on protected routes
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <motion.header
      variants={slideInDownVariants}
      initial="initial"
      animate="animate"
      className={`
        sticky top-0 z-40 hidden lg:block
        border-b border-glass-border
        backdrop-blur-xl bg-dark-900/80
        transition-all duration-300
        ${scrollY > 10 ? 'shadow-lg' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <motion.div
          className="flex items-center gap-2 shrink-0"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-dark-900 px-2 py-1 rounded-lg">
              <Camera className="h-5 w-5 text-brand-500" />
            </div>
          </div>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-dark-100 to-brand-400 bg-clip-text text-transparent">
            EventSphere
          </span>
        </motion.div>

        {/* Center Navigation Links */}
        <nav className="flex-1 flex items-center justify-center">
          <motion.div
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-dark-800/50 border border-glass-border backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {navItems.map((item) => (
              <NavLinkItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </motion.div>
        </nav>

        {/* Right Section: Notifications & User Menu */}
        <Flex gap="md" align="center">
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* User Menu */}
          {user && <UserMenu user={user} />}
        </Flex>
      </div>
    </motion.header>
  );
};
