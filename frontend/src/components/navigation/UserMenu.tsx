/**
 * User Avatar Menu Dropdown
 * Premium user menu with profile, settings, and logout
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { dropdownVariants, hoverGlowVariants } from '@/design';

interface UserMenuProps {
  user: {
    name: string;
    role: string;
    referenceSelfieUrl?: string;
  };
}

/**
 * User Avatar Menu Dropdown
 */
export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <User size={16} />,
      label: 'Profile',
      onClick: () => {
        navigate('/profile');
        setIsOpen(false);
      },
    },
    {
      icon: <Settings size={16} />,
      label: 'Settings',
      onClick: () => {
        setIsOpen(false);
        // Navigate to settings when page exists
      },
    },
    {
      icon: <LogOut size={16} />,
      label: 'Sign Out',
      onClick: handleLogout,
      isDanger: true,
    },
  ];

  return (
    <div className="relative">
      {/* Avatar Button */}
      <motion.button
        variants={hoverGlowVariants}
        whileHover="whileHover"
        onClick={() => setIsOpen(!isOpen)}
        className="
          relative flex items-center gap-2 px-2 py-1.5 rounded-full
          hover:bg-dark-800/50 transition-all duration-200
          border border-glass-border/30 hover:border-glass-border
          group
        "
        aria-label="Open user menu"
      >
        {/* Avatar Image */}
        <div className="relative">
          <div
            className={`
              h-8 w-8 rounded-full flex items-center justify-center
              font-bold text-xs uppercase
              transition-all duration-200
              ${
                user.referenceSelfieUrl
                  ? 'bg-dark-800 border border-brand-500/30'
                  : 'bg-gradient-to-br from-brand-500 to-brand-600 border border-brand-400/50'
              }
            `}
          >
            {user.referenceSelfieUrl ? (
              <img
                src={user.referenceSelfieUrl}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white">{user.name.charAt(0)}</span>
            )}
          </div>

          {/* Active indicator */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success-500 border border-dark-900"
          />
        </div>

        {/* Dropdown Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <MoreVertical size={16} className="text-dark-300 group-hover:text-brand-400" />
        </motion.div>
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
              absolute right-0 mt-2 w-56 py-2
              bg-dark-800 border border-glass-border
              rounded-xl shadow-lg backdrop-blur-xl
              overflow-hidden z-50
            "
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-glass-border bg-dark-900/50">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-brand-400 font-medium capitalize">{user.role}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={item.onClick}
                  whileHover={{ backgroundColor: 'rgba(14, 145, 235, 0.1)' }}
                  className={`
                    w-full px-4 py-2 text-left text-sm font-medium
                    flex items-center gap-3 transition-all duration-150
                    hover:pl-5
                    ${
                      item.isDanger
                        ? 'text-danger-400 hover:text-danger-300 hover:bg-danger-500/5'
                        : 'text-dark-200 hover:text-white hover:bg-brand-500/10'
                    }
                  `}
                >
                  <span
                    className={
                      item.isDanger ? 'text-danger-400' : 'text-dark-400 group-hover:text-brand-400'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
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
