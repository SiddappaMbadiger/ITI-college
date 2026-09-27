import React, { useState } from 'react';
import { GalleryImage } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface GalleryProps {
  images: GalleryImage[];
}

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [filter, setFilter] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Workshops', 'Practical Training', 'Classrooms', 'Campus'];

  const filteredImages = images.filter((img) => {
    if (filter === 'All') return true;
    return img.category === filter;
  });

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const prevImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  const nextImage = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredImages.length);
  };

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#fcfbf9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 text-left">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-sky-800 mb-2 font-mono">
              Visual Documentation
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0b1f33] font-institutional tracking-tight">
              Campus & Workshop Gallery
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Photographic overview of training environments, workshop bays, and institutional spaces.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-md border border-slate-200 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                  filter === cat
                    ? 'bg-white text-[#0f2b48] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Transparency Notice */}
        <div className="mb-6 p-3 bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2 text-left">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Photographs depict authentic vocational training settings, laboratories, and institutional premises. Additional official verified photographs can be updated directly via the administrator gallery module.
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider mb-1 font-mono">
                    {img.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-institutional line-clamp-1">
                    {img.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
                {img.verified_note && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    {img.verified_note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredImages[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredImages[activeLightboxIndex].image_url}
              alt={filteredImages[activeLightboxIndex].title}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-md shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <div className="text-xs uppercase tracking-wider text-sky-400 font-mono">
                {filteredImages[activeLightboxIndex].category} · {activeLightboxIndex + 1} of {filteredImages.length}
              </div>
              <h3 className="text-lg font-bold mt-1 font-institutional">
                {filteredImages[activeLightboxIndex].title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {filteredImages[activeLightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
