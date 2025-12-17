import React, { useState, useEffect } from 'react';
import { Edit3, ZoomIn, X } from 'lucide-react';
import api from '../services/api';
// Auth and Edit imports removed
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Gallery = () => {
  // Auth hooks removed
  const [galleryData, setGalleryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGalleryData = async () => {
    try {
      const data = await api.getGalleryPageData();
      setGalleryData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching gallery data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  // handleEdit and handleSave removed

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!galleryData) return null;

  const { images } = galleryData;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      
      {/* ADMIN CONTROLS */}
      {/* ADMIN CONTROLS removed */}

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in relative">
           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              PORTFOLIO
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Work Gallery</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             A glimpse into our projects, site operations, and engineering excellence.
           </p>
           
           {/* Edit button removed */}
        </div>

        {/* Masonry-like Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
           {images.map((img, index) => (
              <div key={index} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-lg cursor-pointer bg-secondary" onClick={() => setSelectedImage(img)}>
                 <img 
                   src={img} 
                   alt={`Gallery ${index + 1}`} 
                   className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                   loading="lazy"
                   onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                 />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                 </div>
              </div>
           ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
           <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
              <button 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                 <X className="w-10 h-10" />
              </button>
              <img 
                src={selectedImage} 
                alt="Full View" 
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              />
           </div>
        )}

      </div>

      {/* EditModal removed */}
    </main>
  );
};

export default Gallery;