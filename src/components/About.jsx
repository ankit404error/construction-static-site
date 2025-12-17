import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Headset, ShieldCheck, ChevronRight, Award, Users, Target, Image, Edit3 } from 'lucide-react';
import api from '../services/api';
// Auth and Edit imports removed
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CountUp from './CountUp';

const About = () => {
  // Auth hooks removed
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAboutData = async () => {
    try {
      const data = await api.getAboutPageData();
      setAboutData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError('Failed to load content');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // handleEdit and handleSave removed

  // Icon mapping helper with updated Lucide icons
  const getIcon = (iconName) => {
    const icons = {
      'AiOutlineTrophy': Trophy,
      'MdSupportAgent': Headset,
      'BsShieldCheck': ShieldCheck,
      'Trophy': Trophy,
      'Headset': Headset,
      'ShieldCheck': ShieldCheck
    };
    return icons[iconName] || Trophy;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!aboutData) return null;

  const { hero, companyInfo, stats, bestThing, cta } = aboutData;

  return (
    <main className="min-h-screen bg-background relative">
      {/* Admin Controls */}
      {/* Admin Controls removed */}

      {/* --- HERO SECTION --- */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/aboutus.mp4" type="video/mp4" />
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${hero.backgroundImage})` }}
          />
        </video>
        <div className="absolute inset-0 bg-navy/80 mix-blend-multiply z-0"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
           <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="inline-block px-4 py-1 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-6">
               <span className="text-sm font-medium tracking-wide">ABOUT US</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
               {hero.title}
             </h1>
             <p className="text-xl text-white/90 font-light mb-8 max-w-2xl mx-auto">
               {hero.subtitle}
             </p>
             <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
               {hero.description}
             </p>

             {/* Edit button removed */}
           </div>
        </div>
      </section>


      {/* --- COMPANY INFO --- */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-4">
           <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">{companyInfo.title}</h2>
                   <div className="h-1 w-20 bg-primary rounded-full"></div>
                </div>
                {/* Edit button removed */}
              </div>
              
              <div className="prose prose-lg text-muted-foreground max-w-none w-full">
                 <p className="font-medium text-foreground text-xl leading-relaxed mb-8">
                   {companyInfo.subtitle}
                 </p>
                 {companyInfo.description1 && <p>{companyInfo.description1}</p>}
                 {companyInfo.description2 && <p>{companyInfo.description2}</p>}
                 {companyInfo.description3 && <p>{companyInfo.description3}</p>}
                 
                 {companyInfo.listItems && companyInfo.listItems.length > 0 && (
                   <div className="grid md:grid-cols-2 gap-4 my-8"> 
                     {companyInfo.listItems.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-foreground font-medium">{item}</span>
                       </div>
                     ))}
                   </div>
                 )}

                 {companyInfo.description4 && <p>{companyInfo.description4}</p>}
                 
                 <div className="mt-8 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                   <p className="italic text-foreground font-medium">
                     {companyInfo.closingText}
                   </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="py-24 bg-slate-50 border-b border-border/50 relative">
        <div className="container mx-auto px-4 relative z-10">
           {/* Edit stats removed */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative items-center justify-items-center">
              {stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="text-center w-full max-w-[250px]">
                   <div className="text-4xl md:text-5xl font-heading font-bold text-blue-600 mb-4 tracking-tight">
                     <CountUp end={stat.value} />
                   </div>
                   <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- BEST THING --- */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-16 relative">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{bestThing.title}</h2>
              <p className="text-muted-foreground text-lg">{bestThing.description}</p>
              
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {bestThing.cards.map((card, idx) => {
                const Icon = getIcon(card.icon);
                return (
                  <Card key={idx} className="text-center border-none shadow-lg hover:-translate-y-1 transition-transform duration-300">
                    <CardContent className="pt-8 pb-8 px-6">
                       <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                         <Icon className="w-8 h-8" />
                       </div>
                       <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    </CardContent>
                  </Card>
                );
              })}
           </div>
        </div>
      </section>

      {/* --- QUICK LINKS (Static) --- */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/mission" className="group p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                 <Target className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                 <h3 className="text-xl font-bold">Vision & Mission</h3>
              </Link>
              <Link to="/management" className="group p-6 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                 <Users className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                 <h3 className="text-xl font-bold">Our Team</h3>
              </Link>
              <Link to="/gallery" className="group p-6 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-500 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                 <Image className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                 <h3 className="text-xl font-bold">Gallery</h3>
              </Link>
              <Link to="/ehs" className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                 <ShieldCheck className="w-8 h-8 mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                 <h3 className="text-xl font-bold">EHS Policy</h3>
              </Link>
           </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white">
        {/* Plus Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}></div>
        
         <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">{cta.title}</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">{cta.description}</p>
            <Button asChild size="lg" className="shadow-glow bg-white text-blue-600 hover:bg-slate-100 border-none">
              <Link to="/contact">{cta.buttonText}</Link>
            </Button>

         </div>
      </section>
    </main>
  );
};

export default About;