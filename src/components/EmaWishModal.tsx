import React, { useState } from 'react';
import { X, Send, Heart } from 'lucide-react';

interface EmaWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWish: (wish: string) => void;
  currentWish: string;
}

export const EmaWishModal: React.FC<EmaWishModalProps> = ({
  isOpen,
  onClose,
  onSaveWish,
  currentWish,
}) => {
  const [text, setText] = useState<string>(currentWish || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSaveWish(text.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Wooden Ema Plaque Container */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 rounded-lg border-2 border-amber-900/60 shadow-2xl p-6 text-amber-950">
        {/* Pentagonal Ema Wooden Plaque Top Silhouette Cut */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-900 rounded-full border-2 border-amber-300 shadow-inner flex items-center justify-center">
          <div className="w-3 h-3 bg-amber-950 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-amber-900 hover:bg-amber-200/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Header */}
        <div className="text-center mt-3 mb-5">
          <h2 className="text-xl font-serif font-bold text-amber-900 tracking-wider">
            絵馬に願いを託す
          </h2>
          <p className="text-xs text-amber-800 font-sans tracking-wide mt-1">
            Write a Prayer Wish on the Ema Plaque (Max 60 characters)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 60))}
              placeholder="心に秘めた願いや祈りをここにお書きください..."
              rows={3}
              className="w-full p-4 rounded-md bg-amber-50/80 border border-amber-700/30 text-amber-950 font-serif placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-700/50 resize-none text-sm leading-relaxed shadow-inner"
              maxLength={60}
              autoFocus
            />
            <div className="absolute bottom-2 right-3 text-xs font-mono text-amber-800/60">
              {text.length} / 60
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-900/10">
            <div className="flex items-center text-xs text-amber-800/70 font-sans">
              <Heart className="w-3.5 h-3.5 mr-1 text-rose-700 fill-rose-700/30" />
              Saved locally in shrine memory
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2 rounded-md bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-amber-100 font-serif text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              奉納する (Submit)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
