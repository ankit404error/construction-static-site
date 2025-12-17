import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, ChevronRight, Edit3 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Resources = () => {
  const [resourcesData, setResourcesData] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { isAdmin, token } = useAuth();

  const fetchResourcesData = async () => {
    try {
      const data = await api.getResourcesPageData();
      setResourcesData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching resources data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourcesData();
  }, []);

  const handleEdit = (section) => {
    let fields = [];
    let initialData = {};
    let title = '';

    if (section === 'items') {
      title = 'Edit Resources List';
      initialData = { items: resourcesData.items };
      fields = [
        {
          name: 'items',
          label: 'Resources',
          type: 'array',
          subFields: [
            { name: 'name', placeholder: 'Name' },
            { name: 'type', placeholder: 'Type (TOOL/EQUIPMENT)' },
            { name: 'quantity', placeholder: 'Quantity', type: 'number' },
            { name: 'image', placeholder: 'Image URL' }
          ]
        }
      ];
    } else if (section === 'cta') {
      title = 'Edit CTA Section';
      initialData = resourcesData.cta;
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
      let newData = { ...resourcesData };
      if (modalData.section === 'items') {
        newData.items = updatedData.items;
      } else if (modalData.section === 'cta') {
        newData.cta = updatedData;
      }

      await api.updateResourcesPageData(newData, token);
      setResourcesData(newData);
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
  if (!resourcesData) return null;

  const { items, cta } = resourcesData;

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="text-center mb-12 animate-fade-in relative">
           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              CAPABILITIES
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Equipment & Resources</h1>
           
           <div className="max-w-md mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search resources..."
                className="pl-10 h-12 rounded-full border-2 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/50 shadow-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Resources Grid */}
        <div className="relative mb-20">
           {editMode && (
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleEdit('items')} className="shadow-lg">
                   <Edit3 className="w-4 h-4 mr-2" /> Edit Resources
                </Button>
              </div>
           )}

           <div className="grid grid-cols-1 gap-3">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                   <p className="text-xl">No matching resources found</p>
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-none shadow-sm group">
                    <CardContent className="p-4 flex flex-row items-center gap-4 text-left">
                       <div className="h-16 w-16 shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={e => { e.target.src = 'https://via.placeholder.com/64?text=+'; }}
                          />
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-foreground leading-tight mb-1" title={item.name}>
                             {item.name}
                          </h3>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                            {item.type}
                          </div>
                       </div>

                       <div className="ml-auto text-right min-w-[80px]">
                          <div className="text-xs text-muted-foreground mb-1">Quantity</div>
                          <div className="text-xl font-bold text-foreground">
                            {item.quantity ? item.quantity.toLocaleString() : 'N/A'}
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                ))
              )}
           </div>
        </div>

        <div className="flex justify-center mb-20">
           <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg shadow-glow">
              <Link to="/contact">
                 Request Specific Equipment <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
           </Button>
        </div>

        <hr className="border-border/50 mb-20" />

        {/* CTA Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white text-center py-16 px-6">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}></div>
           {editMode && (
              <div className="absolute top-4 right-4">
                 <Button variant="secondary" size="sm" onClick={() => handleEdit('cta')}>
                    <Edit3 className="w-4 h-4 mr-2" /> Edit CTA
                 </Button>
              </div>
           )}

           <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                 <Briefcase className="w-8 h-8 text-white" />
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

export default Resources;