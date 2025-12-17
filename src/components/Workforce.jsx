import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, HardHat, Edit3 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Workforce = () => {
  const [workforceData, setWorkforceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { isAdmin, token } = useAuth();

  const fetchWorkforceData = async () => {
    try {
      const data = await api.getWorkforcePageData();
      setWorkforceData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workforce data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkforceData();
  }, []);

  const handleEdit = (section) => {
    let fields = [];
    let initialData = {};
    let title = '';

    if (section === 'indirect') {
      title = 'Edit Indirect Workforce';
      initialData = workforceData.indirect;
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'count', label: 'Count (e.g., 154+)', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' }
      ];
    } else if (section === 'direct') {
      title = 'Edit Direct Workforce';
      initialData = workforceData.direct;
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'count', label: 'Count (e.g., 2,250+)', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' }
      ];
    } else if (section === 'cta') {
      title = 'Edit CTA Section';
      initialData = workforceData.cta;
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { name: 'buttonText', label: 'Button Text', type: 'text' },
        { name: 'buttonLink', label: 'Button Link', type: 'text' }
      ];
    }

    setModalData({ title, fields, initialData, section });
  };

  const handleSave = async (updatedData) => {
    try {
      let newData = { ...workforceData };
      if (modalData.section === 'indirect') {
        newData.indirect = updatedData;
      } else if (modalData.section === 'direct') {
        newData.direct = updatedData;
      } else if (modalData.section === 'cta') {
        newData.cta = updatedData;
      }

      await api.updateWorkforcePageData(newData, token);
      setWorkforceData(newData);
      setModalData(null);
    } catch (err) {
      console.error('Error updating data:', err);
      alert('Failed to update content. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!workforceData) return null;

  const { indirect, direct, cta } = workforceData;

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
              OUR STRENGTH
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Workforce Statistics</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             A dedicated team of professionals driving our success.
           </p>
        </div>

        {/* Stats Grid */}
        <section className="mb-20">
           <div className="grid md:grid-cols-2 gap-10">
              {/* Indirect Workforce */}
              <Card className="relative group overflow-hidden border-t-4 border-t-blue-500 hover:shadow-2xl transition-all">
                 {editMode && (
                    <div className="absolute top-4 right-4 z-10">
                       <Button size="sm" variant="ghost" onClick={() => handleEdit('indirect')}>
                          <Edit3 className="w-4 h-4" />
                       </Button>
                    </div>
                 )}
                 <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                       <UserCheck className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{indirect.title}</CardTitle>
                 </CardHeader>
                 <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">{indirect.description}</p>
                    <div className="py-2">
                       <span className="text-5xl font-extrabold text-foreground tracking-tight">{indirect.count}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs uppercase tracking-widest px-3 py-1">
                       {indirect.subtitle}
                    </Badge>
                 </CardContent>
              </Card>

              {/* Direct Workforce */}
              <Card className="relative group overflow-hidden border-t-4 border-t-orange-500 hover:shadow-2xl transition-all">
                 {editMode && (
                    <div className="absolute top-4 right-4 z-10">
                       <Button size="sm" variant="ghost" onClick={() => handleEdit('direct')}>
                          <Edit3 className="w-4 h-4 text-orange-600" />
                       </Button>
                    </div>
                 )}
                 <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                       <HardHat className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{direct.title}</CardTitle>
                 </CardHeader>
                 <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">{direct.description}</p>
                    <div className="py-2">
                       <span className="text-5xl font-extrabold text-foreground tracking-tight">{direct.count}</span>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-xs uppercase tracking-widest px-3 py-1">
                       {direct.subtitle}
                    </Badge>
                 </CardContent>
              </Card>
           </div>
        </section>

        <hr className="border-border/50 mb-20" />

        {/* CTA Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white text-center py-16 px-6">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}></div>
           {editMode && (
              <div className="absolute top-4 right-4">
                 <Button variant="secondary" size="sm" onClick={() => handleEdit('cta')} className="shadow-lg">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit CTA
                 </Button>
              </div>
           )}

           <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                 <Users className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                {cta.title}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed whitespace-pre-line">
                {cta.subtitle}
              </p>
              <Button asChild align="center" size="lg" className="bg-white text-navy hover:bg-white/90 shadow-glow mt-4">
                 <Link to={cta.buttonLink || '/contact'}>{cta.buttonText}</Link>
              </Button>
           </div>
        </section>

      </div>

      <EditModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        onSave={handleSave}
        title={modalData?.title}
        fields={modalData?.fields}
        initialData={modalData?.initialData}
      />
    </main>
  );
};

export default Workforce;
