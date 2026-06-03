import React, { useEffect, useState } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { CreateAlbumPayload } from '../../services/albumService';

interface AlbumCreateModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAlbumPayload) => Promise<void>;
}

export const AlbumCreateModal: React.FC<AlbumCreateModalProps> = ({ open, loading = false, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setCoverImage('');
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <GlassCard className="w-full max-w-md shadow-glass-card border border-glass-border rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <FolderPlus size={18} className="text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Create New Album</h3>
              <p className="text-[10px] text-dark-400 mt-1">Organize your event media into a shared album.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-dark-300 hover:text-white p-2 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Album Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ceremony, Reception, Afterparty"
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Description</label>
              <span className="text-[10px] text-dark-400">Optional</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional album description"
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 resize-none"
            />
            <p className="text-[10px] text-dark-400">
              This album will be available immediately and can be selected for upload.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
            />
            {coverImage && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-glass-border">
                <img
                  src={coverImage}
                  alt="Album cover preview"
                  className="w-full h-36 object-cover"
                />
              </div>
            )}
            <p className="text-[10px] text-dark-400">
              Optional cover image URL for the album. Leave blank to use the default album visual.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest text-dark-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500 text-xs font-bold uppercase tracking-widest text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Create Album'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
