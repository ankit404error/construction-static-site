import React, { useState, useEffect } from 'react';
import { Shield, Award, Users, Edit3, Check } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EHS = () => {
  const [ehsData, setEhsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const { isAdmin, token } = useAuth();

  const fetchEHSData = async () => {
    try {
      const data = await api.getEHSPageData();
      setEhsData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching EHS data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEHSData();
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
    let initialData = {};
    let fields = [];

    if (section === 'hero') {
      initialData = { ...ehsData.hero };
      fields = [
        { name: 'image', label: 'Hero Image', type: 'image' },
        { name: 'title', label: 'Title', type: 'text' }
      ];
    } else if (section === 'content') {
      initialData = { 
        title: ehsData.content.title,
        bulletPoints: ehsData.content.bulletPoints 
      };
      fields = [
        { name: 'title', label: 'Content Title', type: 'text' },
        { 
          name: 'bulletPoints', 
          label: 'Bullet Points', 
          type: 'array', 
          subFields: [{ name: 'text', placeholder: 'Bullet point text (Supports HTML spans)' }] 
        }
      ];
    } else if (section === 'achievements') {
      initialData = { 
        title: ehsData.achievements.title,
        images: ehsData.achievements.images.map(img => ({ url: img }))
      };
      fields = [
        { name: 'title', label: 'Section Title', type: 'text' },
        { 
          name: 'images', 
          label: 'Achievement Images', 
          type: 'array', 
          subFields: [{ name: 'url', placeholder: 'Image URL', type: 'image' }] 
        }
      ];
    } else if (section === 'teamPhotos') {
      initialData = { 
        teamPhotos: ehsData.teamPhotos.map(img => ({ url: img }))
      };
      fields = [
        { 
          name: 'teamPhotos', 
          label: 'Team Photos', 
          type: 'array', 
          subFields: [{ name: 'url', placeholder: 'Image URL', type: 'image' }] 
        }
      ];
    }

    setModalData({ 
      title: `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`, 
      fields, 
      initialData 
    });
  };

  const handleSave = async (updatedData) => {
    try {
      let updatePayload = {};
      if (editingSection === 'achievements') {
        updatePayload = {
          achievements: {
            title: updatedData.title,
            images: updatedData.images.map(img => img.url)
          }
        };
      } else if (editingSection === 'teamPhotos') {
        updatePayload = {
          teamPhotos: updatedData.teamPhotos.map(img => img.url)
        };
      } else {
        updatePayload = { [editingSection]: updatedData };
      }

      await api.updateEHSPageData(updatePayload, token);
      await fetchEHSData();
      setEditingSection(null);
      setModalData(null);
    } catch (err) {
      console.error('Error updating data:', err);
      alert('Failed to update content.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!ehsData) return null;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && (
        <div className="fixed top-24 left-4 z-50 flex gap-2">
           <Button variant={editMode ? "destructive" : "secondary"} onClick={() => setEditMode(!editMode)} className="shadow-xl">
              {editMode ? "Exit Edit Mode" : "Enable Edit Mode"}
           </Button>
        </div>
      )}

      <div className="container mx-auto px-4">
        
        {/* Hero / Intro Section */}
        <section className="mb-24 relative">
           {editMode && (
              <div className="absolute top-0 right-0 z-10">
                 <Button onClick={() => handleEdit('hero')} className="shadow-lg">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Hero
                 </Button>
              </div>
           )}

           <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1 border border-green-500/20 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-4">
                 <Shield className="w-4 h-4" /> SAFETY FIRST
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{ehsData.hero.title}</h1>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Side */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px]">
                 <img
                   src={ehsData.hero.image}
                   alt="EHS Safety"
                   className="w-full h-full object-cover"
                   onError={e => { e.target.src = 'https://via.placeholder.com/600x600?text=Safety'; }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                 <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-xl">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <Check className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="font-bold text-lg text-navy">Zero Accident Policy</p>
                          <p className="text-sm text-muted-foreground">Committed to the highest safety standards</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8 relative group">
                 {editMode && (
                   <Button size="sm" variant="outline" className="absolute top-0 right-0" onClick={() => handleEdit('content')}>
                      <Edit3 className="w-4 h-4" />
                   </Button>
                 )}
                 
                 <h2 className="text-3xl font-heading font-bold">{ehsData.content.title}</h2>
                 
                 <div className="space-y-4">
                    {ehsData.content.bulletPoints.map((point, index) => (
                       <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
                          <div className="shrink-0 mt-1">
                             <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                             </div>
                          </div>
                          <div className="text-lg text-muted-foreground leading-relaxed">
                             {/* Preserving the HTML parsing logic safely */}
                             {point.text.split(/(<span class="text-blue-900 font-semibold">.*?<\/span>)/g).map((part, i) => {
                               if (part.includes('text-blue-900')) {
                                 const match = part.match(/>(.+?)</);
                                 return match ? <span key={i} className="text-primary font-bold">{match[1]}</span> : part;
                               }
                               return <span key={i}>{part}</span>;
                             })}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-24 relative bg-secondary/30 -mx-4 px-4 py-20">
           {editMode && (
              <div className="absolute top-4 right-4 z-10">
                 <Button onClick={() => handleEdit('achievements')} className="shadow-lg">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Achievements
                 </Button>
              </div>
           )}

           <div className="container mx-auto">
              <div className="text-center mb-12">
                 <div className="inline-flex items-center gap-2 px-4 py-1 border border-primary/20 rounded-full bg-white text-primary text-sm font-medium mb-4 shadow-sm">
                    <Award className="w-4 h-4" /> RECOGNITION
                 </div>
                 <h2 className="text-3xl font-heading font-bold">{ehsData.achievements.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {ehsData.achievements.images.map((src, i) => (
                    <div key={i} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                       <div className="h-64 overflow-hidden relative">
                          <img
                            src={src}
                            alt={`Achievement ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=Certificate'; }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Team Photos Section */}
        <section className="mb-16 relative">
           {editMode && (
              <div className="absolute top-0 right-0 z-10">
                 <Button onClick={() => handleEdit('teamPhotos')} className="shadow-lg">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Photos
                 </Button>
              </div>
           )}

           <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
                 <Users className="w-4 h-4" /> OUR TEAM
              </div>
              <h2 className="text-3xl font-heading font-bold">Safety in Action</h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ehsData.teamPhotos.map((src, i) => (
                 <div key={i} className="rounded-2xl overflow-hidden shadow-lg h-72 group relative">
                    <img
                      src={src}
                      alt={`Team Photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=Team+Action'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <p className="text-white font-medium">On-site Safety Inspection</p>
                    </div>
                 </div>
              ))}
           </div>
        </section>

      </div>

      <EditModal
        isOpen={!!editingSection}
        onClose={() => { setEditingSection(null); setModalData(null); }}
        onSave={handleSave}
        title={modalData?.title}
        fields={modalData?.fields || []}
        initialData={modalData?.initialData}
      />
    </main>
  );
};

export default EHS;