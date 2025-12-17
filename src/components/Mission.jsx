import React, { useState, useEffect } from 'react';
import { Target, Eye, ArrowRight, CheckCircle2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Mission = () => {
  const [missionData, setMissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const { isAdmin, token } = useAuth();

  const fetchMissionData = async () => {
    try {
      const data = await api.getMissionPageData();
      setMissionData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching mission data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionData();
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
    let initialData = {};
    let fields = [];

    if (section === 'hero') {
      initialData = { ...missionData.hero };
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'backgroundImage', label: 'Background Image URL', type: 'image' }
      ];
    } else if (section === 'vision') {
      initialData = { ...missionData.vision };
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image URL', type: 'image' }
      ];
    } else if (section === 'mission') {
      initialData = { ...missionData.mission };
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image URL', type: 'image' },
        {
          name: 'listItems',
          label: 'Mission Points',
          type: 'array',
          subFields: [
            { name: 'title', placeholder: 'Point Title' },
            { name: 'description', placeholder: 'Description', type: 'textarea' }
          ]
        }
      ];
    } else if (section === 'cta') {
      initialData = { ...missionData.cta };
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'buttonText', label: 'Button Text', type: 'text' }
      ];
    }

    setModalData({ title: `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`, fields, initialData });
  };

  const handleSave = async (updatedData) => {
    try {
      let updatePayload = {
        [editingSection]: updatedData
      };
      await api.updateMissionPageData(updatePayload, token);
      await fetchMissionData();
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
  if (!missionData) return null;

  const { hero, vision, mission, cta } = missionData;

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
        
        {/* Header/Hero Section */}
        <div className="text-center mb-20 animate-fade-in relative">
           {editMode && (
              <div className="absolute top-0 right-0">
                 <Button size="sm" variant="ghost" onClick={() => handleEdit('hero')}>
                    <Edit3 className="w-4 h-4 ml-2" />
                 </Button>
              </div>
           )}
           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              OUR DRIVING FORCE
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{hero.title}</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             {hero.subtitle}
           </p>
        </div>

        {/* Vision Section */}
        <section className="mb-32">
           <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                 {editMode && (
                   <Button size="icon" className="absolute top-4 right-4 z-10" onClick={() => handleEdit('vision')}>
                     <Edit3 className="w-4 h-4" />
                   </Button>
                 )}
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                    <img 
                      src={vision.image} 
                      alt="Vision" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=Vision'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -z-10 w-full h-full border-2 border-primary/20 rounded-3xl top-4 -left-4"></div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                       <Eye className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold">{vision.title}</h2>
                 </div>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   {vision.description}
                 </p>
              </div>
           </div>
        </section>

        {/* Mission Section */}
        <section className="mb-32">
           <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
              <div className="md:order-2 relative group">
                 {editMode && (
                   <Button size="icon" className="absolute top-4 right-4 z-10" onClick={() => handleEdit('mission')}>
                     <Edit3 className="w-4 h-4" />
                   </Button>
                 )}
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                    <img 
                      src={mission.image} 
                      alt="Mission" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=Mission'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 </div>
                 <div className="absolute -z-10 w-full h-full border-2 border-primary/20 rounded-3xl top-4 -right-4"></div>
              </div>

              <div className="md:order-1 space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                       <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold">{mission.title}</h2>
                 </div>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   {mission.description}
                 </p>

                 <div className="space-y-4">
                    {mission.listItems.map((item, index) => (
                       <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex gap-4">
                             <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                             <div>
                                <h3 className="font-bold text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                             </div>
                          </CardContent>
                       </Card>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white text-center py-20 px-6">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}></div>
           
           <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              {editMode && (
                 <div className="absolute top-0 right-0">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit('cta')}>
                       <Edit3 className="w-4 h-4 mr-2" /> Edit CTA
                    </Button>
                 </div>
              )}
              
              <h2 className="text-3xl md:text-5xl font-heading font-bold">
                {cta.title}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                {cta.description}
              </p>
              <Button asChild size="lg" className="bg-white text-navy hover:bg-white/90 shadow-glow text-lg h-14 px-8">
                 <Link to="/contact">{cta.buttonText}</Link>
              </Button>
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

export default Mission;
