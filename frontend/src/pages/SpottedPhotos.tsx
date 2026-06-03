import React from 'react';
import { Sparkles, Calendar, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useSpottedPhotos } from '../hooks/useSpottedPhotos';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';



export const SpottedPhotos: React.FC = () => {
  const { user } = useAuth();
  const { data: spotted = [], isLoading: loading } = useSpottedPhotos();

  // Favorites logic
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleToggleFav = async (mediaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await toggleFavoriteMutation.mutateAsync(mediaId);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (!user?.referenceSelfieUrl) {
    return (
      <div className="max-w-md mx-auto space-y-8 py-16 text-center select-none">
        <GlassCard className="flex flex-col items-center p-8 space-y-5 bg-glass-card border-glass-border">
          <div className="h-16 w-16 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 animate-pulse border border-brand-500/20">
            <Sparkles size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">Enable Face Discovery</h2>
            <p className="text-dark-300 text-xs leading-relaxed">
              Register your profile reference selfie first to let our AI face matching engine index every photo you appear in across all events.
            </p>
          </div>
          <Link
            to="/profile"
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-glass-glow cursor-pointer"
          >
            <span>Setup Reference Selfie</span>
            <ArrowRight size={15} />
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="text-brand-500 animate-pulse shrink-0" />
          <span>Spotted in Photos</span>
        </h1>
        <p className="text-dark-300 text-sm mt-1">
          Personalized discovery feed displaying matching photo results identified via facial recognition.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={6} />
      ) : spotted.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center p-12 text-center h-[280px]">
          <Sparkles size={40} className="text-dark-500 mb-4 animate-spin" />
          <h4 className="text-white font-bold text-base">No Matches Found Yet</h4>
          <p className="text-dark-300 text-xs max-w-sm mt-1">
            Our facial engine is active. As photographers upload new event photos, you'll instantly see your matches populated here!
          </p>
        </GlassCard>
      ) : (
        /* Spotted Media Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {spotted.map((item, index) => {
            // Find current user's matching score percentage
            const userFace = item.detectedFaces.find((face) => face.matchedUserId === user.id);
            const score = userFace ? Math.round(userFace.faceMatchScore) : 95;
            const isFavorited = favorites.some((fav: any) => fav._id === item._id);

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GlassCard
                  hoverEffect
                  className="overflow-hidden !p-0 bg-glass-card border border-glass-border h-[320px] flex flex-col justify-between"
                >
                  {/* Photo content viewer */}
                  <div className="h-[200px] w-full overflow-hidden relative">
                    <img
                      src={item.fileUrl}
                      alt={item.originalFilename}
                      className="h-full w-full object-cover"
                    />

                    {/* Glowing Match percentage tag */}
                    <span className="absolute top-4 left-4 bg-teal-950/80 text-teal-400 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-teal-500/30 backdrop-blur-md shadow-md animate-pulse">
                      {score}% Match
                    </span>

                    {/* Favorite badge visible when not hovered */}
                    {isFavorited && (
                      <div className="absolute top-4 right-4 bg-dark-950/80 backdrop-blur-sm border border-red-500/20 text-red-500 p-1.5 rounded-lg shadow-md">
                        <Heart size={12} className="fill-red-500 text-red-500" />
                      </div>
                    )}
                  </div>

                  {/* Info details */}
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

                    {/* Interaction counts bottom metrics */}
                    <div className="flex items-center justify-between pt-3 border-t border-glass-border/30 text-[10px] text-dark-300 font-bold shrink-0 mt-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 hover:text-red-400">
                          <Heart size={12} className="fill-red-500 text-red-500" />
                          <span>{item.likesCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          <span>{item.commentsCount}</span>
                        </span>
                        <button
                          onClick={(e) => handleToggleFav(item._id, e)}
                          className={`flex items-center gap-1 transition-colors ${
                            isFavorited ? 'text-red-500 hover:text-red-400' : 'text-dark-400 hover:text-white'
                          }`}
                          title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart size={12} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                        </button>
                      </div>
                      <Link
                        to={`/events/${item.eventId?._id}`}
                        className="text-brand-500 hover:text-white font-extrabold"
                      >
                        Go to Event
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};


