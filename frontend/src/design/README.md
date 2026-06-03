# EventSphere Design System

A premium, modern design system built with Tailwind CSS, Framer Motion, and Lucide Icons. Designed with dark mode first, glassmorphism, and smooth interactions inspired by Linear, Notion, Stripe, and Apple.

## 📋 Overview

The design system provides a complete foundation for building consistent, premium user interfaces:

- **Design Tokens** - Centralized colors, typography, spacing, shadows, animations
- **UI Primitives** - Reusable buttons, inputs, selects, badges, checkboxes, etc.
- **Layout Components** - Container, Section, Flex, Grid, Stack, Group, Spacer
- **Card System** - Various card variants for different use cases
- **Animation Presets** - Standardized motion patterns with Framer Motion
- **Utilities** - Color manipulation, responsive helpers, accessibility tools

## 🚀 Quick Start

### Import Components

```tsx
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  Container,
  Grid,
  Stack,
} from '@/design';
```

### Use in Components

```tsx
import { Button, Input, Card, Stack } from '@/design';

export function MyComponent() {
  return (
    <Stack gap="lg">
      <Card variant="glass">
        <h2 className="font-bold text-lg text-white">Welcome</h2>
        <p className="text-sm text-dark-300">Enter your details</p>
      </Card>

      <Input
        type="email"
        placeholder="your@email.com"
        variant="glass"
        size="md"
      />

      <Button variant="primary" size="lg" fullWidth>
        Get Started
      </Button>
    </Stack>
  );
}
```

## 🎨 Design Tokens

### Colors

```tsx
import { colors } from '@/design';

// Brand colors
colors.brand[500]     // Primary blue
colors.success[500]   // Green
colors.danger[500]    // Red
colors.warning[500]   // Amber
colors.info[500]      // Cyan

// Dark palette
colors.dark[50]       // Lightest
colors.dark[900]      // Darkest

// Glass effects
colors.glass.light
colors.glass.card
colors.glass.border
```

### Typography

```tsx
import { typography } from '@/design';

typography.fontSize.xl      // Font sizes
typography.fontWeight.bold  // Weights
typography.lineHeight.tight // Line heights
typography.styles.h1        // Predefined styles
typography.styles.body
typography.styles.label
```

### Spacing (8px grid)

```tsx
import { spacing } from '@/design';

spacing[2]   // 8px
spacing[4]   // 16px
spacing[6]   // 24px
spacing[8]   // 32px
spacing[12]  // 48px
```

### Shadows

```tsx
import { shadows } from '@/design';

shadows.soft
shadows.softLarge
shadows.glass
shadows.glowBrand
shadows.glassSmall
```

## 🎛️ UI Primitives

### Button

```tsx
<Button variant="primary" size="lg">
  Click me
</Button>

<Button variant="ghost" leftIcon={Search}>
  Search
</Button>

<Button variant="glass" isLoading>
  Loading...
</Button>
```

**Variants:** `primary`, `secondary`, `success`, `danger`, `warning`, `ghost`, `ghostBrand`, `glass`, `glassInverted`

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `full`

**Props:**
- `variant` - Button style
- `size` - Button size
- `isLoading` - Show loading state
- `leftIcon` - Icon component (left)
- `rightIcon` - Icon component (right)
- `fullWidth` - Stretch to full width

### Input

```tsx
<Input
  label="Email"
  placeholder="your@email.com"
  type="email"
  variant="default"
  size="md"
  error="Invalid email"
  helperText="We'll never share your email"
  leftIcon={Mail}
  required
/>
```

**Variants:** `default`, `glass`, `minimal`

**Sizes:** `sm`, `md`, `lg`

**Props:**
- `label` - Input label
- `error` - Error message
- `helperText` - Helper text below input
- `leftIcon` - Icon on left
- `rightIcon` - Icon on right
- `required` - Mark as required

### Select

```tsx
<Select
  label="Choose option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  variant="default"
  size="md"
/>
```

### Badge

```tsx
<Badge variant="primary" size="md" icon={Star}>
  Featured
</Badge>
```

**Variants:** `primary`, `secondary`, `success`, `danger`, `warning`, `info`

### Checkbox & Radio

```tsx
<Checkbox
  label="I agree to terms"
  description="You must agree to continue"
/>

<Radio label="Option 1" name="group" />
```

### Switch

```tsx
<Switch
  label="Dark mode"
  description="Enable dark mode"
/>
```

### Textarea

```tsx
<Textarea
  label="Description"
  placeholder="Enter description"
  variant="default"
  rows={4}
/>
```

## 🏗️ Layout Components

### Container

```tsx
<Container size="xl" padding centered>
  {/* Max width 80rem, centered, with responsive padding */}
</Container>
```

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `full`

### Section

```tsx
<Section variant="glass" padding="lg" gap="md">
  {/* Section with glassmorphism */}
</Section>
```

**Variants:** `default`, `glass`, `elevated`, `subtle`

### Flex & Grid

```tsx
<Flex direction="row" align="center" justify="between" gap="lg">
  {/* Flexible layout */}
</Flex>

<Grid columns={3} gap="md" responsive>
  {/* 3 columns, responsive on mobile */}
</Grid>
```

### Stack & Group

```tsx
<Stack gap="lg">
  {/* Vertical spacing */}
</Stack>

<Group gap="md" justify="center">
  {/* Horizontal spacing */}
</Group>
```

### Center

```tsx
<Center fullHeight>
  {/* Centered content, full screen height */}
</Center>
```

### AspectRatio

```tsx
<AspectRatio ratio="16/9">
  <img src="..." alt="..." />
</AspectRatio>
```

## 🎴 Card System

### Base Card

```tsx
<Card variant="glass" padding="lg" interactive>
  {/* Card content */}
</Card>
```

**Variants:** `default`, `glass`, `elevated`, `subtle`, `minimal`, `bordered`

### Card with Header, Body, Footer

```tsx
<Card>
  <CardHeader
    title="Title"
    subtitle="Subtitle"
    icon={User}
    action={<Button size="sm">Action</Button>}
  />
  <CardBody spaced>
    {/* Content */}
  </CardBody>
  <CardFooter divider>
    {/* Footer content */}
  </CardFooter>
</Card>
```

### Feature Card

```tsx
<FeatureCard
  icon={Zap}
  title="Fast"
  description="Lightning quick performance"
  variant="glass"
  iconColor="brand"
/>
```

### Stat Card

```tsx
<StatCard
  label="Total Users"
  value="1,234"
  change={12}
  trend="up"
  icon={Users}
/>
```

### Media Card

```tsx
<MediaCard
  src="/image.jpg"
  alt="Photo"
  title="Photo title"
  subtitle="Taken 2 hours ago"
  badge="Featured"
  onClick={() => console.log('clicked')}
/>
```

### Info Card

```tsx
<InfoCard
  type="success"
  icon={CheckCircle}
  title="Success!"
  message="Your changes have been saved"
  dismissible
  onDismiss={() => setVisible(false)}
/>
```

### Empty State

```tsx
<EmptyState
  icon={Inbox}
  title="No items"
  description="You don't have any items yet"
  action={<Button>Create Item</Button>}
/>
```

### Pricing Card

```tsx
<PricingCard
  name="Pro"
  price={29}
  description="For professionals"
  features={['Feature 1', 'Feature 2']}
  highlighted
  icon={Star}
  action={<Button>Get Started</Button>}
/>
```

## ✨ Animations

### Entrance Animations

```tsx
import { motion } from 'framer-motion';
import { fadeInVariants, slideInUpVariants } from '@/design';

<motion.div
  initial={slideInUpVariants.initial}
  animate={slideInUpVariants.animate}
  exit={slideInUpVariants.exit}
>
  Content
</motion.div>
```

**Available:** `fadeIn`, `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`, `scaleIn`, `popIn`, `flipIn`

### Stagger Container

```tsx
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '@/design';

<motion.div
  variants={staggerContainerVariants}
  initial="initial"
  animate="animate"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### Interactive Animations

```tsx
import { hoverLiftVariants, tapScaleVariants } from '@/design';

<motion.button
  variants={hoverLiftVariants}
  whileTap={tapScaleVariants.whileTap}
>
  Click me
</motion.button>
```

## 🛠️ Utilities

### Color Utilities

```tsx
import {
  getColor,
  lighten,
  darken,
  mixColors,
  getContrastingTextColor,
} from '@/design';

getColor('brand.500')              // Get color value
lighten('#0e91eb', 20)              // Lighten by 20%
darken('#0e91eb', 20)               // Darken by 20%
mixColors('#0e91eb', '#ffffff', 0.5) // Mix colors
getContrastingTextColor('#0e91eb')  // Get text color (black/white)
```

### Class Utilities

```tsx
import { cn, createClasses } from '@/design';

cn('p-4', isActive && 'bg-brand-500')
createClasses('p-4', { 'bg-brand-500': isActive })
```

### Size Utilities

```tsx
import { pxToRem, remToPx } from '@/design';

pxToRem(32)  // Convert 32px to rem
remToPx(2)   // Convert 2rem to px
```

### Animation Utilities

```tsx
import { createAnimationDelay, getDurationInSeconds } from '@/design';

createAnimationDelay(2, 0.1)  // Delay for 3rd item: 0.2s
getDurationInSeconds(300)      // Convert 300ms to 0.3s
```

## 🎯 Best Practices

1. **Use tokens over magic numbers** - Always reference design tokens
2. **Compose components** - Build complex UIs from smaller components
3. **Consistent spacing** - Use the 8px spacing grid
4. **Animations in moderation** - Use animations to guide user attention
5. **Accessible by default** - All components follow WCAG standards
6. **Dark mode first** - Design for dark mode, then adapt to light
7. **Responsive** - Test on multiple breakpoints
8. **Type safe** - Use TypeScript for better DX

## 📦 Installation Dependencies

The design system uses these peer dependencies:

```bash
npm install framer-motion lucide-react class-variance-authority
```

Already included in your project:
- `tailwindcss` - Already configured
- `react` - Already installed
- `typescript` - Already installed

## 🔄 Extending the Design System

### Add Custom Component

```tsx
// components/MyComponent.tsx
import { Card, Button } from '@/design';

export const MyComponent: React.FC = () => {
  return (
    <Card variant="glass">
      <Button>Click me</Button>
    </Card>
  );
};
```

### Add Custom Token

```tsx
// design/tokens.ts
export const customTokens = {
  myColor: '#custom-color',
  mySpacing: '1.5rem',
};
```

### Add Custom Animation

```tsx
// design/animations.ts
export const myCustomVariants: Variants = {
  initial: { /* ... */ },
  animate: { /* ... */ },
};
```

## 📚 File Structure

```
frontend/src/design/
├── index.ts                # Main export
├── tokens.ts               # Design tokens
├── primitives.tsx          # UI primitives (Button, Input, etc.)
├── layout.tsx              # Layout components
├── cards.tsx               # Card system
├── animations.ts           # Animation presets
└── utils.ts               # Utility functions
```

## 🚀 Next Steps

1. ✅ Design system foundation complete
2. ⏳ Refactor existing pages to use new components
3. ⏳ Create component storybook
4. ⏳ Build page templates
5. ⏳ Create design documentation site

---

**Status:** Foundation Complete ✅  
**Last Updated:** June 2, 2026  
**Version:** 1.0.0
