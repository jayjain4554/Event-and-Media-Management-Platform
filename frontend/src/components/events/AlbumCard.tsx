import React from 'react';
import { Folder } from 'lucide-react';
import { Album } from '../../services/albumService';

interface AlbumCardProps {
  album: Album;
  selected?: boolean;
  onSelect: (albumId: string) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, selected = false, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(album._id)}
      className={`shrink-0 relative w-[130px] h-[110px] rounded-2xl overflow-hidden border transition-all duration-200 text-left focus:outline-none ${
        selected
          ? 'border-brand-500 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/20'
          : 'border-glass-border bg-glass-card hover:border-brand-500/30'
      }`}
    >
      {album.coverImage ? (
        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-dark-800 flex items-center justify-center">
          <Folder size={28} className={selected ? 'text-brand-400' : 'text-dark-500'} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-950/95 to-transparent p-3 pt-5">
        <div className="text-[10px] font-bold truncate text-white">{album.title}</div>
        <div className="text-[9px] text-dark-300 truncate mt-1">
          {typeof album.mediaCount === 'number' ? `${album.mediaCount} media` : album.description || 'Album collection'}
        </div>
      </div>
    </button>
  );
};
