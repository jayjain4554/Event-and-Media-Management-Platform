import React, { useState } from 'react';
import { Heart, Calendar, MessageSquare, Download, FolderHeart, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { useFavorites, useToggleFavorite, FavoriteMedia } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Favorites: React.FC = () => {
  const { data: favorites = [], isLoading } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  // Fullscreen Slideshow states
  const [activeMedia, setActiveMedia] = useState<FavoriteMedia | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(-1);

  const handleToggleFav = async (mediaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await toggleFavoriteMutation.mutateAsync(mediaId);
      if (activeMedia && activeMedia._id === mediaId) {
        // If we untoggle the active slide in slideshow, we can close it or update it
        setActiveMedia(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openSlideshow = (item: FavoriteMedia, index: number) => {
    setActiveMedia(item);
    setActiveMediaIndex(index);
  };

  const handleNextSlide = () => {
    if (activeMediaIndex < favorites.length - 1) {
      const nextIndex = activeMediaIndex + 1;
      openSlideshow(favorites[nextIndex], nextIndex);
    }
  };

  const handlePrevSlide = () => {
    if (activeMediaIndex > 0) {
      const prevIndex = activeMediaIndex - 1;
      openSlideshow(favorites[prevIndex], prevIndex);
    }
  };

  const triggerDownload = (mediaItem: FavoriteMedia, e: React.MouseEvent) => {
    e.stopPropagation();
    const downloadUrl = `/api/media/${mediaItem._id}/download`;
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.setAttribute('download', `watermarked_${mediaItem.originalFilename}`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <FolderHeart className="text-brand-500 shrink-0" />
          <span>My Favorites</span>
        </h1>
        <p className="text-dark-300 text-sm mt-1">
          Your curated selection of favorited event memories and highlighted media.
        </p>
      </div>

      {isLoading ? (
        <SkeletonLoader count={6} />
      ) : favorites.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center h-[280px]">
          <FolderHeart size={44} className="text-dark-500 mb-4 animate-pulse" />
          <h4 className="text-white font-bold text-base">No Favorites Added Yet</h4>
          <p className="text-dark-300 text-xs max-w-sm mt-1">
            Tap the heart icon on any photo or video inside event galleries to save them to your custom board!
          </p>
          <Link
            to="/events"
            className="mt-5 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold tracking-wide text-xs uppercase flex items-center gap-1.5 shadow-glass-glow cursor-pointer"
          >
            <span>Explore Events</span>
            <ArrowRight size={13} />
          </Link>
        </GlassCard>
      ) : (
        /* Pinterest-inspired masonry/grid layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <GlassCard
                hoverEffect
                onClick={() => openSlideshow(item, index)}
                className="overflow-hidden !p-0 bg-glass-card border border-glass-border h-[320px] flex flex-col justify-between cursor-pointer"
              >
                {/* Media Image area */}
                <div className="h-[200px] w-full overflow-hidden relative group">
                  {item.fileType === 'image' ? (
                    <img
                      src={item.fileUrl}
                      alt={item.originalFilename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video src={item.fileUrl} className="h-full w-full object-cover" controls={false} />
                  )}

                  {/* Dynamic absolute action overlay */}
                  <div className="absolute inset-0 bg-dark-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => handleToggleFav(item._id, e)}
                        className="p-2 rounded-lg bg-red-950/80 backdrop-blur-sm text-red-400 hover:text-white border border-red-500/20"
                        title="Remove from Favorites"
                      >
                        <Heart size={14} className="fill-red-500 text-red-500" />
                      </button>

                      <button
                        onClick={(e) => triggerDownload(item, e)}
                        className="p-2 rounded-lg bg-dark-900/80 backdrop-blur-sm text-white hover:text-brand-400 border border-glass-border"
                        title="Download Watermarked"
                      >
                        <Download size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-white">
                      <span className="flex items-center gap-1">
                        <Heart size={13} className="fill-red-500 text-red-500" />
                        <span>{item.likesCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={13} />
                        <span>{item.commentsCount}</span>
                      </span>
                    </div>
                  </div>

                  {/* Absolute Top Category Tag */}
                  <span className="absolute top-4 left-4 bg-dark-900/80 text-brand-400 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase border border-glass-border backdrop-blur-md">
                    {item.eventId?.category}
                  </span>
                </div>

                {/* Info summary */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm truncate leading-snug">
                      {item.eventId?.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-dark-300 font-bold mt-1.5">
                      <Calendar size={12} className="text-brand-400 shrink-0" />
                      <span>
                        {new Date(item.eventId?.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-glass-border/30 text-[10px] text-dark-300 font-bold shrink-0 mt-2">
                    <span className="truncate max-w-[100px]">By {item.uploaderId?.name}</span>
                    <Link
                      to={`/events/${item.eventId?._id}`}
                      className="text-brand-500 hover:text-white font-extrabold flex items-center gap-0.5"
                    >
                      <span>View Gallery</span>
                      <ChevronRight size={10} />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dynamic Slide Fullscreen Zoom Slideshow */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
            <div className="relative w-full h-full flex flex-col md:flex-row">
              {/* Slideshow main media viewer */}
              <div className="flex-1 relative flex items-center justify-center p-4 min-h-0">
                {/* Close window */}
                <button
                  onClick={() => setActiveMedia(null)}
                  className="absolute top-6 left-6 z-10 p-2.5 rounded-full bg-dark-900/80 text-white hover:text-red-400 border border-glass-border"
                >
                  <X size={18} />
                </button>

                {/* Left/Right slide arrows */}
                {activeMediaIndex > 0 && (
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-6 p-3 rounded-full bg-dark-900/80 text-white border border-glass-border hover:border-brand-500/40 focus:outline-none"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                {activeMediaIndex < favorites.length - 1 && (
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-6 p-3 rounded-full bg-dark-900/80 text-white border border-glass-border hover:border-brand-500/40 focus:outline-none"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}

                {/* Content rendering */}
                {activeMedia.fileType === 'image' ? (
                  <img
                    src={activeMedia.fileUrl}
                    alt={activeMedia.originalFilename}
                    className="max-w-full max-h-[85vh] object-contain rounded-xl select-none"
                  />
                ) : (
                  <video
                    src={activeMedia.fileUrl}
                    className="max-w-full max-h-[85vh] object-contain rounded-xl"
                    controls
                    autoPlay
                  />
                )}
              </div>

              {/* Sidebar Info Sheet */}
              <div className="w-full md:w-[380px] bg-dark-900 border-t md:border-t-0 md:border-l border-glass-border flex flex-col h-[40vh] md:h-full shrink-0 select-none">
                <div className="p-5 border-b border-glass-border shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs uppercase flex items-center justify-center">
                      {activeMedia.uploaderId?.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {activeMedia.uploaderId?.name}
                      </h4>
                      <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider block mt-0.5">
                        Uploaded on{' '}
                        {new Date(activeMedia.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {activeMedia.tags && activeMedia.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {activeMedia.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-bold px-2 py-0.5 bg-dark-800 text-brand-400 rounded-md uppercase border border-glass-border"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Event Origin Details */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 pr-3 min-h-0">
                  <GlassCard className="p-4 bg-dark-850 border-glass-border space-y-3">
                    <span className="text-[9px] font-black text-brand-400 uppercase tracking-widest block">Event Source</span>
                    <h5 className="text-white font-extrabold text-sm">{activeMedia.eventId?.title}</h5>
                    <div className="flex items-center gap-1.5 text-xs text-dark-300 font-semibold">
                      <Calendar size={13} className="text-brand-400 shrink-0" />
                      <span>
                        {new Date(activeMedia.eventId?.date).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </GlassCard>
                </div>

                {/* Bottom Interaction controls */}
                <div className="p-5 border-t border-glass-border shrink-0 space-y-4 bg-dark-950">
                  <div className="flex items-center justify-between text-xs text-dark-300 font-bold">
                    <button
                      onClick={() => handleToggleFav(activeMedia._id)}
                      className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Heart size={15} className="fill-red-500 text-red-500" />
                      <span>Remove Favorite</span>
                    </button>
                    <button
                      onClick={(e) => triggerDownload(activeMedia, e)}
                      className="flex items-center gap-1.5 hover:text-brand-400 text-brand-500 transition-colors"
                    >
                      <Download size={15} />
                      <span>Watermark Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// End of file
