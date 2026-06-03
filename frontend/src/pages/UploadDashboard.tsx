import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader2, X, Edit2 } from 'lucide-react';
import api from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { ToastMessage } from '../components/ui/ToastMessage';
import { useAuth } from '../context/AuthContext';
import { useUploadMedia } from '../hooks/useUploadMedia';
import { useAlbums, useCreateAlbum } from '../hooks/useAlbums';
import { useCreateEvent, useUpdateEvent } from '../hooks/useEvents';
import { AlbumCreateModal } from '../components/events/AlbumCreateModal';
import { EventCreateEditModal } from '../components/events/EventCreateEditModal';

interface EventItem {
  _id: string;
  title: string;
  category: string;
}

interface UploadQueueItem {
  file: File;
  previewUrl: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  message?: string;
}

export const UploadDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit'>('create');
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [report, setReport] = useState<{ success: number; skipped: number; errors: string[] } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const uploadMediaMutation = useUploadMedia();
  const createAlbumMutation = useCreateAlbum(selectedEventId);
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const { data: albums = [], isLoading: albumsLoading } = useAlbums(selectedEventId);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check role permissions: restricted to Admin and Photographer
    if (user && !['Admin', 'Photographer'].includes(user.role)) {
      navigate('/events');
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await api.get('/events', { params: { limit: 100 } });
        setEvents(res.data.data.events);
        if (res.data.data.events.length > 0) {
          setSelectedEventId(res.data.data.events[0]._id);
        }
      } catch (err) {
        console.error('Error loading events list:', err);
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    if (!selectedEventId) return;
    setSelectedAlbumId('');
  }, [selectedEventId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const addFilesToQueue = (filesList: FileList) => {
    const newItems: UploadQueueItem[] = [];
    
    Array.from(filesList).forEach((file) => {
      // Validate type: support images and MP4/MOV videos
      const isSupported =
        file.type.startsWith('image/') ||
        file.type === 'video/mp4' ||
        file.type === 'video/quicktime';

      if (!isSupported) return;

      newItems.push({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: 'idle',
        progress: 0,
      });
    });

    setUploadQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(e.target.files);
    }
  };

  const removeQueueItem = (idx: number) => {
    setUploadQueue((prev) => {
      const target = prev[idx];
      if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const clearQueue = () => {
    uploadQueue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setUploadQueue([]);
    setReport(null);
  };

  const triggerUpload = async () => {
    if (!selectedEventId || uploadQueue.length === 0) return;

    setUploading(true);
    setReport(null);

    const formData = new FormData();
    formData.append('eventId', selectedEventId);
    if (selectedAlbumId) {
      formData.append('albumId', selectedAlbumId);
    }
    
    // Add all files to form data
    uploadQueue.forEach((item) => {
      formData.append('media', item.file);
    });

    // Mark all as uploading
    setUploadQueue((prev) =>
      prev.map((item) => ({ ...item, status: 'uploading', progress: 30 }))
    );

    try {
      const res = await uploadMediaMutation.mutateAsync({
        formData,
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadQueue((prev) =>
            prev.map((item) => ({ ...item, progress: percentCompleted }))
          );
        },
      });

      const { data, duplicatesSkipped } = res;
      const successCount = data.media?.length || 0;
      const skippedCount = duplicatesSkipped?.length || 0;

      // Update statuses to success
      setUploadQueue((prev) =>
        prev.map((item) => ({ ...item, status: 'success', progress: 100 }))
      );

      setReport({
        success: successCount,
        skipped: skippedCount,
        errors: [],
      });
      setToast({
        message: `Upload complete. ${successCount} file(s) added${skippedCount ? `, ${skippedCount} skipped as duplicates` : ''}.`,
        type: 'success',
      });
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error occurred uploading media items.';
      
      setUploadQueue((prev) =>
        prev.map((item) => ({ ...item, status: 'error', progress: 0, message: errMsg }))
      );

      setReport({
        success: 0,
        skipped: 0,
        errors: [errMsg],
      });
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Upload Media Dashboard</h1>
        <p className="text-dark-300 text-sm mt-1">
          Photographer Workspace. Add high-res media files to Event albums.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left config settings card */}
        <div className="space-y-6">
          <GlassCard className="space-y-5 bg-glass-card border-glass-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Upload settings
            </h3>

            {/* Select Target Event */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-dark-300 uppercase tracking-widest block">
                Target Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                disabled={uploading}
                className="w-full bg-dark-950 text-white text-sm p-3 border border-glass-border rounded-xl font-medium outline-none cursor-pointer"
              >
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title} ({ev.category})
                  </option>
                ))}
              </select>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEventModalMode('create');
                    setEventModalOpen(true);
                  }}
                  disabled={uploading}
                  className="flex-1 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-60"
                >
                  Create New Event
                </button>
                <button
                  onClick={() => {
                    if (selectedEventId) {
                      setEventModalMode('edit');
                      setEventModalOpen(true);
                    }
                  }}
                  disabled={uploading || !selectedEventId}
                  className="flex-1 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border border-glass-border hover:border-brand-500/50 text-dark-300 hover:text-brand-400 disabled:opacity-60"
                >
                  <Edit2 size={12} className="inline mr-1" />
                  Edit Event
                </button>
              </div>
            </div>

            {/* Select Target Album */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-dark-300 uppercase tracking-widest block">
                  Target Album
                </label>
                {albumsLoading && <Loader2 size={12} className="animate-spin text-brand-400" />}
              </div>
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  disabled={uploading || albumsLoading}
                  className="w-full bg-dark-950 text-white text-sm p-3 border border-glass-border rounded-xl font-medium outline-none cursor-pointer"
                >
                  <option value="">No Album (Event Root)</option>
                  {albums.map((alb) => (
                    <option key={alb._id} value={alb._id}>
                      {alb.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setAlbumModalOpen(true)}
                  disabled={uploading || !selectedEventId}
                  className="mt-2 w-full py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
                >
                  Create New Album
                </button>
                <p className="text-[10px] text-dark-400 mt-2">
                  New albums will be available immediately and selected for your current upload session.
                </p>
                {selectedAlbumId ? (
                  <p className="text-[10px] text-dark-300 mt-2">
                    Upload target: <span className="font-semibold text-white">
                      {albums.find((album) => album._id === selectedAlbumId)?.title || 'Selected album'}
                    </span>
                  </p>
                ) : (
                  <p className="text-[10px] text-dark-300 mt-2">
                    Upload target: Event root (no album selected).
                  </p>
                )}
            </div>

            {/* Selected Queue info */}
            {uploadQueue.length > 0 && (
              <div className="pt-4 border-t border-glass-border/30 space-y-3">
                <div className="flex justify-between text-xs font-bold text-dark-300">
                  <span>Queue count:</span>
                  <span className="text-white">{uploadQueue.length} files</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearQueue}
                    disabled={uploading}
                    className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border border-glass-border hover:border-red-500/30 text-dark-300 hover:text-red-400 transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={triggerUpload}
                    disabled={uploading || !selectedEventId}
                    className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-glass-glow flex items-center justify-center gap-1.5"
                  >
                    {uploading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <span>Upload</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

          <AlbumCreateModal
            open={albumModalOpen}
            loading={createAlbumMutation.status === 'pending'}
            onClose={() => setAlbumModalOpen(false)}
            onSubmit={async (payload) => {
              if (!selectedEventId) {
                setToast({ message: 'Please select an event before creating an album.', type: 'error' });
                return;
              }
              try {
                const album = await createAlbumMutation.mutateAsync(payload);
                if (album?._id) {
                  setSelectedAlbumId(album._id);
                  setToast({
                    message: `Album "${album.title}" created and selected!`,
                    type: 'success',
                  });
                }
                setAlbumModalOpen(false);
              } catch (err: any) {
                const errMsg = err.response?.data?.message || 'Could not create album.';
                setToast({ message: errMsg, type: 'error' });
                console.error('Create album error', err);
              }
            }}
          />

          <EventCreateEditModal
            open={eventModalOpen}
            mode={eventModalMode}
            loading={createEventMutation.status === 'pending' || updateEventMutation.status === 'pending'}
            initialData={
              eventModalMode === 'edit' && selectedEventId
                ? events.find((e) => e._id === selectedEventId)
                  ? {
                      title: events.find((e) => e._id === selectedEventId)?.title || '',
                      description: '',
                      date: new Date().toISOString().slice(0, 16),
                      location: '',
                      category: events.find((e) => e._id === selectedEventId)?.category || 'Social',
                      coverImage: '',
                      visibility: 'public' as const,
                    }
                  : undefined
                : undefined
            }
            onClose={() => setEventModalOpen(false)}
            onSubmit={async (payload) => {
              try {
                if (eventModalMode === 'create') {
                  const newEvent = await createEventMutation.mutateAsync(payload as any);
                  if (newEvent?._id) {
                    setEvents((prev) => [newEvent, ...prev]);
                    setSelectedEventId(newEvent._id);
                    setToast({
                      message: `Event "${newEvent.title}" created and selected!`,
                      type: 'success',
                    });
                  }
                } else {
                  const updatedEvent = await updateEventMutation.mutateAsync({
                    eventId: selectedEventId,
                    payload: payload as any,
                  });
                  if (updatedEvent?._id) {
                    setEvents((prev) =>
                      prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
                    );
                    setToast({
                      message: `Event "${updatedEvent.title}" updated!`,
                      type: 'success',
                    });
                  }
                }
                setEventModalOpen(false);
              } catch (err: any) {
                const errMsg = err.response?.data?.message || 'Could not save event.';
                setToast({ message: errMsg, type: 'error' });
                console.error('Event mutation error', err);
              }
            }}
          />

        <ToastMessage
          open={!!toast}
          message={toast?.message || ''}
          type={toast?.type || 'info'}
          onClose={() => setToast(null)}
        />

        {/* Right main Drag area */}
        <div className="md:col-span-2 space-y-6">
          {/* Drag area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`
              glass-panel
              rounded-2xl
              p-10
              text-center
              border-2
              border-dashed
              cursor-pointer
              transition-all
              duration-300
              flex
              flex-col
              items-center
              justify-center
              min-h-[220px]
              ${
                isDragging
                  ? 'border-brand-500 bg-brand-500/5 shadow-glass-glow'
                  : 'border-glass-border hover:border-brand-500/30 bg-glass-card'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            <UploadCloud size={44} className={`mb-4 ${isDragging ? 'text-brand-400 animate-bounce' : 'text-dark-400'}`} />
            <h3 className="text-white font-extrabold text-base">Drag & drop files here</h3>
            <p className="text-dark-300 text-xs mt-1 max-w-sm">
              Supports JPEG, JPG, PNG, WEBP images and MP4/MOV videos up to 50MB. Click to browse.
            </p>
          </div>

          {/* Report Alert Banner */}
          {report && (
            <GlassCard className="!p-4 bg-dark-800 border-glass-border flex gap-3">
              {report.errors.length > 0 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs text-red-400 leading-relaxed font-semibold">
                    <h4>Upload completed with conflicts:</h4>
                    <p>{report.errors[0]}</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-dark-300 leading-relaxed font-semibold">
                    <h4 className="text-white">Upload execution report:</h4>
                    <p>
                      Successfully processed:{' '}
                      <span className="text-brand-400">{report.success} files</span>. Duplicate
                      skips:{' '}
                      <span className="text-indigo-400">{report.skipped} files</span> (prevented
                      redundant cloud storage!).
                    </p>
                  </div>
                </>
              )}
            </GlassCard>
          )}

          {/* Queue Files Grid */}
          {uploadQueue.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-dark-300 uppercase tracking-widest">
                File Queue ({uploadQueue.length} items)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
                {uploadQueue.map((item, idx) => (
                  <GlassCard
                    key={idx}
                    className="!p-3 border border-glass-border bg-glass-card relative flex flex-col justify-between h-[150px]"
                  >
                    {/* Media Preview */}
                    {item.file.type.startsWith('image/') ? (
                      <div className="w-full h-[80px] rounded-lg overflow-hidden relative">
                        <img
                          src={item.previewUrl}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-[80px] rounded-lg bg-dark-950 flex items-center justify-center text-dark-400 border border-glass-border shrink-0">
                        <FileText size={24} />
                      </div>
                    )}

                    {/* Progress indicators overlay */}
                    {item.status === 'uploading' && (
                      <div className="absolute inset-0 bg-dark-900/60 flex flex-col justify-center items-center p-3 rounded-xl select-none">
                        <div className="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-brand-500 h-full transition-all"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white font-bold mt-1.5">
                          {item.progress}%
                        </span>
                      </div>
                    )}

                    {/* Details row */}
                    <div className="flex justify-between items-center text-[10px] text-dark-300 pt-1 border-t border-glass-border/30 mt-2 shrink-0">
                      <span className="truncate max-w-[70px] font-bold">
                        {item.file.name}
                      </span>
                      <span className="shrink-0 font-medium">
                        {(item.file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                      {!uploading && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQueueItem(idx);
                          }}
                          className="p-0.5 rounded-full hover:bg-dark-950 text-dark-400 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
