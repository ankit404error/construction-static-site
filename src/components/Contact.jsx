import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Edit2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const { isAdmin, token } = useAuth();
  
  const [contactData, setContactData] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formLoading, setFormLoading] = useState(false);

  // Fetch Page Data
  const fetchContactData = async () => {
    try {
      const data = await api.getContactPageData();
      setContactData(data);
    } catch (err) {
      console.error('Error fetching contact data:', err);
      toast.error('Failed to load page content');
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // Handle Edit Click
  const handleEdit = (section) => {
    setEditingSection(section);
    let initialData = {};
    let fields = [];

    if (section === 'hero') {
      initialData = contactData.hero;
      fields = [
        { name: 'title', label: 'Hero Title', type: 'text' },
        { name: 'description', label: 'Hero Description', type: 'textarea' }
      ];
    } else if (section === 'contactInfo') {
      initialData = contactData.contactInfo;
      fields = [
        { name: 'phone1', label: 'Primary Phone', type: 'text' },
        { name: 'phone2', label: 'Secondary Phone', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'address', label: 'Registered Office', type: 'textarea' },
        { name: 'regionalOffice', label: 'Regional Office', type: 'textarea' }
      ];
    }

    setModalData({
      title: `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`,
      fields,
      initialData
    });
  };

  // Handle Save
  const handleSave = async (updatedData) => {
    try {
      // Merge with existing data structure
      const fullUpdate = { ...contactData, [editingSection]: updatedData };
      
      const response = await api.updateContactPageData(fullUpdate, token);
      setContactData(response);
      setEditingSection(null);
      setModalData(null);
      toast.success('Content updated successfully');
    } catch (err) {
      console.error('Error updating data:', err);
      toast.error('Failed to update content');
    }
  };

  // Form Handling
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We will get back to you soon.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setFormLoading(false);
  };

  if (loadingConfig) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!contactData) return null;

  const { hero, contactInfo } = contactData;

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 relative">
      
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-24 left-4 z-50">
          <Button 
            variant={editMode ? "destructive" : "secondary"}
            onClick={() => setEditMode(!editMode)}
            className="shadow-xl"
          >
            {editMode ? "Exit Edit Mode" : "Enable Edit Mode"}
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in relative group">
          {editMode && (
             <div className="absolute top-0 right-0">
               <Button size="sm" variant="ghost" onClick={() => handleEdit('hero')}>
                 <Edit3 className="w-4 h-4 text-primary" />
               </Button>
             </div>
          )}
          <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
            CONTACT US
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{hero.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {hero.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1 relative group">
            
            {editMode && (
               <div className="absolute top-[-40px] right-0">
                 <Button size="sm" variant="ghost" onClick={() => handleEdit('contactInfo')}>
                   <Edit3 className="w-4 h-4 text-primary" /> Edit Info
                 </Button>
               </div>
            )}

            <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform cursor-default bg-navy text-white">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone</h3>
                  <p className="text-white/80 text-sm font-mono">{contactInfo.phone1}</p>
                  {contactInfo.phone2 && <p className="text-white/80 text-sm font-mono">{contactInfo.phone2}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform cursor-default">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors text-sm break-all">
                    {contactInfo.email}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform cursor-default">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Registered Office</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {contactInfo.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {contactInfo.regionalOffice && (
              <Card className="border-none shadow-lg hover:-translate-y-1 transition-transform cursor-default">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Regional Office</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {contactInfo.regionalOffice}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl overflow-hidden">
               <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
               <CardContent className="p-8">
                 <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-foreground">Full Name</label>
                       <Input 
                         name="name" 
                         value={form.name} 
                         onChange={handleChange} 
                         placeholder="Enter your name" 
                         required 
                         className="h-12 bg-secondary/30"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-foreground">Email Address</label>
                       <Input 
                         name="email" 
                         type="email"
                         value={form.email} 
                         onChange={handleChange} 
                         placeholder="Enter your email" 
                         required 
                         className="h-12 bg-secondary/30"
                       />
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-foreground">Phone Number</label>
                       <Input 
                         name="phone" 
                         type="tel"
                         value={form.phone} 
                         onChange={handleChange} 
                         placeholder="Enter your phone number" 
                         required 
                         className="h-12 bg-secondary/30"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-foreground">Subject</label>
                       <Input 
                         name="subject" 
                         value={form.subject} 
                         onChange={handleChange} 
                         placeholder="Inquiry about..." 
                         required 
                         className="h-12 bg-secondary/30"
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-medium text-foreground">Message</label>
                     <Textarea 
                       name="message" 
                       value={form.message} 
                       onChange={handleChange} 
                       placeholder="How can we help you?" 
                       required 
                       className="min-h-[150px] bg-secondary/30 resize-y"
                     />
                   </div>

                   <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px] h-12 shadow-glow" disabled={formLoading}>
                     {formLoading ? (
                       <span className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Sending...
                       </span>
                     ) : (
                       <span className="flex items-center gap-2">
                         <Send className="w-4 h-4" /> Send Message
                       </span>
                     )}
                   </Button>
                 </form>
               </CardContent>
            </Card>
          </div>
        </div>
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

export default Contact;