/**
 * Premium Landing Page
 * Cinematic hero, animated sections, and premium visual design
 * Inspired by Apple, Stripe, and Linear
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Container,
  Section,
  Flex,
  Grid,
  Stack,
  Center,
  Card,
  Badge,
  Button,
} from '@/design';
import {
  staggerContainerVariants,
  staggerItemVariants,
} from '@/design';
import {
  Sparkles,
  Layers,
  Zap,
  Search,
  Heart,
  Users,
  ArrowRight,
  Play,
  Camera,
  Eye,
  Lock,
  Cloud,
  CheckCircle2,
  Star,
} from 'lucide-react';

// ============================================================================
// SECTION 1: CINEMATIC HERO
// ============================================================================

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <motion.div
      style={{ y, opacity }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background with Multiple Layers */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800" />

        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(14,145,235,.05)_25%,rgba(14,145,235,.05)_26%,transparent_27%,transparent_74%,rgba(14,145,235,.05)_75%,rgba(14,145,235,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,145,235,.05)_25%,rgba(14,145,235,.05)_26%,transparent_27%,transparent_74%,rgba(14,145,235,.05)_75%,rgba(14,145,235,.05)_76%,transparent_77%,transparent)]"
            style={{ backgroundSize: '50px 50px' }} />
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-brand-500 to-brand-600 opacity-20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-l from-indigo-500 to-purple-600 opacity-20 blur-[120px]"
        />
      </div>

      {/* Hero Content */}
      <Container size="2xl" padding className="relative z-10 text-center">
        <Stack gap="xl" align="center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="primary"
              size="lg"
              icon={<Sparkles size={14} />}
              className="mx-auto"
            >
              AI-Powered Platform
            </Badge>
          </motion.div>

          {/* Hero Title - Large and Cinematic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
              <span className="block text-white">Capture Every</span>
              <span className="block bg-gradient-to-r from-brand-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Memorable Moment
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-300 max-w-2xl font-medium leading-relaxed"
          >
            The ultimate platform for event photography. Centralized galleries, AI facial recognition, secure watermarking, and instant photo discovery.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4"
          >
            <Flex gap="md" justify="center" wrap>
              <Link to="/events" className="no-underline">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  className="font-bold tracking-wide"
                >
                  Explore Events
                </Button>
              </Link>
              <Link to="/login" className="no-underline">
                <Button
                  variant="glass"
                  size="lg"
                  rightIcon={<Play size={18} />}
                  className="font-bold tracking-wide"
                >
                  See Demo
                </Button>
              </Link>
            </Flex>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-12 border-t border-glass-border"
          >
            <Grid columns={3} gap="lg" responsive>
              {[
                { value: '10K+', label: 'Photos Organized' },
                { value: '99.9%', label: 'Accuracy' },
                { value: '1M+', label: 'Faces Recognized' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-black text-brand-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-dark-400 font-medium mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </Stack>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="text-center text-dark-400">
          <div className="text-xs font-medium tracking-widest uppercase mb-2">
            Scroll
          </div>
          <div className="w-5 h-8 border border-dark-400 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ y: [4, 12, 4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-dark-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// SECTION 2: FEATURES SHOWCASE
// ============================================================================

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Centralized Gallery',
      description: 'All event photos organized by events, albums, and dates. Optimized performance for massive libraries.',
      color: 'brand',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Facial Recognition',
      description: 'Register once, find yourself everywhere. Instant identification across thousands of photos.',
      color: 'info',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure Rights',
      description: 'Automatic watermarking on download. Role-based access control. Protected intellectual property.',
      color: 'success',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Smart Favorites',
      description: 'Heart your favorite moments. Instant collections. Easy sharing with loved ones.',
      color: 'danger',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Driven',
      description: 'Discover what your friends and community captured. Connect over shared memories.',
      color: 'warning',
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Smart Search',
      description: 'Find exactly what you\'re looking for. Filter by date, event, people, and more.',
      color: 'info',
    },
  ];

  return (
    <Section variant="subtle" padding="xl" gap="lg">
      <Container size="2xl" padding>
        <Stack gap="xl" align="center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="secondary" size="lg" className="mx-auto mb-4">
              Powerful Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Everything you need to manage event photos
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Built with photography clubs and event teams in mind. Streamlined workflows for capturing, organizing, and sharing your best moments.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full"
          >
            <Grid columns={3} gap="lg" responsive>
              {features.map((feature, index) => (
                <motion.div key={index} variants={staggerItemVariants}>
                  <Card
                    variant="glass"
                    padding="lg"
                    interactive
                    className="h-full border border-glass-border hover:border-brand-500/30 transition-all"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`
                        text-3xl mb-4 w-fit p-3 rounded-lg
                        ${feature.color === 'brand' ? 'bg-brand-500/10 text-brand-400' : ''}
                        ${feature.color === 'info' ? 'bg-info-500/10 text-info-400' : ''}
                        ${feature.color === 'success' ? 'bg-success-500/10 text-success-400' : ''}
                        ${feature.color === 'danger' ? 'bg-danger-500/10 text-danger-400' : ''}
                        ${feature.color === 'warning' ? 'bg-warning-500/10 text-warning-400' : ''}
                      `}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-dark-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
};

// ============================================================================
// SECTION 3: HOW IT WORKS
// ============================================================================

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Events',
      description: 'Create events and bulk upload photos directly from your camera or cloud storage.',
      icon: <Cloud className="w-10 h-10" />,
    },
    {
      number: '02',
      title: 'Register Selfie',
      description: 'Upload a reference photo of yourself for AI facial recognition to work its magic.',
      icon: <Camera className="w-10 h-10" />,
    },
    {
      number: '03',
      title: 'Discover Photos',
      description: 'Our AI engine scans all photos and instantly shows you every moment you appeared in.',
      icon: <Eye className="w-10 h-10" />,
    },
    {
      number: '04',
      title: 'Favorite & Share',
      description: 'Heart your favorites, organize into albums, and share with friends instantly.',
      icon: <Heart className="w-10 h-10" />,
    },
  ];

  return (
    <Section variant="default" padding="xl" gap="lg">
      <Container size="2xl" padding>
        <Stack gap="xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="primary" size="lg" className="mx-auto mb-4">
              Simple Process
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Get started in 4 simple steps
            </h2>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full"
          >
            <Grid columns={4} gap="md" responsive>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={staggerItemVariants}
                  className="relative"
                >
                  {/* Card */}
                  <Card variant="elevated" padding="lg" className="text-center relative z-10">
                    {/* Step Number Circle */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <div className="text-brand-400 mb-3 flex justify-center">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-dark-300 text-sm">{step.description}</p>
                  </Card>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      className="absolute top-24 left-full w-full h-1 bg-gradient-to-r from-brand-500 to-transparent origin-left hidden lg:block"
                    />
                  )}
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
};

// ============================================================================
// SECTION 4: AI CAPABILITIES
// ============================================================================

const AICapabilitiesSection: React.FC = () => {
  return (
    <Section variant="glass" padding="xl" gap="lg" className="border border-glass-border">
      <Container size="2xl" padding>
        <Stack gap="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Column - Text */}
            <Stack gap="lg">
              <div>
                <Badge variant="success" size="lg" className="mb-4">
                  Advanced AI
                </Badge>
                <h2 className="text-4xl font-black text-white mb-4">
                  Powered by cutting-edge recognition
                </h2>
                <p className="text-dark-300 text-lg leading-relaxed">
                  Our proprietary AI engine uses advanced deep learning to recognize faces with 99.9% accuracy, even in challenging lighting and angles.
                </p>
              </div>

              {/* Capability List */}
              <motion.div
                variants={staggerContainerVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  'Real-time facial recognition',
                  'Works with different angles & lighting',
                  'Handles large photo libraries',
                  'Privacy-first processing',
                  'Continuous learning & improvement',
                ].map((capability, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItemVariants}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success-400 shrink-0" />
                    <span className="text-white font-medium">{capability}</span>
                  </motion.div>
                ))}
              </motion.div>
            </Stack>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-glass-border overflow-hidden">
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Animated scan lines */}
                  <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent"
                  />

                  {/* Center face icon */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-6xl"
                  >
                    👤
                  </motion.div>

                  {/* Corner markers */}
                  {[
                    'top-4 left-4',
                    'top-4 right-4',
                    'bottom-4 left-4',
                    'bottom-4 right-4',
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className={`absolute w-4 h-4 border-2 border-brand-400 ${pos}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
};

// ============================================================================
// SECTION 5: EVENT DISCOVERY PREVIEW
// ============================================================================

const EventDiscoverySection: React.FC = () => {
  const events = [
    {
      title: 'Summer Festival 2026',
      photos: 2847,
      icon: '🎉',
      color: 'from-yellow-500/30 to-orange-500/30',
    },
    {
      title: 'Tech Conference 2026',
      photos: 1523,
      icon: '💻',
      color: 'from-blue-500/30 to-cyan-500/30',
    },
    {
      title: 'Gala Dinner 2026',
      photos: 892,
      icon: '✨',
      color: 'from-purple-500/30 to-pink-500/30',
    },
    {
      title: 'Sports Day 2026',
      photos: 3412,
      icon: '⚽',
      color: 'from-green-500/30 to-emerald-500/30',
    },
  ];

  return (
    <Section variant="subtle" padding="xl" gap="lg">
      <Container size="2xl" padding>
        <Stack gap="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="warning" size="lg" className="mx-auto mb-4">
              Browse Events
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Explore thousands of memorable moments
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Browse events from your club, discover new memories, and connect with your community.
            </p>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full"
          >
            <Grid columns={2} gap="lg" responsive>
              {events.map((event, i) => (
                <motion.div key={i} variants={staggerItemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`relative rounded-2xl bg-gradient-to-br ${event.color} border border-glass-border p-8 h-full flex flex-col justify-between overflow-hidden cursor-pointer group`}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent"
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{event.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-dark-200 font-medium">
                        {event.photos.toLocaleString()} photos
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="relative z-10 flex items-center gap-2 text-brand-400 group-hover:gap-4 transition-all">
                      <span className="text-sm font-semibold">View Event</span>
                      <ArrowRight size={16} />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </Grid>
          </motion.div>

          {/* CTA Button */}
          <Center>
            <Link to="/events" className="no-underline">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />}>
                Browse All Events
              </Button>
            </Link>
          </Center>
        </Stack>
      </Container>
    </Section>
  );
};

// ============================================================================
// SECTION 6: TESTIMONIALS
// ============================================================================

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Photography Club President',
      content:
        'EventSphere transformed how our club organizes and shares photos. The facial recognition is incredibly accurate!',
      avatar: '👨‍💼',
    },
    {
      name: 'Marcus Williams',
      role: 'Event Coordinator',
      content:
        'Best platform for managing large photo libraries. Our members love how easy it is to find their photos.',
      avatar: '👩‍💼',
    },
    {
      name: 'Jessica Lee',
      role: 'Society Director',
      content:
        'The watermarking system protects our photographers perfectly. Highly recommended for any event organization.',
      avatar: '👨‍🎤',
    },
  ];

  return (
    <Section variant="default" padding="xl" gap="lg">
      <Container size="2xl" padding>
        <Stack gap="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="info" size="lg" className="mx-auto mb-4">
              Community Love
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Loved by photography clubs & event teams
            </h2>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="w-full"
          >
            <Grid columns={3} gap="lg" responsive>
              {testimonials.map((testimonial, i) => (
                <motion.div key={i} variants={staggerItemVariants}>
                  <Card
                    variant="glass"
                    padding="lg"
                    className="h-full border border-glass-border hover:border-brand-500/30 transition-all"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-dark-200 mb-6 leading-relaxed italic">
                      &quot;{testimonial.content}&quot;
                    </p>

                    {/* Author */}
                    <Flex gap="md" align="center">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <p className="font-bold text-white text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-brand-400 text-xs font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </Flex>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </motion.div>
        </Stack>
      </Container>
    </Section>
  );
};

// ============================================================================
// SECTION 7: FINAL CTA
// ============================================================================

const CTASection: React.FC = () => {
  return (
    <Section variant="glass" padding="xl" gap="lg" className="border border-glass-border">
      <Container size="2xl" padding>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <Stack gap="lg" align="center">
            <h2 className="text-4xl sm:text-6xl font-black text-white">
              Ready to get started?
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl">
              Join photography clubs and event teams capturing and organizing memories with EventSphere.
            </p>

            <Flex gap="md" justify="center" wrap>
              <Link to="/events" className="no-underline">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={20} />}
                  className="font-bold tracking-wide"
                >
                  Start Exploring
                </Button>
              </Link>
              <Link to="/register" className="no-underline">
                <Button
                  variant="secondary"
                  size="lg"
                  className="font-bold tracking-wide"
                >
                  Create Account
                </Button>
              </Link>
            </Flex>
          </Stack>
        </motion.div>
      </Container>
    </Section>
  );
};

// ============================================================================
// MAIN LANDING PAGE
// ============================================================================

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Showcase */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* AI Capabilities */}
      <AICapabilitiesSection />

      {/* Event Discovery Preview */}
      <EventDiscoverySection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-glass-border py-12 text-center text-dark-400 text-sm tracking-wider">
        <Container size="2xl" padding>
          <p>
            EventSphere © 2026. Made with ❤️ by Jay Jain, for fun enthusiasts.
          </p>
        </Container>
      </footer>
    </div>
  );
};
