# Design System Setup Guide

## ✅ Foundation Complete

The EventSphere design system foundation has been fully established with all core components and utilities. This guide walks you through the next steps.

## 📦 Step 1: Install Dependencies

Two packages are required for the design system primitives to work:

```bash
cd frontend
npm install class-variance-authority clsx
```

**Why these packages?**
- `class-variance-authority` (CVA) - Provides type-safe component variants
- `clsx` - Utility for conditional class names (fallback: can use Tailwind's built-in or just concatenate strings)

### Verify Installation

Check `frontend/package.json` to confirm:

```json
{
  "dependencies": {
    "class-variance-authority": "^x.x.x",
    "clsx": "^x.x.x",
    "framer-motion": "^11.0.24",
    "lucide-react": "^0.364.0",
    "tailwindcss": "^3.4.3"
  }
}
```

## 🎨 Step 2: Files Overview

The design system is organized in `/frontend/src/design/`:

```
design/
├── index.ts           # 🔌 Main export - import from this
├── tokens.ts          # 🎨 Design tokens (colors, typography, spacing, etc.)
├── primitives.tsx     # 🧩 UI primitives (Button, Input, Card, etc.)
├── layout.tsx         # 📐 Layout components (Container, Grid, Flex, etc.)
├── cards.tsx          # 🎴 Card variants for different use cases
├── animations.ts      # ✨ Animation presets for Framer Motion
├── utils.ts           # 🛠️ Utility functions and helpers
├── examples.tsx       # 📖 Reference implementation (do not import)
├── README.md          # 📚 Complete documentation
└── SETUP.md           # 👈 You are here
```

## 📖 Step 3: Usage

### Import Components

```tsx
// ✅ Good - Import from design system
import { Button, Input, Card, Container, Grid } from '@/design';

// ❌ Avoid - Direct file imports
import Button from '@/design/primitives';
```

### Use in Your Pages

```tsx
// pages/MyPage.tsx
import { Button, Input, Container, Stack, Card } from '@/design';
import { Mail } from 'lucide-react';

export function MyPage() {
  return (
    <Container size="2xl" padding>
      <Stack gap="lg">
        <Card variant="glass" padding="lg">
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
          <p className="text-dark-300">Get started here</p>
        </Card>

        <Input
          label="Email"
          placeholder="your@email.com"
          leftIcon={Mail}
          variant="glass"
          required
        />

        <Button variant="primary" size="lg" fullWidth>
          Submit
        </Button>
      </Stack>
    </Container>
  );
}
```

## 🎯 Step 4: Integration Strategy

### Recommended Approach: Phase-by-Phase

Rather than redesigning all pages at once, integrate the design system gradually:

**Phase 1: Utility Components** (1-2 pages)
- Update forms and input fields
- Use new Button variants
- Use new typography tokens

**Phase 2: Layout** (3-4 pages)
- Replace manual layouts with Container/Grid/Flex
- Use Card system for consistent styling
- Implement new spacing patterns

**Phase 3: Polish** (All pages)
- Add animations with Framer Motion presets
- Implement interactive states
- Optimize responsive behavior

### Quick Integration Checklist

For each page:

- [ ] Replace manual layouts with `Container`, `Grid`, `Flex`, `Stack`
- [ ] Update buttons to use `Button` component with variants
- [ ] Update inputs to use `Input` component
- [ ] Replace card-like divs with `Card` component
- [ ] Update spacing to use tokens
- [ ] Add animations from `animations.ts`
- [ ] Test on mobile (responsive)
- [ ] Test dark mode
- [ ] Test accessibility (keyboard, screen readers)

## 💡 Best Practices

### 1. Always Use Tokens

```tsx
// ✅ Good - Uses design tokens
<div className="p-6 mb-4 text-white">
  
// ❌ Avoid - Magic numbers
<div className="p-24 mb-16">
```

### 2. Compose Components

```tsx
// ✅ Good - Compose from primitives
<Card variant="glass" padding="lg">
  <CardHeader title="Title" />
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>

// ❌ Avoid - Overly custom markup
<div className="glass p-6 rounded-lg shadow-lg">
  <div className="border-b p-4">Title</div>
  <div className="p-4">Content</div>
</div>
```

### 3. Use Variant Props

```tsx
// ✅ Good - Use variant system
<Button variant="primary" size="lg">
  Click
</Button>

// ❌ Avoid - Custom classes for each state
<button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg">
  Click
</button>
```

### 4. Responsive Design

```tsx
// ✅ Good - Responsive props
<Grid columns={1} responsive>
  {/* Automatically adapts to md:columns-2 lg:columns-3 */}
</Grid>

// ❌ Avoid - Manual breakpoints everywhere
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Harder to maintain */}
</div>
```

### 5. Consistent Spacing

```tsx
// ✅ Good - Use spacing grid
<Stack gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

// ❌ Avoid - Inconsistent spacing
<div className="mb-4">Item 1</div>
<div className="mb-8">Item 2</div>
<div className="mb-2">Item 3</div>
```

## 🎨 Customization

### Modify Colors

Edit `frontend/src/design/tokens.ts`:

```tsx
export const colors = {
  brand: {
    50: '#f0f7fe',
    100: '#e0effd',
    500: '#0e91eb',  // ← Change primary blue
    600: '#0776c8',
    900: '#004b8a',
  },
  // ...
};
```

### Modify Typography

Edit `frontend/src/design/tokens.ts`:

```tsx
export const typography = {
  fontFamily: {
    sans: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    // Add custom fonts here
  },
  // ...
};
```

### Add Custom Animation

Edit `frontend/src/design/animations.ts`:

```tsx
export const myCustomAnimation: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8 },
};
```

Then export from `index.ts`:

```tsx
export { myCustomAnimation } from './animations';
```

## 🔍 Reference

### Folder Structure for Reference

```
frontend/
├── src/
│   ├── design/              ← 👈 Design system (NEW)
│   │   ├── tokens.ts        ← Design tokens
│   │   ├── primitives.tsx   ← UI components
│   │   ├── layout.tsx       ← Layout components
│   │   ├── cards.tsx        ← Card system
│   │   ├── animations.ts    ← Animation presets
│   │   ├── utils.ts         ← Utilities
│   │   ├── examples.tsx     ← Reference code
│   │   ├── index.ts         ← Main export
│   │   ├── README.md        ← Full docs
│   │   └── SETUP.md         ← Setup guide
│   │
│   ├── components/          ← Page-specific components
│   ├── pages/              ← Page components (use design system here!)
│   ├── services/           ← API services
│   ├── App.tsx             ← Main app
│   └── main.tsx            ← Entry point
│
├── package.json            ← Already has design system deps
├── tailwind.config.js      ← Already configured
└── tsconfig.json           ← Already configured
```

## 🚀 Next Steps

1. **Install dependencies** - `npm install class-variance-authority clsx`
2. **Try a component** - Use Button in one page
3. **Check the docs** - Read `README.md` for full reference
4. **Refer to examples** - Check `examples.tsx` for patterns
5. **Integrate gradually** - Phase-by-phase approach
6. **Customize as needed** - Modify tokens for your brand

## 🆘 Troubleshooting

### "Cannot find module '@/design'"

**Solution:** Check `frontend/tsconfig.json` has:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

And `frontend/vite.config.ts` has:

```tsx
import react from '@vitejs/plugin-react';
import path from 'path';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

### Components not rendering properly

**Check:**
1. Are dependencies installed? `npm list class-variance-authority clsx`
2. Is TypeScript rebuild needed? Try restarting VS Code
3. Are you using the right variant name? Check README.md

### Styling looks wrong

**Check:**
1. Tailwind CSS is running: `npm run dev` or `npm run build`
2. Dark mode is enabled in Tailwind config
3. CSS variables are loaded in `index.css`

## 📚 Documentation

- **Full Component Reference** - See `README.md`
- **Example Components** - See `examples.tsx`
- **Design Tokens** - See `tokens.ts`
- **Utilities** - See `utils.ts`

## 🎯 Success Indicators

You'll know the design system is working when:

✅ Components render with proper styling  
✅ Tailwind classes apply correctly  
✅ Dark mode works  
✅ Animations smooth on hover/interaction  
✅ Responsive design works on mobile  
✅ TypeScript autocompletion works  
✅ No console errors  

## 🎉 You're All Set!

The design system foundation is complete. Start using it in your pages and watch your application transform into a premium, modern interface.

---

**Status:** Ready to Use ✅  
**Last Updated:** June 2, 2026  
**Support:** Check README.md for full documentation
