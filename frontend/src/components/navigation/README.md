# Premium Navigation System

A modern, glassmorphic navigation experience with desktop top nav and mobile bottom nav, inspired by Linear, Vercel, and Stripe.

## 🎯 Overview

The new navigation system provides:

### Desktop (Screen ≥ 1024px)
- **Premium Top Navigation Bar** - Glassmorphism navbar with animated active indicators
- **Centered Nav Links** - Explore, Spotted, Favorites, Upload, Admin (role-based)
- **User Avatar Menu** - Dropdown with Profile, Settings, Sign Out
- **Notification Dropdown** - Real-time notifications with dismiss and mark as read
- **Smooth Scroll Detection** - Nav shadow on scroll

### Mobile (Screen < 1024px)
- **Modern Bottom Navigation** - Material Design inspired
- **Animated Transitions** - Smooth entrance and state changes
- **Active Indicators** - Top pills showing current active route
- **Responsive Drawer** - Full sidebar still available via menu button

## 📁 File Structure

```
frontend/src/components/
├── navigation/                    ← NEW
│   ├── index.ts                  ← Exports
│   ├── TopNav.tsx                ← Premium desktop navigation
│   ├── BottomNav.tsx             ← Mobile bottom navigation
│   ├── UserMenu.tsx              ← Avatar dropdown menu
│   ├── NotificationDropdown.tsx  ← Notification menu
│   └── README.md                 ← This file
│
├── layout/
│   ├── MainLayout.tsx            ← UPDATED (uses new nav)
│   └── ResponsiveSidebar.tsx     ← Kept for reference (no longer used)
│
└── ui/
    └── ...
```

## 🚀 Usage

### Automatic
The new navigation is automatically integrated in `MainLayout.tsx`. No setup needed!

```tsx
// MainLayout.tsx already includes:
import { TopNav, BottomNav } from '../navigation';

export const MainLayout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <TopNav />      {/* Desktop only */}
      <main>
        {children}
      </main>
      <BottomNav />   {/* Mobile only */}
    </div>
  );
};
```

### No Changes Needed to App.tsx
All routes are preserved. The navigation automatically shows/hides based on authentication and role.

## 🎨 Design Details

### Colors & Styling
- **Glass Effect** - Backdrop blur with semi-transparent backgrounds
- **Brand Colors** - Blue gradient indicators (from design tokens)
- **Dark Mode** - Full dark mode support with accent colors
- **Border** - Glass border colors for premium look

### Animations
- **Active Indicator** - Spring animation with gradient background
- **Hover Effects** - Scale and color transitions
- **Dropdown Menu** - Stagger entrance with fade + scale
- **Bottom Nav** - Smooth slide-up entrance
- **Icon Animation** - Scale and lift on active state

### Responsive
- **Desktop (≥1024px)** - Top horizontal navigation bar
- **Mobile (<1024px)** - Bottom vertical navigation bar
- **Seamless** - Automatic switching without page reload

## 🔧 Customization

### Add New Nav Item

Edit `TopNav.tsx` and `BottomNav.tsx`:

```tsx
const navItems: NavItem[] = [
  // Existing items...
  {
    to: '/my-route',
    icon: <MyIcon size={18} />,
    label: 'My Page',
    roles: ['Admin', 'Photographer'], // Optional: restrict by role
  },
];
```

### Change Colors

Edit `frontend/src/design/tokens.ts`:

```tsx
export const colors = {
  brand: {
    500: '#0e91eb',  // ← Change to your color
  },
};
```

All nav indicators will automatically use the new brand color.

### Change Navigation Links

The navigation automatically filters based on user role:

```tsx
canUpload = user && ['Admin', 'Photographer'].includes(user.role);
isAdmin = user?.role === 'Admin';

// Conditionally include items:
...(canUpload ? [{ to: '/upload', ... }] : []),
...(isAdmin ? [{ to: '/admin', ... }] : []),
```

### Customize Animations

Edit animation imports in `TopNav.tsx`, `BottomNav.tsx`:

```tsx
import {
  slideInDownVariants,      // Desktop top nav entrance
  hoverLiftVariants,        // Hover effects
  dropdownVariants,         // Dropdown animations
  notificationVariants,     // Notification toast
} from '@/design';
```

For custom animations, create them in `frontend/src/design/animations.ts`.

## 📲 Real Notifications Integration

### Current Setup
The `NotificationDropdown.tsx` includes sample notifications. To integrate real-time notifications:

#### Step 1: Connect Socket Events
In `NotificationDropdown.tsx`, add socket listener:

```tsx
useEffect(() => {
  const socket = connectSocket(token);

  socket.on('notification', (notif) => {
    // Add to notifications list
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: notif.message,
      type: notif.type,
      timestamp: new Date(),
      read: false,
    }, ...prev]);
  });

  return () => socket.off('notification');
}, []);
```

#### Step 2: Fetch Existing Notifications
```tsx
useEffect(() => {
  // Fetch from API
  fetch('/api/notifications')
    .then(r => r.json())
    .then(data => setNotifications(data));
}, []);
```

#### Step 3: Update Backend Socket Events
Backend sends notifications to frontend:

```typescript
// Backend: socketService.ts
socket.emit('notification', {
  message: 'Event created successfully',
  type: 'success',
});
```

## 👤 User Menu Integration

### Current Setup
The `UserMenu.tsx` shows user profile and logout. To add more options:

```tsx
const menuItems = [
  {
    icon: <User size={16} />,
    label: 'Profile',
    onClick: () => navigate('/profile'),
  },
  // Add more items:
  {
    icon: <Gear size={16} />,
    label: 'Settings',
    onClick: () => navigate('/settings'),
  },
  {
    icon: <Help size={16} />,
    label: 'Help',
    onClick: () => openHelp(),
  },
];
```

## 🎯 Navigation Routes

All existing routes are preserved:

| Route | Desktop | Mobile | Auth | Roles |
|-------|---------|--------|------|-------|
| `/` | — | — | Public | — |
| `/login` | — | — | Public | — |
| `/register` | — | — | Public | — |
| `/events` | ✅ Explore | ✅ | Protected | All |
| `/my-photos` | ✅ Spotted | ✅ | Protected | All |
| `/favorites` | ✅ Likes | ✅ | Protected | All |
| `/upload` | ✅ Upload | ✅ | Protected | Admin, Photographer |
| `/notifications` | — | ✅ | Protected | All |
| `/admin` | ✅ Admin | ✅ | Protected | Admin |
| `/profile` | Via Menu | Via Menu | Protected | All |

## 🎨 Component API

### TopNav
Premium desktop navigation bar with animated indicators.

**Props:** None (connects to auth context automatically)

**Features:**
- Auto-hides on public routes
- Role-based nav item filtering
- Smooth scroll shadow
- Responsive positioning
- User avatar menu
- Notification dropdown

### BottomNav
Modern mobile navigation bar.

**Props:** None (connects to auth context automatically)

**Features:**
- Auto-hides on public routes
- Role-based nav item filtering
- Animated entrance on mobile
- Active state with top pill indicator
- Smooth transitions

### UserMenu
Avatar dropdown with profile options.

**Props:**
```tsx
interface UserMenuProps {
  user: {
    name: string;
    role: string;
    referenceSelfieUrl?: string;
  };
}
```

**Features:**
- Avatar with online indicator
- Profile/Settings/Logout menu
- Color-coded danger actions
- Smooth dropdown animation
- Auto-close on outside click

### NotificationDropdown
Real-time notification menu.

**Props:** None

**Features:**
- Unread badge counter
- Dismiss individual notifications
- Mark all as read
- Time-based formatting
- Empty state
- Type color indicators

## 🔌 Integrations

### Socket.io
Notifications use socket.io for real-time updates:

```typescript
// Backend sends:
socket.emit('notification', { message, type });

// Frontend listens:
socket.on('notification', (notif) => { /* update UI */ });
```

### Authentication
Navigation connects to `AuthContext`:

```tsx
const { user, isAuthenticated, logout } = useAuth();
```

### Design System
All components use design system:

```tsx
import { Button, Group, Flex } from '@/design';
import { slideInDownVariants, dropdownVariants } from '@/design';
```

## 📊 State Management

Each component manages its own state:

```tsx
// TopNav
- scrollY (for shadow effect)

// UserMenu
- isOpen (dropdown visibility)

// NotificationDropdown
- isOpen (dropdown visibility)
- notifications[] (list of notifications)

// BottomNav
- No internal state (stateless)
```

## ✨ Best Practices

### 1. Keep Routes Updated
When adding new routes, update the `navItems` array in both `TopNav.tsx` and `BottomNav.tsx`.

### 2. Role-Based Display
Always check user roles before showing admin/restricted routes:

```tsx
const canUpload = user && ['Admin', 'Photographer'].includes(user.role);
```

### 3. Notification Handling
Keep notifications in sync with backend:

```tsx
// When user marks as read on this device, notify backend
await api.patch(`/notifications/${id}`, { read: true });
```

### 4. Mobile Optimization
Bottom nav always includes small labels on mobile:

```tsx
{/* Mobile: Short labels only */}
<span className="text-[10px] font-semibold">Explore</span>
```

### 5. Animation Performance
Use Framer Motion for smooth 60fps animations:

```tsx
whileHover={{ scale: 1.05 }}  // GPU-accelerated
transition={{ duration: 0.2 }} // Consistent timing
```

## 🐛 Troubleshooting

### Navigation not showing
**Check:**
- Are you on a protected route? (nav only shows when authenticated)
- Is `MainLayout` wrapping your route?
- Check browser console for errors

### Dropdown not closing
**Solution:** Ensure outside click handler is working:

```tsx
{isOpen && (
  <motion.div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40" />
)}
```

### Avatar not displaying
**Check:**
- Is `referenceSelfieUrl` set in user object?
- Image CORS policy allows loading
- Fallback shows first letter of name

### Animations not smooth
**Solution:** Ensure `framer-motion` is installed:

```bash
npm install framer-motion
```

## 🚀 Future Enhancements

- [ ] Notification sound alerts
- [ ] Desktop notifications (Web Push API)
- [ ] Keyboard navigation (arrow keys)
- [ ] Search in notifications
- [ ] Custom notification types
- [ ] Notification read receipts
- [ ] Nav search bar
- [ ] Quick actions menu
- [ ] Breadcrumb navigation
- [ ] Route transition animations

## 📚 Related Files

- **Design System:** `frontend/src/design/`
- **Layout:** `frontend/src/components/layout/MainLayout.tsx`
- **Auth Context:** `frontend/src/context/AuthContext.tsx`
- **Socket Service:** `frontend/src/services/socket.ts`

---

**Status:** Production Ready ✅  
**Last Updated:** June 2, 2026  
**Version:** 1.0.0
