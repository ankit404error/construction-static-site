import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Auth and Edit imports removed
import CountUp from './CountUp'; // Keeping original countup or can switch to shadcn/react-spring one
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Zap, Sun, Wind, Droplet, Layers, Users, TrendingUp, Award, Edit3 } from 'lucide-react';

const Home = () => {
  // Auth hooks removed
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const response = await api.getHomePageData();
      setHomeData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  // handleEdit and handleSave removed

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!homeData) return null;

  const { hero, clientLogos, stats, features, companyInfo, cta } = homeData;

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      
      {/* Admin Quick Controls */}
      {/* Admin Quick Controls removed */}

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero.backgroundImage || "/hero-placeholder.jpg"}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="max-w-4xl animate-fade-in">
             <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full mb-6">
               <span className="text-primary font-semibold tracking-wide uppercase text-sm">ISO 9001:2015 Costruction Company</span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
               {hero.title || "Building the Future"}
             </h1>
             
             <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl">
               {hero.subtitle}
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4">
               <Button asChild size="lg" className="h-14 text-lg shadow-glow">
                 <Link to="/contact">{hero.buttonText}</Link>
               </Button>
               <Button asChild size="lg" variant="outline" className="h-14 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-navy">
                 <Link to="/projects?type=running">View Projects</Link>
               </Button>
             </div>

             {/* Edit button removed */}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>



      {/* --- MARQUEE / LOGOS SECTION --- */}
      <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
        <div className="relative w-full max-w-7xl mx-auto px-4">
          <div className="flex overflow-hidden group">
             {/* Gradient Overlays */}
             <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
             <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
             
             <div className="flex animate-marquee gap-16 items-center whitespace-nowrap py-4">
                 {/* Duplicate the logos to create seamless loop. */}
                 {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                       <img src="/image3.png" alt="Logo 3" className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                       <img src="/image4.png" alt="Logo 4" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                       <img src="/image5.png" alt="Logo 5" className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                       <img src="/image6.png" alt="Logo 6" className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                       <img src="/image7.png" alt="Logo 7" className="h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                    </React.Fragment>
                 ))}
             </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-slate-50 border-b border-border/50">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative items-center justify-items-center">
              {stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="text-center w-full max-w-[250px]">
                  <div className="text-4xl md:text-5xl font-heading font-bold text-blue-600 mb-4 tracking-tight">
                    <CountUp end={stat.value} />
                  </div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                    {stat.label}
                  </div>
                </div>
              ))}

              {/* Edit stats removed */}
           </div>
        </div>
      </section>


      {/* --- COMPANY INFO / ABOUT --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
               <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
                 <img src={companyInfo.image} alt="About" className="w-full h-auto object-cover" />
               </div>
               {/* Floating Badge */}
               <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block">
                 <div className="flex items-center gap-4">
                   <div className="bg-primary/10 p-3 rounded-full">
                     <Award className="w-8 h-8 text-primary" />
                   </div>
                   <div>
                     <div className="text-2xl font-bold text-foreground">{companyInfo.badgeValue || "25+"}</div>
                     <div className="text-sm text-muted-foreground">{companyInfo.badgeLabel || "Years Experience"}</div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="lg:w-1/2">
               <div className="flex items-center gap-3 mb-6">
                 <img src={companyInfo.logo} alt="Logo" className="w-12 h-12 object-contain" />
                 <h4 className="font-heading text-xl font-bold text-foreground">{companyInfo.brandName}</h4>
               </div>
               
               <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-navy">
                 {companyInfo.companyName}
               </h2>
               
               <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                 {companyInfo.description}
               </p>
               
               <Button asChild size="lg" className="shadow-lg">
                 <Link to="/about">{companyInfo.buttonText}</Link>
               </Button>
            </div>
          </div>
          
          {/* Edit Company Info removed */}
        </div>
      </section>


      {/* --- FEATURES / CAPABILITIES --- */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-16 relative">
             <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">{features.title}</h2>
             <Link to="/services" className="text-primary hover:text-accent font-medium inline-flex items-center gap-1">
               {features.linkText} <ChevronRight className="w-4 h-4" />
             </Link>
             
             {/* Edit Features removed */}
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {features.cards.map((card, idx) => (
               <Card key={idx} className="group hover:-translate-y-2 transition-all duration-300 border-none shadow-lg hover:shadow-2xl overflow-hidden">
                 <CardContent className="p-8">
                   <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                     {/* Dynamic Icon Mapping based on index or title could go here, defaulting to Layers for now */}
                     <Layers className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                   </div>
                   <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">{card.title}</h3>
                   <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>
      </section>


      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400 text-white">
        {/* Plus Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V16M8 12H16' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              So, What are You Waiting For?<br className="hidden md:block"/> Let's Talk About Your Project!
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Get in touch with us, share your aspirations, and watch as together we craft a journey where your dreams truly take flight.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-slate-100 font-bold border-none">
                <Link to="/contact">Request Proposal</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-600 transition-all">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>

            {/* Edit CTA removed */}
        </div>
      </section>

      {/* --- EDIT MODAL WRAPPER --- */}
      {/* Edit wrapper removed */}
    </main>
  );
};

export default Home;
