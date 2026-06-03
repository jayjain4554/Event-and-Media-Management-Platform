import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  ChevronRight,
  Layers,
  ArrowUpDown,
  Sparkles,
  AlertCircle,
  X,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import api from '../services/api';
import { getCaptionForMediaId } from '../constants/captions';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Flex,
  Stack,
  Center,
  Button,
  Badge,
} from '@/design';
import {
  staggerContainerVariants,
  staggerItemVariants,
} from '@/design';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  coverImage: string;
  visibility: 'public' | 'private';
  mediaCount: number;
}

interface HighlightMedia {
  _id: string;
  fileUrl: string;
  eventTitle?: string;
  albumTitle?: string;
  eventId?: string;
  caption?: string;
}

export const ExploreEvents: React.FC = () => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [highlightMedia, setHighlightMedia] = useState<HighlightMedia[]>([]);

  // Fetch events using TanStack Query
  const { data, isLoading, error, isPlaceholderData } = useEvents({
    page,
    limit: 12,
    category: category === 'All' ? undefined : category,
    search: activeSearch || undefined,
    sort,
  });

  const events: EventItem[] = data?.data?.events || [];
  const totalPages = data?.pages || 1;

  const categories = ['All', 'Social', 'Sports', 'Academic', 'Arts', 'Ceremony'];
  const colorMap: { [key: string]: string } = {
    'Social': 'brand',
    'Sports': 'danger',
    'Academic': 'info',
    'Arts': 'warning',
    'Ceremony': 'success',
  }; 

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const response = await api.get('/media/highlights');
        const highlights: HighlightMedia[] = (response.data.data.highlights || []).map(
          (item: HighlightMedia) => ({
            ...item,
            caption: getCaptionForMediaId(item._id),
          })
        );
        setHighlightMedia(highlights);
      } catch (err) {
        setHighlightMedia([]);
      }
    };

    loadHighlights();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchVal);
  };

  // Masonry layout column heights for varied card sizes
  const cardHeights = useMemo(() => {
    return events.map((_, i) => {
      const heights = [400, 500, 380, 420, 480, 390];
      return heights[i % heights.length];
    });
  }, [events]);

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 overflow-x-hidden">
      <Container size="2xl" padding className="py-8">
        <Stack gap="xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-5xl font-black text-white tracking-tight">
                Discover Events
              </h1>
              <p className="text-dark-300 text-lg mt-2">
                Browse thousands of memorable moments from your community
              </p>
            </div>
          </motion.div>

          {/* Featured Highlights / Stories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <Flex align="center" gap="md" className="w-full">
              <Sparkles size={16} className="text-brand-400 shrink-0" />
              <span className="text-xs font-bold text-dark-300 uppercase tracking-widest">
                Featured Highlights
              </span>
            </Flex>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              <AnimatePresence>
                {(highlightMedia.length > 0 ? highlightMedia : []).map((item) => (
                  <motion.button
                    key={item._id}
                    type="button"
                    onClick={() => item.eventId && navigate(`/events/${item.eventId}`)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none"
                  >
                    <div className="h-20 w-20 rounded-full p-1 bg-gradient-to-br from-brand-500 via-indigo-500 to-cyan-400 shadow-lg">
                      <div className="h-full w-full rounded-full border-2 border-dark-900 overflow-hidden bg-dark-800">
                        <img
                          src={item.fileUrl}
                          alt={item.albumTitle || item.eventTitle || 'Highlight photo'}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white tracking-tight w-20 truncate text-center group-hover:text-brand-400 transition-colors">
                      {item.caption || item.albumTitle || item.eventTitle || 'Photo'}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events, locations, categories..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-dark-800 border border-glass-border text-white text-base pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-medium placeholder:text-dark-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Active Search Tag */}
            <AnimatePresence>
              {activeSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-dark-300">Searching for:</span>
                  <motion.div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-full">
                    <span className="text-xs font-semibold text-brand-400">"{activeSearch}"</span>
                    <button
                      onClick={() => {
                        setActiveSearch('');
                        setSearchVal('');
                        setPage(1);
                      }}
                      className="hover:text-brand-300 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <Flex gap="md" justify="between" align="center" wrap>
              {/* Category Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-1">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`
                      px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 border backdrop-blur-sm
                      ${
                        category === cat
                          ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-lg shadow-brand-500/20'
                          : 'bg-dark-800/50 text-dark-300 border-glass-border hover:border-brand-500/30 hover:text-white'
                      }
                    `}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 shrink-0"
              >
                <ArrowUpDown size={14} className="text-dark-400" />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="bg-dark-800 text-white text-xs px-3 py-2 rounded-lg border border-glass-border focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-semibold outline-none cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">A-Z</option>
                </select>
              </motion.div>
            </Flex>
          </motion.div>

          {/* Error State */}
          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20"
            >
              <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-rose-500/30">
                <AlertCircle size={48} className="text-rose-500 mb-4 animate-pulse" />
                <h3 className="text-white font-bold text-lg">Error Loading Events</h3>
                <p className="text-dark-300 text-sm max-w-sm mt-2">
                  {error instanceof Error ? error.message : 'Something went wrong while retrieving events.'}
                </p>
              </GlassCard>
            </motion.div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[400px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-dark-800 rounded-2xl animate-pulse border border-glass-border" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20"
            >
              <Center>
                <GlassCard className="flex flex-col items-center justify-center p-12 text-center max-w-md">
                  <Layers size={48} className="text-dark-500 mb-4" />
                  <h3 className="text-white font-bold text-lg">No Events Found</h3>
                  <p className="text-dark-300 text-sm mt-2">
                    Try adjusting your search, clearing filters, or checking back later.
                  </p>
                </GlassCard>
              </Center>
            </motion.div>
          ) : (
            <>
              {/* Masonry Grid - Pinterest-style */}
              <motion.div
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
              >
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    variants={staggerItemVariants}
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="group cursor-pointer"
                    style={{ height: `${cardHeights[index]}px` }}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-dark-800 border border-glass-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-brand-500/50">
                      {/* Cover Image */}
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Dark Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                      {/* Floating Top Badges */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
                      >
                        {/* Category Badge */}
                        <Badge
                          variant={colorMap[event.category] as any || 'secondary'}
                          size="sm"
                          className="backdrop-blur-md bg-dark-900/70 border border-glass-border"
                        >
                          {event.category}
                        </Badge>

                        {/* Visibility Badge */}
                        {event.visibility === 'private' && (
                          <Badge
                            variant="danger"
                            size="sm"
                            className="backdrop-blur-md bg-dark-900/70 border border-glass-border"
                          >
                            Private
                          </Badge>
                        )}
                      </motion.div>

                      {/* Bottom Content - Revealed on Hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent flex flex-col justify-end p-5 z-20"
                      >
                        <Stack gap="md">
                          {/* Title */}
                          <div>
                            <h3 className="text-white text-lg font-bold line-clamp-2 leading-tight mb-1">
                              {event.title}
                            </h3>
                            <p className="text-dark-200 text-xs line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          {/* Metadata */}
                          <Flex gap="md" justify="between" align="center">
                            <Flex gap="sm" align="center" className="text-xs text-dark-300">
                              <Calendar size={14} className="text-brand-400 shrink-0" />
                              <span className="font-semibold">
                                {new Date(event.date).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </Flex>

                            <Flex gap="sm" align="center" className="text-xs text-brand-400 font-semibold">
                              <ImageIcon size={14} />
                              <span>{event.mediaCount}</span>
                            </Flex>
                          </Flex>

                          {/* CTA Button */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="glass"
                              size="sm"
                              rightIcon={<ChevronRight size={16} />}
                              fullWidth
                              className="text-xs font-bold"
                            >
                              View Gallery
                            </Button>
                          </motion.div>
                        </Stack>
                      </motion.div>

                      {/* Media Count Badge (Always Visible) */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <div className="bg-dark-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-glass-border flex items-center gap-1.5 text-xs font-bold text-white shadow-md">
                          <Zap size={12} className="text-yellow-400" />
                          <span>{event.mediaCount}</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center items-center gap-4 pt-8 border-t border-glass-border"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 1 || isPlaceholderData}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </Button>

                  <div className="flex items-center gap-2 text-sm">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg font-bold transition-all ${
                            page === pageNum
                              ? 'bg-brand-500 text-white shadow-lg'
                              : 'bg-dark-800 text-dark-300 border border-glass-border hover:border-brand-500/50'
                          }`}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages || isPlaceholderData}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next →
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </Stack>
      </Container>
    </div>
  );
};
