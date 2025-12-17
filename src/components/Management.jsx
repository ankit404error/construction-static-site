import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Linkedin, Mail } from 'lucide-react';
import api from '../services/api';
// Auth and Edit imports removed
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TeamMemberImage = ({ src, alt, size = "w-48 h-48" }) => {
  return (
    <div className={`relative overflow-hidden rounded-full border-4 border-white shadow-xl ${size} mx-auto mb-6 group-hover:scale-105 transition-transform duration-300`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(alt || 'User'); }}
      />
    </div>
  );
};

const Management = () => {
  // Auth hooks removed
  const [managementData, setManagementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManagementData = async () => {
    try {
      const data = await api.getManagementPageData();
      setManagementData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching management data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagementData();
  }, []);

  // handleEdit and handleSave removed

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!managementData) return null;

  const { managementTeam, leadershipTeam, cta } = managementData;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      
      {/* ADMIN CONTROLS */}
      {/* ADMIN CONTROLS removed */}

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in relative">
           <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              LEADERSHIP
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Meet Our Leaders</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             The visionaries driving innovation and excellence at every step.
           </p>
        </div>

        {/* Management Team */}
        <section className="mb-24 relative">
           {/* Edit button removed */}
           
           <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-12 flex items-center justify-center gap-4">
             <span className="h-px w-12 bg-border"></span>
             Executive Management
             <span className="h-px w-12 bg-border"></span>
           </h2>

           <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {managementTeam.map((person, index) => (
                <div key={index} className="group bg-white rounded-2xl shadow-lg border border-border p-8 text-center hover:shadow-2xl transition-all hover:-translate-y-1">
                  <TeamMemberImage src={person.img} alt={person.name} size="w-48 h-48" />
                  <h3 className="text-2xl font-bold text-navy mb-2">{person.name}</h3>
                  <p className="text-primary font-medium tracking-wide uppercase text-sm mb-4">{person.title}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-24 relative">
           {/* Edit button removed */}

           <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-12 flex items-center justify-center gap-4">
             <span className="h-px w-12 bg-border"></span>
             Leadership Team
             <span className="h-px w-12 bg-border"></span>
           </h2>

           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {leadershipTeam.map((person, index) => (
                <div key={index} className="group bg-secondary/30 rounded-xl p-6 text-center hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/20 group-hover:border-primary transition-colors">
                     <img 
                       src={person.img} 
                       alt={person.name} 
                       className="w-full h-full object-cover"
                       onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(person.name); }}
                     />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                  <p className="text-muted-foreground text-sm font-medium mb-4">{person.title}</p>
                  
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <Linkedin className="w-4 h-4 text-primary" />
                     </Button>
                     <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <Mail className="w-4 h-4 text-primary" />
                     </Button>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white text-center py-16 px-6">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}></div>
           
           <div className="relative z-10 max-w-3xl mx-auto space-y-6">
               {/* Edit CTA removed */}
              
              <h2 className="text-3xl font-heading font-bold text-white">
                {cta.title}
              </h2>
              <p className="text-lg text-white/90">
                {cta.description}
              </p>
              <Button asChild size="lg" className="shadow-lg">
                 <Link to="/contact">{cta.buttonText}</Link>
              </Button>
           </div>
        </section>

      </div>

      {/* EditModal removed */}
    </main>
  );
};

export default Management;