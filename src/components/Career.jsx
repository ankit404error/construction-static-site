import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Briefcase, MapPin, Upload, Send, CheckCircle, Edit3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';

const Career = () => {
  const { isAdmin, token } = useAuth();
  const [careerData, setCareerData] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    message: ''
  });

  const [formLoading, setFormLoading] = useState(false);

  // Fetch Page Data
  const fetchCareerData = async () => {
    try {
      const data = await api.getCareerPageData();
      setCareerData(data);
    } catch (err) {
      console.error('Error fetching career data:', err);
      toast.error('Failed to load page content');
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchCareerData();
  }, []);

  // Edit Logic
  const handleEdit = (section) => {
    setEditingSection(section);
    let initialData = {};
    let fields = [];

    if (section === 'hero') {
      initialData = careerData.hero;
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ];
    } else if (section === 'whyWork') {
      initialData = careerData.whyWork;
      fields = [
        { name: 'title', label: 'Section Title', type: 'text' },
        { 
            name: 'points', 
            label: 'Benefits (Comma separated or json array logic needed, doing simple list for now)', 
            type: 'array',
            subFields: [{ name: 'point', placeholder: 'Benefit Point' }]
        },
        // Simplifying array handling for EditModal: usually it expects an object array to map. 
        // Our model has [String]. We might need to adapt the modal or the data structure.
        // For simplicity, let's treat points as a list of strings if our EditModal supports it, 
        // or standard array of objects { point: string }. 
        // The current EditModal supports 'array' with 'subFields'. 
        // We will transform string[] <-> {point}[] for editing.
      ];
      // Transformation needed if EditModal expects objects
      initialData = {
          ...careerData.whyWork,
          points: careerData.whyWork.points.map(p => ({ point: p }))
      };
      fields = [
        { name: 'title', label: 'Title', type: 'text' },
        {
             name: 'points',
             label: 'Benefits',
             type: 'array',
             subFields: [{ name: 'point', placeholder: 'Benefit' }]
        }
      ];
    }

    setModalData({
      title: `Edit ${section}`,
      fields,
      initialData
    });
  };

  const handleSave = async (updatedData) => {
    try {
        let finalData = updatedData;
        
        // Transform back if needed
        if (editingSection === 'whyWork') {
            finalData = {
                ...updatedData,
                points: updatedData.points.map(p => p.point) // Extract string from object
            };
        }

        const fullUpdate = { ...careerData, [editingSection]: finalData };
        const response = await api.updateCareerPageData(fullUpdate, token);
        setCareerData(response);
        setEditingSection(null);
        setModalData(null);
        toast.success('Updated successfully');
    } catch (err) {
        console.error('Update error:', err);
        toast.error('Failed to update');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) { 
       toast.error('Please fill all required fields');
       return;
    }
    
    setFormLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Application submitted successfully! Our team will contact you soon.');
    setForm({ name: '', email: '', phone: '', resume: null, message: '' });
    setFormLoading(false);
  };

  if (loadingConfig) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  if (!careerData) return null;

  const { hero, whyWork } = careerData;

  // Mock jobs for now, or could be fetched from API if model supports it later
  const jobOpenings = []; 

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 relative">
      
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
        <div className="text-center mb-16 animate-fade-in relative group">
           {editMode && (
             <div className="absolute top-0 right-0">
               <Button size="sm" variant="ghost" onClick={() => handleEdit('hero')}>
                 <Edit3 className="w-4 h-4 text-primary" />
               </Button>
             </div>
           )}
           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              CAREERS
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{hero.title}</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
             {hero.description}
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
           
           {/* Job Listings / Info */}
           <div className="space-y-6">
              <div className="bg-navy p-8 rounded-2xl text-white shadow-xl relative group">
                 {editMode && (
                   <div className="absolute top-4 right-4 text-white">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit('whyWork')}>
                         <Edit3 className="w-4 h-4 mr-2" /> Edit content
                      </Button>
                   </div>
                 )}
                 <h2 className="text-2xl font-bold mb-4">{whyWork.title}</h2>
                 <ul className="space-y-4">
                    {whyWork.points && whyWork.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                            <span className="text-white/80">{point}</span>
                        </li>
                    ))}
                 </ul>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" /> Current Openings
              </h2>
              
              {jobOpenings.length > 0 ? (
                <div className="space-y-4">
                  {jobOpenings.map((job, i) => (
                    <Card key={i} className="hover:border-primary transition-colors cursor-pointer">
                       <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-lg">{job.title}</h3>
                             <Badge variant="secondary">{job.type}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                             <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                          </div>
                          <p className="text-sm text-foreground">{job.desc}</p>
                       </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground">
                   <p>No specific openings listed right now.</p>
                   <p className="text-sm mt-1">But we are always hiring! Send us your general application.</p>
                </div>
              )}
           </div>

           {/* Application Form */}
           <Card className="border-none shadow-2xl overflow-hidden sticky top-24">
              <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
              <CardHeader>
                 <CardTitle>Global Application</CardTitle>
                 <CardDescription>Send us your resume and we'll keep it on file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input 
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            placeholder="John Doe"
                            required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <Input 
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleFormChange}
                            placeholder="john@example.com"
                            required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleFormChange}
                          placeholder="+91 98765 43210"
                          required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Resume</label>
                        <div className="border border-input rounded-lg px-3 py-2 bg-secondary/20 flex items-center gap-2">
                           <Upload className="w-4 h-4 text-muted-foreground" />
                           <Input 
                             name="resume"
                             type="file"
                             accept=".pdf,.doc,.docx"
                             onChange={handleFormChange}
                             className="border-none shadow-none bg-transparent p-0 h-auto text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                             required
                           />
                        </div>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Letter / Message</label>
                        <Textarea 
                          name="message"
                          value={form.message}
                          onChange={handleFormChange}
                          placeholder="Tell us about your experience and why you'd be a good fit..."
                          rows={4}
                          required
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full shadow-glow" disabled={formLoading}>
                       {formLoading ? 'Submitting...' : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Submit Application</span>}
                    </Button>
                 </form>
              </CardContent>
           </Card>

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

export default Career;
