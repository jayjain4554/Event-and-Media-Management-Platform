/**
 * Design System Example Component Showcase
 * Demonstrates all available components and patterns
 *
 * This file is for reference only - shows how to use the design system
 * DO NOT import this in actual application
 */

import React from 'react';
import {
  // Primitives
  Button,
  Input,
  Select,
  Badge,
  Checkbox,
  Radio,
  Switch,
  Textarea,

  // Layout
  Container,
  Section,
  Flex,
  Grid,
  Stack,
  Group,
  Spacer,
  Center,
  AspectRatio,
  Divider,

  // Cards
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FeatureCard,
  StatCard,
  MediaCard,
  InfoCard,
  EmptyState,
  PricingCard,

  // Utilities
  cn,
} from '@/design';

import {
  Bell,
  Search,
  Mail,
  Lock,
  Star,
  User,
  Users,
  Zap,
  CheckCircle,
  Inbox,
  Settings,
} from 'lucide-react';

/**
 * EXAMPLE 1: Button Variants
 */
export function ButtonShowcase() {
  return (
    <Section padding="lg" gap="lg">
      <h2 className="text-2xl font-bold text-white">Button Variants</h2>

      <Grid columns={3} gap="md">
        {/* Primary Buttons */}
        <Stack gap="sm">
          <p className="text-sm font-semibold text-dark-300">Primary</p>
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
        </Stack>

        {/* Secondary Buttons */}
        <Stack gap="sm">
          <p className="text-sm font-semibold text-dark-300">Secondary</p>
          <Button variant="secondary" size="sm">
            Small
          </Button>
          <Button variant="secondary" size="md">
            Medium
          </Button>
          <Button variant="secondary" size="lg">
            Large
          </Button>
        </Stack>

        {/* Ghost Buttons */}
        <Stack gap="sm">
          <p className="text-sm font-semibold text-dark-300">Ghost</p>
          <Button variant="ghost" size="sm">
            Small
          </Button>
          <Button variant="ghost" size="md">
            Medium
          </Button>
          <Button variant="ghost" size="lg">
            Large
          </Button>
        </Stack>
      </Grid>

      {/* Buttons with Icons */}
      <Stack gap="md">
        <h3 className="text-lg font-semibold text-white">With Icons</h3>
        <Group gap="md">
          <Button leftIcon={Search} variant="primary">
            Search
          </Button>
          <Button rightIcon={Bell} variant="primary">
            Notifications
          </Button>
          <Button leftIcon={Star} rightIcon={Star} variant="ghost">
            Favorite
          </Button>
        </Group>
      </Stack>

      {/* Button States */}
      <Stack gap="md">
        <h3 className="text-lg font-semibold text-white">States</h3>
        <Group gap="md">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" isLoading>
            Loading...
          </Button>
          <Button variant="primary" fullWidth>
            Full Width
          </Button>
        </Group>
      </Stack>
    </Section>
  );
}

/**
 * EXAMPLE 2: Form Components
 */
export function FormShowcase() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    category: 'option1',
    terms: false,
    notifications: true,
  });

  return (
    <Section variant="glass" padding="lg" gap="lg">
      <CardHeader title="Form Example" subtitle="All available form components" />

      <Stack gap="md">
        <Input
          label="Email Address"
          placeholder="your@email.com"
          type="email"
          leftIcon={Mail}
          helperText="We'll never share your email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <Input
          label="Password"
          placeholder="••••••••"
          type="password"
          leftIcon={Lock}
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <Select
          label="Category"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />

        <Textarea label="Message" placeholder="Type your message..." rows={4} />

        <Checkbox
          label="I agree to terms and conditions"
          checked={formData.terms}
          onChange={(e) =>
            setFormData({ ...formData, terms: e.target.checked })
          }
        />

        <Switch
          label="Enable notifications"
          checked={formData.notifications}
          onChange={(e) =>
            setFormData({ ...formData, notifications: e.target.checked })
          }
        />

        <Divider withLabel="Or" />

        <Group gap="md">
          <Radio label="Option A" name="choice" defaultChecked />
          <Radio label="Option B" name="choice" />
          <Radio label="Option C" name="choice" />
        </Group>

        <Button variant="primary" fullWidth size="lg">
          Submit Form
        </Button>
      </Stack>
    </Section>
  );
}

/**
 * EXAMPLE 3: Cards & Info Cards
 */
export function CardsShowcase() {
  return (
    <Section padding="lg" gap="lg">
      <h2 className="text-2xl font-bold text-white">Card Variants</h2>

      <Grid columns={2} gap="lg">
        {/* Feature Cards */}
        <FeatureCard
          icon={Zap}
          title="Lightning Fast"
          description="Optimized performance for speed"
          variant="glass"
          iconColor="brand"
        />

        <FeatureCard
          icon={Users}
          title="Collaborative"
          description="Work together seamlessly"
          variant="glass"
          iconColor="success"
        />

        {/* Stat Cards */}
        <StatCard
          label="Total Users"
          value="1,234"
          change={12}
          trend="up"
          icon={Users}
        />

        <StatCard
          label="Revenue"
          value="$45,678"
          change={-5}
          trend="down"
          icon={Star}
        />
      </Grid>

      {/* Info Cards */}
      <Stack gap="md">
        <h3 className="text-lg font-semibold text-white mt-6">Info Cards</h3>

        <InfoCard
          type="success"
          icon={CheckCircle}
          title="Success!"
          message="Your changes have been saved successfully."
        />

        <InfoCard
          type="warning"
          icon={Bell}
          title="Heads up!"
          message="This action cannot be undone."
        />

        <InfoCard
          type="danger"
          icon={Star}
          title="Error!"
          message="Something went wrong. Please try again."
          dismissible
          onDismiss={() => console.log('dismissed')}
        />
      </Stack>

      {/* Empty State */}
      <EmptyState
        icon={Inbox}
        title="No items found"
        description="You don't have any items yet. Create one to get started."
        action={<Button variant="primary">Create Item</Button>}
      />
    </Section>
  );
}

/**
 * EXAMPLE 4: Layout Components
 */
export function LayoutShowcase() {
  return (
    <Section padding="lg" gap="lg">
      <h2 className="text-2xl font-bold text-white">Layout Components</h2>

      {/* Grid Layout */}
      <Stack gap="md">
        <h3 className="text-lg font-semibold text-white">Responsive Grid</h3>
        <Grid columns={3} gap="md" responsive>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card
              key={item}
              variant="elevated"
              className="text-center p-8"
            >
              <p className="text-2xl font-bold text-brand-500">{item}</p>
            </Card>
          ))}
        </Grid>
      </Stack>

      {/* Flex Layout */}
      <Stack gap="md">
        <h3 className="text-lg font-semibold text-white">Flex Layout</h3>
        <Flex gap="md" justify="between" wrap>
          <Badge variant="primary">Tag 1</Badge>
          <Badge variant="success">Tag 2</Badge>
          <Badge variant="warning">Tag 3</Badge>
          <Badge variant="danger">Tag 4</Badge>
        </Flex>
      </Stack>

      {/* Divider */}
      <Divider withLabel="Section Break" />

      {/* Aspect Ratio */}
      <Stack gap="md">
        <h3 className="text-lg font-semibold text-white">Aspect Ratio</h3>
        <AspectRatio ratio="16/9">
          <div className="w-full h-full bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center">
            <p className="text-white font-bold">16:9 Aspect Ratio</p>
          </div>
        </AspectRatio>
      </Stack>
    </Section>
  );
}

/**
 * EXAMPLE 5: Complete Page Example
 */
export function CompletePageExample() {
  return (
    <Container size="2xl" padding>
      <Stack gap="xl">
        {/* Hero Section */}
        <Section variant="glass" padding="xl" gap="lg" className="text-center">
          <h1 className="text-5xl font-bold text-white">
            Design System Showcase
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto">
            A premium, modern design system with components inspired by Linear,
            Notion, and Stripe.
          </p>
          <Group gap="md" justify="center">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </Group>
        </Section>

        {/* Features Section */}
        <Section gap="lg">
          <h2 className="text-3xl font-bold text-white">Features</h2>
          <Grid columns={3} gap="md" responsive>
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized for performance"
              variant="glass"
            />
            <FeatureCard
              icon={Settings}
              title="Customizable"
              description="Easy to extend and modify"
              variant="glass"
            />
            <FeatureCard
              icon={Users}
              title="Accessible"
              description="WCAG compliant components"
              variant="glass"
            />
          </Grid>
        </Section>

        {/* Pricing Section */}
        <Section gap="lg">
          <h2 className="text-3xl font-bold text-white">Pricing Plans</h2>
          <Grid columns={3} gap="lg" responsive>
            <PricingCard
              name="Starter"
              price={29}
              description="For individuals"
              features={['Feature 1', 'Feature 2']}
              action={<Button variant="secondary" fullWidth>
                Choose Plan
              </Button>}
            />
            <PricingCard
              name="Pro"
              price={79}
              description="For professionals"
              features={['Feature 1', 'Feature 2', 'Feature 3']}
              highlighted
              icon={Star}
              action={<Button variant="primary" fullWidth>
                Choose Plan
              </Button>}
            />
            <PricingCard
              name="Enterprise"
              price={199}
              description="For teams"
              features={['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']}
              action={<Button variant="secondary" fullWidth>
                Contact Sales
              </Button>}
            />
          </Grid>
        </Section>

        {/* CTA Section */}
        <Section
          variant="glass"
          padding="xl"
          gap="lg"
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="text-dark-300">
            Join thousands of users building amazing applications
          </p>
          <Button variant="primary" size="lg">
            Start Free Trial
          </Button>
        </Section>
      </Stack>
    </Container>
  );
}

/**
 * EXAMPLE 6: Animation Examples
 */
export function AnimationShowcase() {
  return (
    <Section padding="lg" gap="lg">
      <h2 className="text-2xl font-bold text-white">Animations</h2>

      <p className="text-dark-300">
        See the animations in the code. Check animations.ts for available
        presets.
      </p>

      <Grid columns={2} gap="md" responsive>
        <Card variant="glass" padding="md">
          <h3 className="font-bold text-white mb-2">Entrance Animations</h3>
          <ul className="text-sm text-dark-300 space-y-1">
            <li>• fadeIn</li>
            <li>• slideInUp / slideInDown</li>
            <li>• scaleIn</li>
            <li>• popIn</li>
          </ul>
        </Card>

        <Card variant="glass" padding="md">
          <h3 className="font-bold text-white mb-2">Interactive</h3>
          <ul className="text-sm text-dark-300 space-y-1">
            <li>• hoverLift</li>
            <li>• hoverScale</li>
            <li>• tapScale</li>
            <li>• draggable</li>
          </ul>
        </Card>
      </Grid>
    </Section>
  );
}
