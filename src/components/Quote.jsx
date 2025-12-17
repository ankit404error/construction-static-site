import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send, Phone, Mail, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const services = [
  'FGD (Flue Gas Desulfurization)',
  'Mechanical Work',
  'Electrical Work',
  'Civil Work',
  'Commissioning',
  'Other',
];

const Quote = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (value) => {
    setForm({ ...form, service: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.service || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    toast.success('Quote request submitted successfully! We will contact you shortly.');
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-left">
               <div>
                  <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
                    GET STARTED
                  </div>
                  <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Request a Quote</h1>
                  <p className="text-xl text-muted-foreground">
                    Ready to start your next project? Tell us about your requirements and our team of experts will get back to you with a comprehensive proposal.
                  </p>
               </div>

               <div className="grid sm:grid-cols-2 gap-6">
                  <Card className="bg-secondary/30 border-none">
                     <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Phone className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-bold text-foreground">Direct Call</p>
                           <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                        </div>
                     </CardContent>
                  </Card>
                  <Card className="bg-secondary/30 border-none">
                     <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Mail className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-bold text-foreground">Email Us</p>
                           <p className="text-sm text-muted-foreground">quotes@company.com</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>

            {/* Right Form */}
            <Card className="border-none shadow-2xl animate-fade-in-right relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
               <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">Project Details</CardTitle>
                  <CardDescription>Fill out the form below to receive a custom quote.</CardDescription>
               </CardHeader>
               <CardContent className="pt-6">
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-secondary/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="bg-secondary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          required
                          className="bg-secondary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Service Required</label>
                      <Select onValueChange={handleSelectChange} value={form.service}>
                        <SelectTrigger className="bg-secondary/20">
                          <SelectValue placeholder="Select a service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Project Description</label>
                      <Textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about the scope, timeline, and location..."
                        required
                        className="bg-secondary/20 resize-none"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full shadow-glow text-lg font-bold" disabled={loading}>
                      {loading ? 'Submitting...' : <span className="flex items-center gap-2"><FileText className="w-5 h-5" /> Request Quote</span>}
                    </Button>
                  </form>
               </CardContent>
            </Card>

        </div>
      </div>
    </main>
  );
};

export default Quote;