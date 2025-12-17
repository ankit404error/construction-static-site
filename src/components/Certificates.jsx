import React, { useState, useEffect } from 'react';
import { Award, Calendar, ExternalLink, Edit3, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Certificates = () => {
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const { isAdmin, token } = useAuth();

  const fetchCertificateData = async () => {
    try {
      const data = await api.getCertificatePageData();
      setCertificateData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching certificate data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificateData();
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
    let initialData = {};
    let fields = [];

    if (section === 'hero') {
      initialData = { ...certificateData.hero };
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' }
      ];
    } else if (section === 'certificates') {
      initialData = { certificates: certificateData.certificates };
      fields = [
        {
          name: 'certificates',
          label: 'Certificates',
          type: 'array',
          subFields: [
            { name: 'image', placeholder: 'Certificate Image URL', type: 'image' },
            { name: 'title', placeholder: 'Certificate Title' },
            { name: 'description', placeholder: 'Description' },
            { name: 'issuedBy', placeholder: 'Issued By' },
            { name: 'issuedDate', placeholder: 'Issued Date (Year)' }
          ]
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
      await api.updateCertificatePageData(updatedData, token);
      await fetchCertificateData();
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
  if (!certificateData) return null;

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
        
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in relative">
           {editMode && (
              <div className="absolute top-0 right-0">
                 <Button onClick={() => handleEdit('hero')} className="shadow-lg">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Hero
                 </Button>
              </div>
           )}

           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              ACCREDITATIONS
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{certificateData.hero.title}</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             {certificateData.hero.subtitle}
           </p>
        </div>

        {/* Certificates Grid */}
        <section className="relative">
           {editMode && (
              <div className="flex justify-end mb-4">
                 <Button onClick={() => handleEdit('certificates')} className="shadow-lg">
                    <Edit3 className="w-4 h-4 mr-2" /> Manage Certificates
                 </Button>
              </div>
           )}

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificateData.certificates.map((cert, index) => (
                 <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-none shadow-lg h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden bg-white p-6 flex items-center justify-center border-b border-border/50">
                       <img 
                         src={cert.image} 
                         alt={cert.title} 
                         className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                         onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=Certificate'; }}
                       />
                       <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                             Verified
                          </Badge>
                       </div>
                    </div>
                    
                    <CardHeader>
                       <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                          {cert.title}
                       </h3>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                       <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {cert.description}
                       </p>
                       
                       <div className="flex flex-col gap-2 mt-auto">
                          {cert.issuedBy && (
                             <div className="flex items-center gap-2 text-sm text-foreground/80">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Issuer:</span> {cert.issuedBy}
                             </div>
                          )}
                          {cert.issuedDate && (
                             <div className="flex items-center gap-2 text-sm text-foreground/80">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="font-semibold">Year:</span> {cert.issuedDate}
                             </div>
                          )}
                       </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0 pb-6">
                       <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                          View Details
                       </Button>
                    </CardFooter>
                 </Card>
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

export default Certificates;
