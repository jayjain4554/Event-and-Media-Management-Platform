import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  UploadCloud,
  Bell,
  User,
  Shield,
  LogOut,
  Camera,
  Menu,
  X,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, onClick, badge }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
        ${
          isActive
            ? 'bg-brand-500/10 text-brand-400 border-l-2 border-brand-500 font-semibold'
            : 'text-dark-300 hover:text-white hover:bg-glass-light'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-dark-400 group-hover:text-brand-400 transition-colors">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && badge > 0 ? (
        <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
};

export const ResponsiveSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadNotifications] = useState(0); // Can sync with notification socket listener

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/events', icon: <Compass size={18} />, label: 'Explore Events' },
    { to: '/my-photos', icon: <Sparkles size={18} />, label: 'Spotted in Photos' },
    { to: '/favorites', icon: <Heart size={18} />, label: 'My Favorites' },
    {
      to: '/upload',
      icon: <UploadCloud size={18} />,
      label: 'Upload Media',
      roles: ['Admin', 'Photographer'],
    },
    {
      to: '/notifications',
      icon: <Bell size={18} />,
      label: 'Notifications',
      badge: unreadNotifications,
    },
    {
      to: '/admin',
      icon: <Shield size={18} />,
      label: 'Admin Control',
      roles: ['Admin'],
    },
    { to: '/profile', icon: <User size={18} />, label: 'User Profile' },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !link.roles || (user && link.roles.includes(user.role))
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-dark-900 border-r border-glass-border p-5 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-glass-border">
        <Camera className="h-6 w-6 text-brand-500 animate-pulse" />
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-dark-100 to-brand-400 bg-clip-text text-transparent">
          EventSphere
        </span>
      </div>

      {/* User Mini Profile */}
      {user && (
        <div className="flex items-center gap-3 px-3 py-5 my-2 rounded-lg bg-glass-light border border-glass-border">
          <div className="h-10 w-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-400 uppercase shadow-inner">
            {user.referenceSelfieUrl ? (
              <img
                src={user.referenceSelfieUrl}
                alt="Profile Selfie"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="text-sm font-semibold truncate text-white">{user.name}</h4>
            <p className="text-xs text-brand-400 font-medium truncate capitalize">{user.role}</p>
          </div>
        </div>
      )}

      {/* Navigations links */}
      <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto pr-1">
        {filteredLinks.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            badge={link.badge}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Log out Footer */}
      <div className="pt-4 border-t border-glass-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-dark-300 hover:text-red-400 hover:bg-red-500/5 rounded-lg w-full text-sm font-medium transition-all group duration-200"
        >
          <LogOut size={18} className="text-dark-400 group-hover:text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Top Navbar Header */}
      <header className="lg:hidden flex items-center justify-between bg-dark-900 border-b border-glass-border px-4 py-4 fixed top-0 w-full z-40 select-none">
        <div className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-brand-500" />
          <span className="text-lg font-black tracking-tight text-white">EventSphere</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-dark-300 hover:text-white p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-glass-border"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black"
            />
            {/* Drawer menu content container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-64 max-w-xs flex-1 flex flex-col bg-dark-900 h-full shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
