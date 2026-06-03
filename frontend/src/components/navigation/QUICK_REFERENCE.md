# Navigation Components - Quick Reference

## 🏗️ Component Architecture

```
MainLayout (Updated)
├── TopNav (Desktop ≥1024px)
│   ├── Logo Section
│   ├── Nav Links Container
│   │   └── NavLinkItem x 4-6
│   │       ├── Icon
│   │       ├── Label
│   │       └── Active Indicator (animated)
│   └── Right Section
│       ├── NotificationDropdown
│       │   └── Dropdown Menu (animated)
│       │       └── Notification Items x N
│       └── UserMenu
│           └── Avatar Dropdown (animated)
│               └── Menu Items x 3
│
├── Main Content Area
│   └── {children}
│
└── BottomNav (Mobile <1024px)
    ├── BottomNavItem x 4-6
    │   ├── Icon
    │   ├── Active Indicator Pill (animated)
    │   └── Label
    └── NavLink to routes
```

## 📊 Component Props & State

### TopNav
```tsx
interface NavItem {
  to: string;                    // Route path
  icon: React.ReactNode;         // Icon component
  label: string;                 // Display label
  roles?: string[];              // Optional: restrict by role
}

// Internal State
- scrollY: number              // For shadow effect
- user: User                   // From AuthContext
- canUpload: boolean           // Computed
- isAdmin: boolean             // Computed
```

### BottomNav
```tsx
interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
}

// Internal State
- user: User                   // From AuthContext
- canUpload: boolean
- isAdmin: boolean
```

### UserMenu
```tsx
interface UserMenuProps {
  user: {
    name: string;
    role: string;
    referenceSelfieUrl?: string;
  };
}

// Internal State
- isOpen: boolean              // Dropdown visibility
```

### NotificationDropdown
```tsx
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: Date;
  read: boolean;
}

// Internal State
- isOpen: boolean              // Dropdown visibility
- notifications: Notification[] // List of notifications
```

## 🎨 Styling Classes

### TopNav
- `sticky top-0 z-40 hidden lg:block` - Fixed desktop positioning
- `border-b border-glass-border` - Glass border
- `backdrop-blur-xl bg-dark-900/80` - Glassmorphism
- `max-w-7xl mx-auto px-6` - Contained width

### BottomNav
- `fixed bottom-0 left-0 right-0 z-40 lg:hidden` - Mobile bottom fixed
- `h-20 bg-dark-900/95 border-t` - Height and glass style
- `backdrop-blur-xl shadow-2xl` - Blur and shadow
- `safe-area-inset-bottom` - iPhone safe area support

### UserMenu
- `relative p-2 rounded-lg` - Avatar button styling
- `hover:bg-dark-800/50 transition-all` - Hover effects
- `border border-glass-border/30` - Glass border
- `absolute right-0 mt-2 w-56` - Dropdown positioning

### NotificationDropdown
- `absolute right-0 mt-2 w-80` - Dropdown positioning
- `bg-dark-800 border border-glass-border` - Glass styling
- `rounded-xl shadow-2xl backdrop-blur-xl` - Premium shadow and blur
- `max-h-96 overflow-y-auto` - Scrollable content

## 🎬 Animation Variants

```tsx
// TopNav Entrance
slideInDownVariants
├── initial: { opacity: 0, y: -20 }
├── animate: { opacity: 1, y: 0 }
└── exit: { opacity: 0, y: -20 }

// Nav Item Hover
hoverLiftVariants
├── whileHover: { y: -8 }
└── whileTap: { y: 0 }

// Dropdown Open
dropdownVariants
├── closed: { opacity: 0, y: -10 }
└── open: { opacity: 1, y: 0 }

// Active Indicator
layoutId: "navIndicator"
transition: spring({ damping: 25, stiffness: 300 })

// Toast Notification
notificationVariants
├── initial: { opacity: 0, x: 100, y: -20 }
├── animate: { opacity: 1, x: 0, y: 0 }
└── exit: { opacity: 0, x: 100, y: -20 }
```

## 🎯 User Flows

### Desktop User Clicks "Explore"
```
1. Click "Explore" link in TopNav
2. NavLink component detects isActive
3. Background fades in (opacity animation)
4. Icon scales up slightly (1.1x)
5. Active indicator underline appears (spring animation)
6. Page content loads/transitions
```

### Mobile User Taps "Spotted"
```
1. Tap "Spotted" in BottomNav
2. NavLink detects isActive
3. Icon container animates up (y: -4)
4. Icon scales up (1.1x)
5. Top pill indicator appears
6. Page transitions smoothly
```

### User Opens Avatar Menu
```
1. Click avatar in TopNav (desktop) or via nav (mobile)
2. isOpen state toggles to true
3. Menu background fades in (spring)
4. Menu content fades in + slides (stagger)
5. Click outside → overlayDiv onClick closes menu
6. Click option → menu closes + action executes
```

### User Checks Notifications
```
1. Click bell icon
2. isOpen state toggles
3. Dropdown fades in + scales
4. Notifications list appears (staggered)
5. User can:
   - Dismiss individual (X button)
   - Mark all read
   - View all (navigate to /notifications)
   - Click outside to close
```

## 📋 Authentication Integration

```tsx
// TopNav & BottomNav both use:
const { user, isAuthenticated, logout } = useAuth();

// Auto-hide on public routes:
if (location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/register') {
  return null;
}

// Filter nav items by role:
const canUpload = user && 
  ['Admin', 'Photographer'].includes(user.role);

const navItems = [
  // ... base items
  ...(canUpload ? [{ to: '/upload', ... }] : []),
];

// UserMenu logout:
const handleLogout = () => {
  logout();                    // Clear auth
  navigate('/');              // Redirect home
};
```

## 🔌 Socket.io Integration

```tsx
// In MainLayout.tsx:
useEffect(() => {
  if (isAuthenticated && token) {
    const socket = connectSocket(token);
    
    socket.on('notification', (notif) => {
      // Show toast
      setActiveToast({
        message: notif.message,
        type: notif.type,
      });
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => setActiveToast(null), 5000);
    });
    
    return () => disconnectSocket();
  }
}, [isAuthenticated, token]);

// For real-time notification menu:
// Add socket listener in NotificationDropdown.tsx
// See IMPLEMENTATION.md for details
```

## 🎨 Color System

```tsx
// From design system tokens
colors.brand[500]        // Primary blue for indicators
colors.dark[900]         // Main background
colors.dark[800]         // Elevated backgrounds  
colors.dark[400/300]     // Text colors
colors.glass.border      // Border color
colors.success[500]      // Online indicator (green)
colors.danger[400]       // Logout danger text
colors.info/warning      // Notification indicators
```

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints in use:
lg: 1024px              // Switch point between TopNav/BottomNav
sm: 640px               // Mobile padding adjustments
md: 768px               // Tablet sizing

// CSS Classes:
hidden lg:block          // TopNav (desktop only)
lg:hidden               // BottomNav (mobile only)
pb-24 lg:pb-8          // Content bottom padding
px-4 sm:px-6 lg:p-8    // Responsive padding
```

## ⚡ Performance Optimizations

```tsx
// React.FC pure components - no unnecessary renders
// Framer Motion - GPU-accelerated animations
// Fixed positioning - doesn't affect layout reflow
// Lazy-loaded dropdowns - only render when open
// Memoized callbacks - prevent unnecessary updates
// Event delegation - single overlay click handler
```

## 🐛 Common Props/Patterns

```tsx
// AnimatePresence wrapping conditionally rendered components
<AnimatePresence>
  {isOpen && (
    <motion.div variants={dropdownVariants} ... />
  )}
</AnimatePresence>

// NavLink from React Router
<NavLink to="/path" className={({ isActive }) => ...} />

// Motion div with hover/tap animations
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>

// Outside click handler pattern
{isOpen && (
  <motion.div
    onClick={() => setIsOpen(false)}
    className="fixed inset-0 z-40"
  />
)}

// Toast notification positioning
bottom-24 lg:bottom-6   // Avoid mobile bottom nav
right-4 sm:right-6      // Responsive right margin
z-50                    // Above everything
```

## 🎯 Key Implementation Details

1. **Spring Animations:** All interactive elements use spring transitions for smooth, natural motion
2. **Glass Effect:** Backdrop blur + semi-transparent backgrounds create premium feel
3. **Stagger Animations:** Lists stagger children with delays for professional polish
4. **Active States:** Always show where user is with animated indicators
5. **Responsive:** Single component code handles desktop/mobile via CSS
6. **Accessible:** Semantic HTML, ARIA labels, keyboard navigation
7. **Dark Mode:** Full dark mode support built-in
8. **Role-Based:** Seamlessly filter nav items based on user role

---

This quick reference covers the complete navigation system architecture, component structure, and implementation patterns. For more details, see README.md and IMPLEMENTATION.md in the navigation folder.
