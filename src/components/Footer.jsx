import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Zap, Linkedin, Twitter, Edit2 } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EditModal from './EditModal';

const Footer = () => {
  const { isAdmin, token } = useAuth();
  const [footerData, setFooterData] = useState({
    logo: '/logo.jpeg',
    brandName: 'KUNAL',
    companyName: 'Kunal Global Fabtech Pvt. Ltd.',
    address: 'Arazi 74, Plot No. 4, Hassanpur, Maswanpur, Kalyanpur, Kanpur, U.P. – 208019',
    mailLoginText: 'Mail Login',
    contactInfo: {
      phone1: '+91 98717 97888',
      phone2: '0512-3154971',
      email: 'info@kunalfabtech.com',
      socialHandle: '@kunalfabtech'
    },
    copyrightText: '© 2025 Kunal Global Fabtech Pvt. Ltd.',
    designedByText: 'Avyukt Core Technology',
    designedByLink: '#'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const data = await api.getLayoutData();
      if (data && data.footer) {
        setFooterData(data.footer);
      }
    } catch (err) {
      console.error('Error fetching footer data:', err);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await api.updateLayoutData({ footer: updatedData }, token);
      setFooterData(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating footer:', err);
      alert('Failed to update footer');
    }
  };

  return (
    <footer className="bg-navy text-white border-t border-white/10 relative">
      <div className="container mx-auto px-4 py-12">
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            title="Edit Footer"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* If logo is an image, display it, else fallback to icon */}
              {footerData.logo ? (
                 <img src={footerData.logo} alt="Logo" className="w-10 h-10 object-contain bg-white rounded-md p-1" />
              ) : (
                <Zap className="w-8 h-8 text-primary" />
              )}
              <div>
                <h3 className="font-heading text-xl font-bold">{footerData.brandName}</h3>
                <p className="text-sm text-white/70">{footerData.companyName}</p>
              </div>
            </div>
            <p className="text-white/80 mb-4 text-sm leading-relaxed">
              {footerData.address}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-white/80 hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/ehs" className="text-white/80 hover:text-primary transition-colors">EHS</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
             <li><Link to="/resources" className="text-white/80 hover:text-primary transition-colors">Tools & Machinery</Link></li>
             <li><Link to="/workforce" className="text-white/80 hover:text-primary transition-colors">Workforce</Link></li>
             <li><Link to="/gallery" className="text-white/80 hover:text-primary transition-colors">Project Gallery</Link></li>
             <li><Link to="/career" className="text-white/80 hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white/80 text-sm">{footerData.contactInfo.phone1}</span>
                  {footerData.contactInfo.phone2 && (
                    <span className="text-white/80 text-sm">{footerData.contactInfo.phone2}</span>
                  )}
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${footerData.contactInfo.email}`} className="text-white/80 hover:text-primary transition-colors text-sm">
                  {footerData.contactInfo.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                 <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                 <span className="text-white/80 text-sm">Kanpur, Uttar Pradesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
          <p className="text-white/60">
            {footerData.copyrightText}
          </p>
          <div className="flex items-center gap-4">
             <span className="text-white/60">
               Designed by <a href={footerData.designedByLink} className="text-primary hover:underline">{footerData.designedByText}</a>
             </span>
             <a href="#" className="text-orange-500 hover:text-orange-400 font-medium">
               {footerData.mailLoginText}
             </a>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          title="Edit Footer"
          initialData={footerData}
          fields={[
            { name: 'logo', label: 'Logo URL', type: 'image' },
            { name: 'brandName', label: 'Brand Name', type: 'text' },
            { name: 'companyName', label: 'Company Name', type: 'text' },
            { name: 'address', label: 'Address', type: 'textarea' },
            { name: 'mailLoginText', label: 'Mail Login Text', type: 'text' },
            { name: 'copyrightText', label: 'Copyright Text', type: 'text' },
            { name: 'designedByText', label: 'Designed By Text', type: 'text' },
            { name: 'designedByLink', label: 'Designed By Link', type: 'text' },
            {
              name: 'contactInfo',
              label: 'Contact Info',
              type: 'object',
              subFields: [
                { name: 'phone1', label: 'Phone 1', type: 'text' },
                { name: 'phone2', label: 'Phone 2', type: 'text' },
                { name: 'email', label: 'Email', type: 'text' },
                { name: 'socialHandle', label: 'Social Handle', type: 'text' }
              ]
            }
          ]}
        />
      )}
    </footer>
  );
};

export default Footer;
