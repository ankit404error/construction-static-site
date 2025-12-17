import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Edit3, Settings, Truck, PenTool, Layout, Server, Shield } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Service = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const { isAdmin, token } = useAuth();

  const fetchServiceData = async () => {
    try {
      const data = await api.getServicePageData();
      setServiceData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching service data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
    let initialData = {};
    let fields = [];

    if (section === 'services') {
      initialData = { services: serviceData.services };
      fields = [
        {
          name: 'services',
          label: 'Services',
          type: 'array',
          subFields: [
            { name: 'title', placeholder: 'Service Title' },
            { name: 'desc', placeholder: 'Description', type: 'textarea' },
            { name: 'image', placeholder: 'Image URL', type: 'image' }
          ]
        }
      ];
    } else if (section === 'cta') {
      initialData = { ...serviceData.cta };
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
      let updatePayload;
      if (editingSection === 'services') {
        updatePayload = updatedData;
      } else {
        updatePayload = { [editingSection]: updatedData };
      }

      await api.updateServicePageData(updatePayload, token);
      await fetchServiceData();
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
  if (!serviceData) return null;

  const { services, cta } = serviceData;

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
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              OUR EXPERTISE
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">World-Class Services</h1>
           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
             Comprehensive solutions for the mechanical and energy sectors, delivered with precision and safety.
           </p>
        </div>

        {/* Edit Button for Services */}
        {editMode && (
          <div className="flex justify-end mb-4">
             <Button onClick={() => handleEdit('services')} className="shadow-lg">
                <Edit3 className="w-4 h-4 mr-2" /> Edit Services
             </Button>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid gap-12">
          {services.map((s, i) => (
             <div 
               key={i} 
               className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center group`}
             >
                {/* Image Side */}
                <div className="flex-1 w-full relative">
                   <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[300px] md:h-[400px]">
                      <img 
                        src={s.image} 
                        alt={s.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=Service'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white md:hidden">
                         <h3 className="text-xl font-bold">{s.title}</h3>
                      </div>
                   </div>
                   {/* Decorative elements */}
                   <div className={`absolute -z-10 w-full h-full border-2 border-primary/20 rounded-2xl top-4 ${i % 2 === 1 ? 'left-4' : '-left-4'}`}></div>
                </div>
                
                {/* Content Side */}
                <div className="flex-1 space-y-4">
                   <div className="hidden md:block">
                      <h2 className="text-3xl font-heading font-bold mb-4">{s.title}</h2>
                      <div className="h-1 w-20 bg-primary rounded-full mb-6"></div>
                   </div>
                   
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     {s.desc}
                   </p>
                   
                   <Button asChild variant="outline" className="group/btn mt-4">
                      <Link to="/contact">
                        Know More <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                   </Button>
                </div>
             </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-32 relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white text-center py-20 px-6">
           {/* Plus Pattern Overlay */}
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

export default Service;