import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  QrCode,
  Download,
  Heart,
  MessageSquare,
  X,
  Send,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Folder,
  FolderPlus,
  Trash2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import { getCaptionForMediaId } from '../constants/captions';
import { joinEventRoom, leaveEventRoom, getSocket } from '../services/socket';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventDetails, useDeleteEvent } from '../hooks/useEvents';
import { useAlbums, useCreateAlbum } from '../hooks/useAlbums';
import { AlbumCard } from '../components/events/AlbumCard';
import { AlbumCreateModal } from '../components/events/AlbumCreateModal';
import { ToastMessage } from '../components/ui/ToastMessage';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

interface TaggedUserItem {
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  taggedBy: {
    _id: string;
    name: string;
    email: string;
  };
  taggedAt: string;
}

interface MediaItem {
  _id: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  visibility: 'public' | 'private';
  mimeType: string;
  originalFilename: string;
  likesCount: number;
  commentsCount: number;
  tags: { label: string; confidence: number }[];
  taggedUsers: TaggedUserItem[];
  uploaderId: { _id: string; name: string; email: string };
  createdAt: string;
  caption?: string;
}



export const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading: eventLoading, error: eventError } = useEventDetails(eventId || '');
  const deleteEventMutation = useDeleteEvent();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Favorites logic
  const { data: favorites = [] } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const handleToggleFav = async (mediaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await toggleFavoriteMutation.mutateAsync(mediaId);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setToast({ message: 'Failed to update favorites. Please try again.', type: 'error' });
    }
  };

  const { user } = useAuth();
  const canManageAlbums = user && ['Admin', 'Photographer'].includes(user.role);

  // Albums states
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);

  // Albums query & mutations
  const { data: albums = [], isLoading: albumsLoading } = useAlbums(eventId || '');
  const createAlbumMutation = useCreateAlbum(eventId || '');

  // Navigation cursors
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Dialog Modals
  const [qrOpen, setQrOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(-1);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [tagSearchLoading, setTagSearchLoading] = useState(false);
  const [taggingInProgress, setTaggingInProgress] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!activeMedia || userSearch.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }

    const query = userSearch.trim();
    const timer = window.setTimeout(async () => {
      setTagSearchLoading(true);
      try {
        const response = await api.get('/users/search', {
          params: { q: query },
        });
        setUserSearchResults(response.data.data.users || []);
      } catch (error) {
        console.error('User search failed:', error);
        setUserSearchResults([]);
      } finally {
        setTagSearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [userSearch, activeMedia]);

  // QR Code URL helper
  const shareUrl = window.location.href;

  const fetchMedia = async (cursorVal?: string, albumIdFilter?: string | null) => {
    try {
      const params: any = { limit: 12 };
      if (cursorVal) params.cursor = cursorVal;

      const activeAlbumId = albumIdFilter !== undefined ? albumIdFilter : selectedAlbumId;
      if (activeAlbumId) {
        params.albumId = activeAlbumId;
      }

      const res = await api.get(`/media/event/${eventId}`, { params });
      const fetchedMedia: MediaItem[] = (res.data.data.media || []).map((item: MediaItem) => ({
        ...item,
        caption: getCaptionForMediaId(item._id),
      }));
      if (cursorVal) {
        setMedia((prev) => [...prev, ...fetchedMedia]);
      } else {
        setMedia(fetchedMedia);
      }
      setNextCursor(res.data.nextCursor || null);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      fetchMedia(undefined, selectedAlbumId);
    }
  }, [eventId, selectedAlbumId]);

  useEffect(() => {
    if (eventId) {
      joinEventRoom(eventId);

      // Sockets triggers listeners for real-time interaction updates
      const socket = getSocket();
      if (socket) {
        socket.on('media_like', (data: { mediaId: string; likesCount: number }) => {
          setMedia((prev) =>
            prev.map((item) =>
              item._id === data.mediaId ? { ...item, likesCount: data.likesCount } : item
            )
          );
          if (activeMedia && activeMedia._id === data.mediaId) {
            setActiveMedia((prev) => (prev ? { ...prev, likesCount: data.likesCount } : null));
          }
        });

        socket.on('media_unlike', (data: { mediaId: string; likesCount: number }) => {
          setMedia((prev) =>
            prev.map((item) =>
              item._id === data.mediaId ? { ...item, likesCount: data.likesCount } : item
            )
          );
          if (activeMedia && activeMedia._id === data.mediaId) {
            setActiveMedia((prev) => (prev ? { ...prev, likesCount: data.likesCount } : null));
          }
        });

        socket.on(
          'media_comment',
          (data: { mediaId: string; commentsCount: number; comment: any }) => {
            setMedia((prev) =>
              prev.map((item) =>
                item._id === data.mediaId ? { ...item, commentsCount: data.commentsCount } : item
              )
            );
            if (activeMedia && activeMedia._id === data.mediaId) {
              setComments((prev) => [...prev, data.comment]);
              setActiveMedia((prev) =>
                prev ? { ...prev, commentsCount: data.commentsCount } : null
              );
            }
          }
        );
      }
    }

    return () => {
      if (eventId) {
        leaveEventRoom(eventId);
      }
    };
  }, [eventId, activeMedia]);

  const loadMoreMedia = () => {
    if (nextCursor) {
      fetchMedia(nextCursor, selectedAlbumId);
    }
  };

  const handleLike = async (mediaId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const res = await api.post(`/media/${mediaId}/like`);
      const likesCount = res.data.likesCount;

      setMedia((prev) =>
        prev.map((item) => (item._id === mediaId ? { ...item, likesCount } : item))
      );

      setActiveMedia((prev) => (prev && prev._id === mediaId ? { ...prev, likesCount } : prev));
    } catch (err) {
      console.error('Error toggling like:', err);
      setToast({ message: 'Unable to update like count. Try again.', type: 'error' });
    }
  };

  const handleTagUser = async (userId: string) => {
    if (!activeMedia) return;
    setTaggingInProgress(true);

    try {
      const res = await api.post(`/media/${activeMedia._id}/tag`, { userId });
      const updatedMedia = res.data.data.media;

      setActiveMedia(updatedMedia);
      setMedia((prev) => prev.map((item) => (item._id === updatedMedia._id ? updatedMedia : item)));
      setToast({ message: 'User tagged successfully.', type: 'success' });
      setUserSearch('');
      setUserSearchResults([]);
    } catch (err: any) {
      console.error('Error tagging user:', err);
      const errMsg = err.response?.data?.message || 'Unable to tag user. Try again.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setTaggingInProgress(false);
    }
  };

  const handleRemoveTag = async (taggedUserId: string) => {
    if (!activeMedia) return;
    setTaggingInProgress(true);

    try {
      const res = await api.delete(`/media/${activeMedia._id}/tag/${taggedUserId}`);
      const updatedMedia = res.data.data.media;
      setActiveMedia(updatedMedia);
      setMedia((prev) => prev.map((item) => (item._id === updatedMedia._id ? updatedMedia : item)));
      setToast({ message: 'Tag removed successfully.', type: 'success' });
    } catch (err: any) {
      console.error('Error removing tag:', err);
      const errMsg = err.response?.data?.message || 'Unable to remove tag. Try again.';
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setTaggingInProgress(false);
    }
  };

  const canRemoveTag = (tag: TaggedUserItem) => {
    if (!user) return false;
    return (
      user.id === tag.userId._id ||
      user.id === tag.taggedBy._id ||
      user.id === activeMedia?.uploaderId._id ||
      user.role === 'Admin'
    );
  };

  const openSlideshow = async (item: MediaItem, index: number) => {
    setActiveMedia(item);
    setActiveMediaIndex(index);
    setComments([]);
    setCommentsLoading(true);

    try {
      const res = await api.get(`/media/${item._id}/comment`);
      setComments(res.data.data.comments);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Could not load comments for this media item.', type: 'error' });
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleNextSlide = () => {
    if (activeMediaIndex < media.length - 1) {
      const nextIndex = activeMediaIndex + 1;
      openSlideshow(media[nextIndex], nextIndex);
    }
  };

  const handlePrevSlide = () => {
    if (activeMediaIndex > 0) {
      const prevIndex = activeMediaIndex - 1;
      openSlideshow(media[prevIndex], prevIndex);
    }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeMedia) return;

    try {
      const res = await api.post(`/media/${activeMedia._id}/comment`, {
        text: newComment.trim(),
      });
      const comment = res.data.data.comment;

      setComments((prev) => [...prev, comment]);
      setNewComment('');
      setMedia((prev) =>
        prev.map((item) =>
          item._id === activeMedia._id
            ? { ...item, commentsCount: item.commentsCount + 1 }
            : item
        )
      );
      setActiveMedia((prev) =>
        prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev
      );
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Could not submit comment. Please retry.';
      setToast({ message: errMsg, type: 'error' });
    }
  };

  const handleSelectAlbum = (albumId: string | null) => {
    setSelectedAlbumId(albumId);
  };

  const triggerDownload = (mediaItem: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const downloadUrl = `/api/media/${mediaItem._id}/download`;
    // Create quick window anchor to stream file
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.setAttribute('download', `watermarked_${mediaItem.originalFilename}`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  if (eventLoading || (loading && !event)) {
    return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;
  }

  if (eventError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
        <AlertCircle size={48} className="text-rose-500 mb-4 animate-pulse" />
        <h3 className="text-white font-bold text-lg">Error Loading Event</h3>
        <p className="text-dark-300 text-sm max-w-sm mt-1">
          {eventError instanceof Error ? eventError.message : 'Something went wrong.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Event Details Banner */}
      {event && (
        <GlassCard className="relative overflow-hidden !p-0 bg-glass-card rounded-2xl flex flex-col md:flex-row min-h-[300px] border border-glass-border">
          {/* Cover image area */}
          <div className="md:w-1/3 h-[250px] md:h-auto relative">
            <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-dark-900/10" />
          </div>

          {/* Texts details content */}
          <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 uppercase tracking-widest inline-block">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {event.title}
              </h1>
              <p className="text-dark-300 text-sm max-w-2xl leading-relaxed">{event.description}</p>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-glass-border">
              <div className="flex items-center gap-2 text-xs font-bold text-dark-300">
                <Calendar size={15} className="text-brand-400" />
                <span>
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-dark-300">
                <MapPin size={15} className="text-brand-400" />
                <span>{event.location}</span>
              </div>

              {/* Utility Tools */}
              <div className="flex items-center gap-3 ml-auto">
                {(user?.role === 'Admin' || user?.role === 'Photographer') && (
                  <button
                    onClick={async () => {
                      if (!event?._id) return;
                      const confirmed = window.confirm('Delete this event and all related media permanently?');
                      if (!confirmed) return;

                      try {
                        await deleteEventMutation.mutateAsync(event._id);
                        navigate('/events');
                      } catch (err) {
                        console.error('Event deletion failed:', err);
                        setToast({ message: 'Could not delete event. Please try again.', type: 'error' });
                      }
                    }}
                    className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 transition-all"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setQrOpen(true)}
                  className="p-2.5 rounded-xl border border-glass-border hover:border-brand-500/30 text-dark-300 hover:text-white transition-all bg-dark-950 flex items-center justify-center"
                  title="Share album QR"
                >
                  <QrCode size={16} />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Albums Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-dark-300 uppercase tracking-widest flex items-center gap-2">
            <Folder size={14} className="text-brand-400" />
            Albums
          </h3>
          {canManageAlbums && (
            <button
              onClick={() => setAlbumModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-glass-border text-dark-300 hover:text-white hover:border-brand-500/30 text-[10px] font-bold uppercase tracking-wider transition-all bg-dark-800/60"
            >
              <FolderPlus size={12} />
              New Album
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleSelectAlbum(null)}
            className={`shrink-0 flex flex-col items-center justify-center w-[120px] h-[90px] rounded-xl border transition-all duration-200 ${
              selectedAlbumId === null
                ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                : 'border-glass-border bg-glass-card hover:border-brand-500/30'
            }`}
          >
            <ImageIcon size={20} className={selectedAlbumId === null ? 'text-brand-400' : 'text-dark-400'} />
            <span className={`text-[10px] font-bold mt-1.5 ${
              selectedAlbumId === null ? 'text-brand-400' : 'text-dark-300'
            }`}>
              All Media
            </span>
          </button>

          {albumsLoading && (
            <div className="shrink-0 flex items-center justify-center w-[120px] h-[90px] rounded-xl border border-glass-border bg-glass-card">
              <Loader2 size={16} className="animate-spin text-dark-400" />
            </div>
          )}

          {albums.map((album: any) => (
            <AlbumCard
              key={album._id}
              album={album}
              selected={selectedAlbumId === album._id}
              onSelect={handleSelectAlbum}
            />
          ))}
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-dark-300 uppercase tracking-widest">
          {selectedAlbumId
            ? `${albums.find((a: any) => a._id === selectedAlbumId)?.title || 'Album'} (${media.length} files)`
            : `Event gallery (${media.length} files)`
          }
        </h3>

        {media.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center p-12 text-center h-[280px]">
            <ImageIcon size={44} className="text-dark-500 mb-4 animate-pulse" />
            <h4 className="text-white font-bold text-base">Gallery is empty</h4>
            <p className="text-dark-300 text-xs max-w-xs mt-1">
              No photos or videos have been uploaded to this event yet.
            </p>
          </GlassCard>
        ) : (
          /* High-Fidelity pinterest style grid columns */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {media.map((item, index) => {
              const isFavorited = favorites.some((fav: any) => fav._id === item._id);
              return (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  key={item._id}
                  onClick={() => openSlideshow(item, index)}
                  className="break-inside-avoid relative rounded-xl overflow-hidden group cursor-pointer border border-glass-border bg-glass-card shadow-md transition-all duration-300"
                >
                  {/* Favorite badge visible when not hovered */}
                  {isFavorited && (
                    <div className="absolute top-3 left-3 z-10 p-1.5 rounded-lg bg-dark-950/80 backdrop-blur-sm border border-red-500/20 text-red-500 shadow-md">
                      <Heart size={12} className="fill-red-500 text-red-500" />
                    </div>
                  )}

                  {/* Media representation */}
                  {item.fileType === 'image' ? (
                    <img
                      src={item.fileUrl}
                      alt={item.originalFilename}
                      className="w-full object-cover max-h-[450px]"
                      loading="lazy"
                    />
                  ) : (
                    <video src={item.fileUrl} className="w-full object-cover" controls={false} />
                  )}

                  {/* Glassy hover overlay */}
                  <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    {/* Top quick actions */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => handleToggleFav(item._id, e)}
                        className="p-2 rounded-lg bg-dark-900/80 backdrop-blur-sm text-white hover:text-red-400 border border-glass-border transition-colors"
                        title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Heart size={14} className={isFavorited ? "fill-red-500 text-red-500" : "text-white"} />
                      </button>
                      <button
                        onClick={(e) => triggerDownload(item, e)}
                        className="p-2 rounded-lg bg-dark-900/80 backdrop-blur-sm text-white hover:text-brand-400 border border-glass-border"
                        title="Download with watermark"
                      >
                        <Download size={14} />
                      </button>
                    </div>

                  {/* Bottom interactions counts */}
                  <div className="flex items-center gap-4 text-xs font-bold text-white">
                    <button
                      onClick={(e) => handleLike(item._id, e)}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Heart size={14} className="fill-red-500 text-red-500" />
                      <span>{item.likesCount}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      <span>{item.commentsCount}</span>
                    </div>
                  </div>

                  {item.taggedUsers && item.taggedUsers.length > 0 && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-black/60 text-[10px] uppercase tracking-widest text-white border border-glass-border">
                      {item.taggedUsers.length} tagged
                    </div>
                  )}
                </div>

                {item.caption && (
                  <div className="px-4 py-3 text-xs text-dark-300 bg-dark-950 border-t border-glass-border">
                    {item.caption}
                  </div>
                )}
              </motion.div>
            );
            })}
          </div>
        )}

        {/* Load More trigger */}
        {nextCursor && (
          <div className="flex justify-center pt-8 select-none">
            <button
              onClick={loadMoreMedia}
              className="px-6 py-2.5 rounded-xl border border-glass-border text-dark-300 hover:text-white font-bold text-xs uppercase tracking-wider bg-dark-800 transition-all hover:border-brand-500/20"
            >
              Load more memories
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Slide Fullscreen Zoom Slideshow */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
            {/* Main overlay structure */}
            <div className="relative w-full h-full flex flex-col md:flex-row">
              {/* Left slideshow main media viewer */}
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
                {activeMediaIndex < media.length - 1 && (
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

              {/* Right Sidebar Interactions (Comments feeds, tags) */}
              <div className="w-full md:w-[380px] bg-dark-900 border-t md:border-t-0 md:border-l border-glass-border flex flex-col h-[40vh] md:h-full shrink-0 select-none">
                {/* Header details */}
                <div className="p-5 border-b border-glass-border shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs uppercase flex items-center justify-center">
                      {activeMedia.uploaderId?.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {activeMedia.uploaderId?.name}
                        </h4>
                        <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${
                          activeMedia.visibility === 'private'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                            : 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                        }`}>
                          {activeMedia.visibility === 'private' ? 'Private' : 'Public'}
                        </span>
                      </div>
                      <span className="text-[10px] text-dark-400 font-semibold uppercase tracking-wider block mt-0.5">
                        Uploaded on{' '}
                        {new Date(activeMedia.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>                      {activeMedia.caption && (
                        <div className="text-xs text-dark-300 mt-3 leading-snug">
                          {activeMedia.caption}
                        </div>
                      )}                    </div>
                  </div>

                  {/* Smart tagging pill indicators */}
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

                  <div className="pt-4 border-t border-glass-border">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-dark-400">
                        Tagged users
                      </span>
                      <span className="text-[10px] text-dark-500">
                        {activeMedia.taggedUsers?.length ?? 0}
                      </span>
                    </div>

                    {activeMedia.taggedUsers?.length ? (
                      <div className="space-y-2">
                        {activeMedia.taggedUsers.map((tag) => (
                          <div
                            key={tag.userId._id}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-glass-border bg-dark-950 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-bold text-white">{tag.userId.name}</p>
                              <p className="text-[10px] text-dark-500">
                                Tagged by {tag.taggedBy.name}
                              </p>
                            </div>
                            {canRemoveTag(tag) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveTag(tag.userId._id);
                                }}
                                className="text-[10px] px-2 py-1 rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/15"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-dark-500 mt-1">
                        No users have been tagged in this media yet.
                      </p>
                    )}

                    <div className="mt-4">
                      <label className="block text-[10px] uppercase tracking-widest text-dark-400 mb-2">
                        Tag a user
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name or email"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          disabled={taggingInProgress}
                          className="w-full rounded-2xl border border-glass-border bg-dark-900 px-3 py-2 text-white text-sm outline-none focus:border-brand-500/50"
                        />
                        {tagSearchLoading && (
                          <Loader2 className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-brand-500" />
                        )}
                      </div>

                      {userSearchResults.length > 0 && (
                        <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl border border-glass-border bg-dark-950 shadow-xl scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-dark-900">
                          {userSearchResults.map((result) => (
                            <button
                              type="button"
                              key={result._id}
                              onClick={() => handleTagUser(result._id)}
                              className="w-full text-left px-3 py-3 border-b border-glass-border last:border-b-0 hover:bg-dark-900"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-white">{result.name}</p>
                                  <p className="text-[10px] text-dark-500">{result.email}</p>
                                </div>
                                <span className="text-[10px] text-dark-400">Tag</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scrollable Comments feed */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 pr-3 min-h-0">
                  {commentsLoading ? (
                    <div className="flex justify-center pt-8"><Loader2 className="animate-spin text-brand-500" /></div>
                  ) : comments.length === 0 ? (
                    <div className="text-center pt-12">
                      <MessageSquare className="mx-auto h-8 w-8 text-dark-500 mb-2" />
                      <h5 className="text-xs font-bold text-dark-300">No comments yet</h5>
                      <p className="text-[10px] text-dark-500 mt-0.5">Start the conversation below.</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3">
                        <div className="h-7 w-7 rounded-full bg-glass-light border border-glass-border text-[10px] font-bold text-brand-400 uppercase flex items-center justify-center shrink-0">
                          {comment.userId?.name.charAt(0)}
                        </div>
                        <div className="bg-dark-850 p-3 rounded-xl border border-glass-border flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-extrabold text-white">
                              {comment.userId?.name}
                            </span>
                            <span className="text-[9px] text-dark-500 font-semibold">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-dark-200 leading-relaxed font-medium">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom buttons action sheet & comment submission form */}
                <div className="p-4 border-t border-glass-border shrink-0 space-y-3 bg-dark-950">
                  {/* Likes, Favorites and download buttons sheet */}
                  <div className="flex items-center justify-between text-xs text-dark-300 font-bold border-b border-glass-border/30 pb-3">
                    <button
                      onClick={() => handleLike(activeMedia._id)}
                      className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                    >
                      <Heart size={15} className="fill-red-500 text-red-500" />
                      <span>{activeMedia.likesCount} likes</span>
                    </button>

                    {(() => {
                      const isActiveMediaFavorited = favorites.some((fav: any) => fav._id === activeMedia._id);
                      return (
                        <button
                          onClick={(e) => handleToggleFav(activeMedia._id, e)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            isActiveMediaFavorited ? 'text-red-500 hover:text-red-400' : 'hover:text-red-400'
                          }`}
                          title={isActiveMediaFavorited ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart size={15} className={isActiveMediaFavorited ? "fill-red-500 text-red-500" : ""} />
                          <span>{isActiveMediaFavorited ? 'Favorited' : 'Favorite'}</span>
                        </button>
                      );
                    })()}

                    <button
                      onClick={(e) => triggerDownload(activeMedia, e)}
                      className="flex items-center gap-1.5 hover:text-brand-400 text-brand-500 transition-colors"
                    >
                      <Download size={15} />
                      <span>Watermark Download</span>
                    </button>
                  </div>

                  {/* Send Input */}
                  <form onSubmit={postComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-dark-900 border border-glass-border text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-brand-500/50"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Album Share QR Code Dialog Modal */}
      <AnimatePresence>
        {qrOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xs glass-panel bg-glass-card shadow-glass-card border border-glass-border p-6 rounded-2xl flex flex-col items-center text-center space-y-4"
            >
              <div className="w-full flex justify-end shrink-0">
                <button
                  onClick={() => setQrOpen(false)}
                  className="text-dark-300 hover:text-white focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>
              <h3 className="text-white font-extrabold text-lg">Scan to Share Album</h3>
              <p className="text-dark-300 text-xs">
                Scan this QR code using a mobile camera to instantly view and share this gallery.
              </p>

              {/* QR Render area */}
              <div className="p-3 bg-white rounded-xl shadow-md border border-glass-border inline-block">
                <QRCodeSVG value={shareUrl} size={160} />
              </div>

              <span className="text-[10px] text-brand-400 font-bold truncate max-w-full">
                {shareUrl}
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

          <AlbumCreateModal
            open={albumModalOpen}
            loading={createAlbumMutation.status === 'pending'}
            onClose={() => setAlbumModalOpen(false)}
        onSubmit={async (payload) => {
              if (!eventId) {
                setToast({ message: 'Missing event ID, cannot create album.', type: 'error' });
                return;
              }
          try {
            const album = await createAlbumMutation.mutateAsync(payload);
            if (album?._id) {
              setSelectedAlbumId(album._id);
              setToast({ message: `Album "${album.title}" created.`, type: 'success' });
            }
            setAlbumModalOpen(false);
          } catch (err: any) {
            const errMsg = err.response?.data?.message || 'Unable to create album.';
            setToast({ message: errMsg, type: 'error' });
            console.error('Error creating album:', err);
          }
        }}
      />
      <ToastMessage open={!!toast} message={toast?.message || ''} type={toast?.type || 'info'} onClose={() => setToast(null)} />
    </div>
  );
};
