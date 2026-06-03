/**
 * Design System Quick Reference
 * One-page guide for all available components
 */

/*
╔═══════════════════════════════════════════════════════════════════════════╗
║                    DESIGN SYSTEM QUICK REFERENCE                         ║
╚═══════════════════════════════════════════════════════════════════════════╝
*/

// ============================================================================
// 🧩 UI PRIMITIVES
// ============================================================================

/*
  BUTTON
  ======
  import { Button } from '@/design';

  <Button variant="primary" size="lg" fullWidth isLoading>
    Click me
  </Button>

  Variants: primary | secondary | success | danger | warning | ghost | 
            ghostBrand | glass | glassInverted
  Sizes: xs | sm | md | lg | xl
  Props: variant, size, isLoading, leftIcon, rightIcon, fullWidth, disabled

*/

/*
  INPUT
  =====
  import { Input } from '@/design';

  <Input
    label="Email"
    placeholder="your@email.com"
    type="email"
    variant="default"
    size="md"
    error="Invalid email"
    helperText="Helper text"
    leftIcon={Mail}
    rightIcon={Check}
    required
  />

  Variants: default | glass | minimal
  Sizes: sm | md | lg
  Props: label, placeholder, type, variant, size, error, helperText,
         leftIcon, rightIcon, required, disabled

*/

/*
  SELECT
  ======
  import { Select } from '@/design';

  <Select
    label="Choose option"
    options={[
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2', disabled: true },
    ]}
    variant="default"
    size="md"
    error="Invalid"
  />

  Variants: default | glass
  Sizes: sm | md | lg
  Props: label, options, variant, size, error, required, disabled

*/

/*
  BADGE
  =====
  import { Badge } from '@/design';

  <Badge variant="primary" size="md" icon={Star} dismissible>
    Featured
  </Badge>

  Variants: primary | secondary | success | danger | warning | info
  Sizes: sm | lg
  Props: variant, size, icon, dismissible, onDismiss

*/

/*
  CHECKBOX
  ========
  import { Checkbox } from '@/design';

  <Checkbox
    label="I agree"
    description="Accept terms"
    checked={checked}
    onChange={handleChange}
    error="Required"
  />

  Props: label, description, checked, onChange, error, disabled

*/

/*
  RADIO
  =====
  import { Radio } from '@/design';

  <Radio label="Option 1" name="group" value="opt1" />

  Props: label, name, value, checked, onChange, disabled

*/

/*
  SWITCH
  ======
  import { Switch } from '@/design';

  <Switch
    label="Dark mode"
    description="Enable dark mode"
    checked={isDark}
    onChange={handleChange}
  />

  Props: label, description, checked, onChange, disabled

*/

/*
  TEXTAREA
  ========
  import { Textarea } from '@/design';

  <Textarea
    label="Description"
    placeholder="Enter text"
    rows={4}
    variant="default"
    size="md"
    error="Too short"
  />

  Variants: default | glass | minimal
  Sizes: sm | md | lg
  Props: label, placeholder, rows, variant, size, error, required

*/

// ============================================================================
// 📐 LAYOUT COMPONENTS
// ============================================================================

/*
  CONTAINER
  =========
  import { Container } from '@/design';

  <Container size="2xl" padding centered>
    Content
  </Container>

  Sizes: xs | sm | md | lg | xl | 2xl | 3xl | 4xl | full
  Props: size, padding, centered

*/

/*
  SECTION
  =======
  import { Section } from '@/design';

  <Section variant="glass" padding="lg" gap="md">
    Content
  </Section>

  Variants: default | glass | elevated | subtle
  Padding: xs | sm | md | lg | xl | 2xl
  Gap: xs | sm | md | lg | xl
  Props: variant, padding, gap, children

*/

/*
  FLEX
  ====
  import { Flex } from '@/design';

  <Flex direction="row" align="center" justify="between" gap="lg" wrap>
    Items
  </Flex>

  Direction: row | column
  Align: start | center | end | stretch
  Justify: start | center | end | between | around | evenly
  Gap: xs | sm | md | lg | xl
  Props: direction, align, justify, gap, wrap

*/

/*
  GRID
  ====
  import { Grid } from '@/design';

  <Grid columns={3} gap="md" responsive>
    Items
  </Grid>

  Columns: 1 | 2 | 3 | 4 | 6 | 12 | "auto"
  Gap: xs | sm | md | lg | xl
  Props: columns, gap, responsive

*/

/*
  STACK
  =====
  import { Stack } from '@/design';

  <Stack gap="lg" align="start">
    Items
  </Stack>

  Gap: xs | sm | md | lg | xl
  Align: start | center | end | stretch
  Props: gap, align

*/

/*
  GROUP
  =====
  import { Group } from '@/design';

  <Group gap="md" justify="center">
    Items
  </Group>

  Gap: xs | sm | md | lg | xl
  Justify: start | center | end | between | around | evenly
  Props: gap, justify

*/

/*
  SPACER
  ======
  import { Spacer } from '@/design';

  <Spacer size="lg" />        // Vertical spacer
  <Spacer direction="row" />  // Horizontal spacer

  Size: xs | sm | md | lg | xl
  Direction: column | row
  Props: size, direction

*/

/*
  CENTER
  ======
  import { Center } from '@/design';

  <Center fullHeight>
    Content centered
  </Center>

  Props: fullHeight

*/

/*
  ASPECT RATIO
  ============
  import { AspectRatio } from '@/design';

  <AspectRatio ratio="16/9">
    <img src="..." alt="..." />
  </AspectRatio>

  Ratio: "square" | "4/3" | "16/9" | "21/9" | "3/2" | "9/16" | number
  Props: ratio

*/

/*
  DIVIDER
  =======
  import { Divider } from '@/design';

  <Divider />                          // Simple divider
  <Divider withLabel="Or" />           // With label
  <Divider orientation="vertical" />   // Vertical

  Variant: solid | dashed | dotted
  Orientation: horizontal | vertical
  Props: variant, withLabel, orientation

*/

// ============================================================================
// 🎴 CARD SYSTEM
// ============================================================================

/*
  CARD (Base)
  ===========
  import { Card, CardHeader, CardBody, CardFooter } from '@/design';

  <Card variant="glass" padding="lg" interactive loading={isLoading}>
    <CardHeader
      title="Title"
      subtitle="Subtitle"
      icon={User}
      action={<Button>Action</Button>}
    />
    <CardBody spaced>
      Content
    </CardBody>
    <CardFooter divider>
      Footer
    </CardFooter>
  </Card>

  Card Variants: default | glass | elevated | subtle | minimal | bordered
  Padding: xs | sm | md | lg | xl
  Props: variant, padding, interactive, loading

*/

/*
  FEATURE CARD
  ============
  import { FeatureCard } from '@/design';

  <FeatureCard
    icon={Zap}
    title="Lightning Fast"
    description="Ultra fast performance"
    variant="glass"
    iconColor="brand"
  />

  IconColor: brand | success | danger | warning | info
  Props: icon, title, description, variant, iconColor

*/

/*
  STAT CARD
  =========
  import { StatCard } from '@/design';

  <StatCard
    label="Total Users"
    value="1,234"
    change={12}
    trend="up"
    icon={Users}
  />

  Trend: up | down
  Props: label, value, change, trend, icon

*/

/*
  MEDIA CARD
  ==========
  import { MediaCard } from '@/design';

  <MediaCard
    src="/image.jpg"
    alt="Photo"
    title="Photo Title"
    subtitle="Taken 2 hours ago"
    badge="Featured"
    loading={false}
    onClick={() => {}}
  />

  Props: src, alt, title, subtitle, badge, loading, onClick

*/

/*
  INFO CARD
  =========
  import { InfoCard } from '@/design';

  <InfoCard
    type="success"
    icon={CheckCircle}
    title="Success!"
    message="Changes saved"
    action={<Button>Action</Button>}
    dismissible
    onDismiss={() => {}}
  />

  Type: info | success | warning | danger
  Props: type, icon, title, message, action, dismissible, onDismiss

*/

/*
  EMPTY STATE
  ===========
  import { EmptyState } from '@/design';

  <EmptyState
    icon={Inbox}
    title="No items"
    description="Create one to get started"
    action={<Button>Create</Button>}
  />

  Props: icon, title, description, action

*/

/*
  PRICING CARD
  ============
  import { PricingCard } from '@/design';

  <PricingCard
    name="Pro"
    price={79}
    description="For professionals"
    features={['Feature 1', 'Feature 2']}
    highlighted
    icon={Star}
    action={<Button>Choose</Button>}
  />

  Props: name, price, description, features, highlighted, icon, action

*/

// ============================================================================
// ✨ ANIMATION PRESETS
// ============================================================================

/*
  PAGE TRANSITIONS
  ================
  pageTransitionVariants
  pageSlideVariants

  ENTRANCE ANIMATIONS
  ===================
  fadeInVariants
  slideInUpVariants
  slideInDownVariants
  slideInLeftVariants
  slideInRightVariants
  scaleInVariants
  popInVariants
  flipInVariants
  blurInVariants

  INTERACTIVE ANIMATIONS
  ======================
  hoverLiftVariants        (y: -8 on hover)
  hoverScaleVariants       (scale: 1.05 on hover)
  hoverGlowVariants        (glow shadow on hover)
  tapScaleVariants         (scale: 0.95 on tap)
  tapRotateVariants        (rotate: -2 on tap)

  LOADING ANIMATIONS
  ==================
  spinVariants            (360° rotation loop)
  pulseVariants           (opacity pulse)
  shimmerVariants         (shimmer effect)
  bounceVariants          (bounce motion)

  STAGGER ANIMATIONS
  ==================
  staggerContainerVariants
  staggerItemVariants

  ACCORDION / MODAL / SIDEBAR
  ===========================
  accordionItemVariants
  modalOverlayVariants
  modalContentVariants
  sidebarVariants
  sidebarOverlayVariants
  dropdownVariants

  FEEDBACK
  ========
  notificationVariants    (top-right entrance)
  toastVariants           (bottom entrance)
  avatarHoverVariants     (scale + glow on hover)

  USAGE:
  ======
  import { motion } from 'framer-motion';
  import { fadeInVariants } from '@/design';

  <motion.div
    initial={fadeInVariants.initial}
    animate={fadeInVariants.animate}
    exit={fadeInVariants.exit}
  >
    Content
  </motion.div>

*/

// ============================================================================
// 🛠️ UTILITIES
// ============================================================================

/*
  COLOR UTILITIES
  ===============
  getColor('brand.500')           // Get color value
  lighten('#0e91eb', 20)          // Lighten by %
  darken('#0e91eb', 20)           // Darken by %
  mixColors('#0e91eb', '#fff', 0.5) // Mix two colors
  getContrastingTextColor('#0e91eb') // Black or white for contrast

  SPACING & SIZE UTILITIES
  ========================
  getSpacing('lg')                // Get spacing value
  pxToRem(32)                     // Convert px to rem
  remToPx(2)                      // Convert rem to px

  CLASS UTILITIES
  ===============
  cn('p-4', isActive && 'bg-brand-500')
  createClasses('p-4', { 'bg-brand-500': isActive })

  RESPONSIVE UTILITIES
  ====================
  createResponsiveClasses('p-4', { 'md': 'p-6', 'lg': 'p-8' })
  getBreakpoint('lg')             // Get breakpoint px value

  ANIMATION UTILITIES
  ===================
  createAnimationDelay(2, 0.1)    // Calculate delay for index
  getDurationInSeconds(300)       // Convert ms to seconds

  VALIDATION UTILITIES
  ====================
  isValidHexColor('#0e91eb')
  isValidRgbColor('rgb(255, 0, 0)')

*/

// ============================================================================
// 🎨 DESIGN TOKENS
// ============================================================================

/*
  COLORS
  ======
  colors.brand[50-900]     // Primary brand colors (blue)
  colors.success[50-900]   // Success colors (green)
  colors.danger[50-900]    // Danger colors (red)
  colors.warning[50-900]   // Warning colors (amber)
  colors.info[50-900]      // Info colors (cyan)
  colors.dark[50-900]      // Dark palette (for dark mode)
  colors.neutral[50-900]   // Neutral grays
  colors.glass.*           // Glass effect colors

  TYPOGRAPHY
  ==========
  typography.fontSize      // Font size values
  typography.fontWeight    // Font weights
  typography.lineHeight    // Line heights
  typography.styles.h1     // Predefined styles (h1-h6, body, label, button)

  SPACING (8px grid)
  ==================
  spacing[0-96]           // 0px to 96px in 8px increments
  spacing.xs = 8px        // spacing[1]
  spacing.sm = 16px       // spacing[2]
  spacing.md = 24px       // spacing[3]
  spacing.lg = 32px       // spacing[4]
  spacing.xl = 48px       // spacing[6]

  SHADOWS
  =======
  shadows.soft
  shadows.softLarge
  shadows.glass
  shadows.glowBrand
  shadows.glassSmall

  ANIMATIONS
  ==========
  transitions.fast         // 150ms
  transitions.base         // 200ms
  transitions.moderate     // 300ms
  transitions.slow         // 500ms
  easing.easeOut
  easing.easeInOut

  Z-INDEX
  =======
  zIndex.hide = -1         // Hide elements
  zIndex.base = 0
  zIndex.dropdown = 1000
  zIndex.sticky = 1020
  zIndex.fixed = 1030
  zIndex.backdrop = 1040
  zIndex.modal = 1050
  zIndex.popover = 1060
  zIndex.tooltip = 1070
  zIndex.notification = 1080

  BREAKPOINTS
  ===========
  xs: 320px
  sm: 640px
  md: 768px
  lg: 1024px
  xl: 1280px
  2xl: 1536px

*/

// ============================================================================
// 📖 IMPORT PATTERN
// ============================================================================

/*
  All imports should come from @/design:

  ✅ CORRECT
  import { Button, Input, Card, Container, Grid } from '@/design';

  ❌ INCORRECT
  import Button from '@/design/primitives';
  import { Button } from '@/design/primitives';

*/

// ============================================================================
// 🎯 COMMON PATTERNS
// ============================================================================

/*
  FORM PATTERN
  ============
  <Container size="md" padding>
    <Stack gap="lg">
      <Card variant="glass">
        <h2>Form Title</h2>
      </Card>

      <Input label="Email" type="email" required />
      <Input label="Password" type="password" required />
      <Checkbox label="I agree" />

      <Group gap="md">
        <Button variant="primary">Submit</Button>
        <Button variant="ghost">Cancel</Button>
      </Group>
    </Stack>
  </Container>

  FEATURE GRID PATTERN
  ====================
  <Section gap="lg">
    <h2>Features</h2>
    <Grid columns={3} gap="md" responsive>
      <FeatureCard icon={Zap} title="Fast" description="..." />
      <FeatureCard icon={Lock} title="Secure" description="..." />
      <FeatureCard icon={Cloud} title="Cloud" description="..." />
    </Grid>
  </Section>

  CARD GRID PATTERN
  =================
  <Container size="2xl" padding>
    <Stack gap="lg">
      <h2>Items</h2>
      <Grid columns={2} gap="lg" responsive>
        {items.map(item => (
          <Card key={item.id} variant="elevated" interactive>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </Grid>
    </Stack>
  </Container>

*/

// ============================================================================
// ✅ CHECKLIST FOR NEW COMPONENTS
// ============================================================================

/*
  When adding a new component to your page:

  [ ] Import from @/design
  [ ] Use a component variant
  [ ] Add appropriate spacing with Stack/Group/Grid
  [ ] Make it responsive (test on mobile)
  [ ] Check dark mode looks good
  [ ] Add loading state if needed
  [ ] Add error handling
  [ ] Test keyboard accessibility
  [ ] Test with screen readers
  [ ] Add animations (if appropriate)
  [ ] Get visual approval

*/

export {};
