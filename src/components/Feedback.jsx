import React, { useState } from 'react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { Mail, MessageSquare, User, Briefcase, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Feedback = () => {
  const [form, setForm] = useState({
    name: '',
    employeeCode: '',
    department: '',
    email: '',
    concernTypes: [],
    otherConcern: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (value, checked) => {
    if (checked) {
      setForm(prev => ({ ...prev, concernTypes: [...prev.concernTypes, value] }));
    } else {
      setForm(prev => ({ ...prev, concernTypes: prev.concernTypes.filter(type => type !== value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.name || form.concernTypes.length === 0 || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);

    const templateParams = {
      name: form.name,
      employeeCode: form.employeeCode,
      department: form.department,
      email: form.email,
      concernTypes: form.concernTypes.join(', '),
      otherConcern: form.otherConcern,
      message: form.message,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success('Feedback sent successfully!');
      setForm({ 
        name: '', 
        employeeCode: '', 
        department: '', 
        email: '', 
        concernTypes: [], 
        otherConcern: '', 
        message: '' 
      });

    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const concernOptions = [
    'Violation of Company Policy',
    'Violation in Site Execution / FQP / EHS',
    'Fraud / Financial Misconduct',
    'Workplace Harassment / Discrimination',
    'Safety & Security Concern',
    'Legal / Regulatory Non-Compliance'
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto">
           <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 text-primary">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Internal Feedback / Grievance</h1>
              <p className="text-muted-foreground">
                We value your input. Please report any concerns or suggestions. Reports may remain anonymous if desired, though providing contact info helps us follow up.
              </p>
           </div>

           <Card className="border-none shadow-2xl">
              <CardHeader>
                 <CardTitle>Reporter's Information</CardTitle>
                 <CardDescription>Confidential Submission</CardDescription>
              </CardHeader>
              <CardContent>
                 <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                             <User className="w-4 h-4 text-muted-foreground" /> Name
                          </label>
                          <Input
                             name="name"
                             value={form.name}
                             onChange={handleChange}
                             placeholder="Enter your name"
                             className="bg-secondary/20"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                             <Briefcase className="w-4 h-4 text-muted-foreground" /> Employee Code
                          </label>
                          <Input
                             name="employeeCode"
                             value={form.employeeCode}
                             onChange={handleChange}
                             placeholder="E.g. EMP123"
                             className="bg-secondary/20"
                          />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                             <Briefcase className="w-4 h-4 text-muted-foreground" /> Department/Location
                          </label>
                          <Input
                             name="department"
                             value={form.department}
                             onChange={handleChange}
                             placeholder="E.g. Site A, Team B"
                             className="bg-secondary/20"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                             <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                          </label>
                          <Input
                             type="email"
                             name="email"
                             value={form.email}
                             onChange={handleChange}
                             placeholder="For follow-up"
                             required
                             className="bg-secondary/20"
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-sm font-medium block">Nature of Concern</label>
                       <div className="grid md:grid-cols-2 gap-3">
                          {concernOptions.map((concern) => (
                             <div key={concern} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                                <Checkbox 
                                  id={concern} 
                                  checked={form.concernTypes.includes(concern)}
                                  onCheckedChange={(checked) => handleCheckboxChange(concern, checked)}
                                />
                                <label
                                  htmlFor={concern}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {concern}
                                </label>
                             </div>
                          ))}
                          <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-secondary/30 transition-colors md:col-span-2">
                             <Checkbox 
                               id="Other"
                               checked={form.concernTypes.includes('Other')}
                               onCheckedChange={(checked) => handleCheckboxChange('Other', checked)}
                             />
                             <span className="text-sm font-medium whitespace-nowrap">Other:</span>
                             <Input 
                               name="otherConcern"
                               value={form.otherConcern}
                               onChange={handleChange}
                               className="h-8 py-1 bg-transparent border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 shadow-none placeholder:text-muted-foreground/50"
                               placeholder="Please specify"
                               disabled={!form.concernTypes.includes('Other')}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-sm font-medium">Details of Report</label>
                       <Textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={6}
                          required
                          className="bg-secondary/20 resize-none"
                          placeholder="Please describe the issue clearly, including dates and persons involved..."
                       />
                    </div>

                    <Button type="submit" size="lg" className="w-full shadow-glow font-bold text-lg" disabled={loading}>
                       {loading ? 'Sending Report...' : <span className="flex items-center gap-2"><Send className="w-5 h-5" /> Submit Report</span>}
                    </Button>

                 </form>
              </CardContent>
           </Card>

           <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Your report helps us maintain a safe and compliant workplace.</p>
           </div>
        </div>

      </div>
    </main>
  );
};

export default Feedback;
