import React, { useState } from 'react';
import { useCreateEvent } from '../../hooks/useEvents';
import { GlassCard } from '../ui/GlassCard';
import { Loader2, Calendar, MapPin, Tag, Lock, Globe, FileText, Image as ImageIcon } from 'lucide-react';

interface EventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ onSuccess, onCancel }) => {
  const createEventMutation = useCreateEvent();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Social',
    coverImage: '',
    visibility: 'public' as 'public' | 'private',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.title || !formData.description || !formData.date || !formData.location || !formData.coverImage) {
      setError('All fields are required.');
      return;
    }

    try {
      await createEventMutation.mutateAsync(formData);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Social',
        coverImage: '',
        visibility: 'public',
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const serverError = err.response?.data?.message || 'Failed to create event. Please try again.';
      setError(serverError);
    }
  };

  const categories = ['Social', 'Sports', 'Academic', 'Arts', 'Ceremony'];

  return (
    <GlassCard className="bg-dark-800 border-glass-border max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Create New Event</h2>
        <p className="text-dark-300 text-xs mt-1">Fill in the event details to host a live media gallery</p>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-dark-300">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
            <FileText size={12} className="text-brand-400" />
            <span>Event Title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Annual Graduation Ceremony 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium"
            disabled={createEventMutation.isPending}
          />
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={12} className="text-brand-400" />
              <span>Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Grand Hall, Main Campus"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium"
              disabled={createEventMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} className="text-brand-400" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium cursor-pointer"
              disabled={createEventMutation.isPending}
            />
          </div>
        </div>

        {/* Category & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
              <Tag size={12} className="text-brand-400" />
              <span>Category</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium cursor-pointer"
              disabled={createEventMutation.isPending}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
              {formData.visibility === 'public' ? (
                <Globe size={12} className="text-teal-400" />
              ) : (
                <Lock size={12} className="text-rose-400" />
              )}
              <span>Visibility</span>
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' })}
              className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium cursor-pointer"
              disabled={createEventMutation.isPending}
            >
              <option value="public">Public (Everyone can explore)</option>
              <option value="private">Private (Registered members only)</option>
            </select>
          </div>
        </div>

        {/* Cover Image URL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
            <ImageIcon size={12} className="text-brand-400" />
            <span>Cover Image URL</span>
          </label>
          <input
            type="text"
            placeholder="e.g. https://images.unsplash.com/photo-..."
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium"
            disabled={createEventMutation.isPending}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-300 uppercase tracking-wider flex items-center gap-1">
            <FileText size={12} className="text-brand-400" />
            <span>Description</span>
          </label>
          <textarea
            placeholder="Provide a description of the event..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-dark-950 border border-glass-border text-white px-3 py-2.5 rounded-xl outline-none focus:border-brand-500/50 font-medium resize-none"
            disabled={createEventMutation.isPending}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-glass-border/30 mt-4 select-none">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-glass-border hover:border-brand-500/20 text-dark-300 hover:text-white rounded-lg transition-all text-xs font-bold"
              disabled={createEventMutation.isPending}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
            disabled={createEventMutation.isPending}
          >
            {createEventMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Event</span>
            )}
          </button>
        </div>
      </form>
    </GlassCard>
  );
};
