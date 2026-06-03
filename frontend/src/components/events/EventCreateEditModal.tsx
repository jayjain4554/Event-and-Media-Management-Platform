import React, { useEffect, useState } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { CreateEventPayload, UpdateEventPayload } from '../../services/eventService';

interface EventCreateEditModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  loading?: boolean;
  initialData?: {
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    coverImage: string;
    visibility: 'public' | 'private';
  };
  onClose: () => void;
  onSubmit: (payload: CreateEventPayload | UpdateEventPayload) => Promise<void>;
}

const CATEGORIES = [
  'Social',
  'Academic',
  'Sports',
  'Arts',
  'Ceremony',
  'Professional',
  'Other',
];

export const EventCreateEditModal: React.FC<EventCreateEditModalProps> = ({
  open,
  mode,
  loading = false,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Social');
  const [coverImage, setCoverImage] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setCategory('Social');
      setCoverImage('');
      setVisibility('public');
    } else if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDate(initialData.date);
      setLocation(initialData.location);
      setCategory(initialData.category);
      setCoverImage(initialData.coverImage);
      setVisibility(initialData.visibility);
    }
  }, [open, mode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !date || !location.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date: date,
      location: location.trim(),
      category: category,
      coverImage: coverImage.trim() || '',
      visibility: visibility,
    });
  };

  if (!open) {
    return null;
  }

  const isFormValid = title.trim() && date && location.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
      <GlassCard className="w-full max-w-lg shadow-glass-card border border-glass-border rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-glass-border sticky top-0 bg-dark-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <Calendar size={18} className="text-brand-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {mode === 'create' ? 'Create New Event' : 'Edit Event'}
              </h3>
              <p className="text-[10px] text-dark-400 mt-1">
                {mode === 'create' ? 'Add a new event for your organization.' : 'Update event details.'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-dark-300 hover:text-white p-2 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Event Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Beach Cleanup, Hackathon, Graduation Gala"
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional event description"
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20 resize-none"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Event Date *</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Marina Coastal Beach, Engineering Lab 4"
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
              className="w-full rounded-2xl border border-glass-border bg-dark-900 px-4 py-3 text-sm text-white outline-none transition-all focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/20"
            >
              <option value="public">Public (Anyone can view)</option>
              <option value="private">Private (Members only)</option>
            </select>
          </div>

          {/* Cover Image */}
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
                  alt="Event cover preview"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <p className="text-[10px] text-dark-400">
              Optional cover image URL for the event. Leave blank to use a default visual.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-glass-border/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest text-dark-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500 text-xs font-bold uppercase tracking-widest text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : mode === 'create' ? 'Create Event' : 'Update Event'}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
