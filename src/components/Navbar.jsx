import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Edit2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const { isAdmin, token, logout } = useAuth();
  const location = useLocation();
  const [headerData, setHeaderData] = useState({
    logo: '/logo.jpeg',
    brandName: 'KUNAL',
    phone: '+91 8200 417 508',
    quoteButtonText: 'GET A QUOTE'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchHeaderData();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchHeaderData = async () => {
    try {
      const data = await api.getLayoutData();
      if (data && data.header) {
        setHeaderData(data.header);
      }
    } catch (err) {
      console.error('Error fetching header data:', err);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await api.updateLayoutData({ header: updatedData }, token);
      setHeaderData(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating header:', err);
      alert('Failed to update header');
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const navLinkClass = (path) => `px-3 py-2 rounded-lg font-medium transition-all ${
    location.pathname === path
      ? "text-primary"
      : "text-foreground hover:text-primary"
  }`;

  const dropdownItemClass = "block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors";

  return (
    <>
      <header 
        ref={menuRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg py-2"
            : "bg-white/50 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-lg">
                <img src={headerData.logo} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {headerData.brandName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/" className={navLinkClass("/")}>HOME</Link>

              {/* ABOUT US Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 ${navLinkClass("/about")}`}>
                  ABOUT <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl 
                              opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                              invisible group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link to="/about" className={dropdownItemClass}>About Us</Link>
                  <Link to="/mission" className={dropdownItemClass}>Vision and Mission</Link>
                  <Link to="/management" className={dropdownItemClass}>Our Team</Link>
                  <Link to="/certificates" className={dropdownItemClass}>Certificates & Recognition</Link>
                  <Link to="/gallery" className={dropdownItemClass}>Gallery</Link>
                  <Link to="/ehs" className={dropdownItemClass}>EHS</Link>
                </div>
              </div>

              <Link to="/services" className={navLinkClass("/services")}>SERVICES</Link>

              {/* PROJECTS Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 ${navLinkClass("/projects")}`}>
                  PROJECTS <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl 
                              opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                              invisible group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link to="/projects?type=running" className={dropdownItemClass}>Running Projects</Link>
                  <Link to="/projects?type=completed" className={dropdownItemClass}>Completed Projects</Link>
                </div>
              </div>

              {/* RESOURCES Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 ${navLinkClass("/resources")}`}>
                  RESOURCES <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl 
                              opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                              invisible group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link to="/resources" className={dropdownItemClass}>Tools Plants & Machinery</Link>
                  <Link to="/workforce" className={dropdownItemClass}>Workforce</Link>
                </div>
              </div>

              {/* CONTACT Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 ${navLinkClass("/contact")}`}>
                  CONTACT <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl 
                              opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                              invisible group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link to="/contact" className={dropdownItemClass}>Contact Us</Link>
                  <Link to="/career" className={dropdownItemClass}>Career</Link>
                </div>
              </div>
            </div>

            {/* CTA & Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex flex-col items-end hidden xl:flex">
                <span className="text-xs text-muted-foreground">Have any Question?</span>
                <a href={`tel:${headerData.phone.replace(/\s/g, '')}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {headerData.phone}
                </a>
              </div>
              
              <Button asChild className="shadow-glow font-bold">
                <Link to="/quote">{headerData.quoteButtonText}</Link>
              </Button>

              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full hover:bg-secondary"
                    title="Edit Header"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={logout}
                    className="shadow-md"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="lg:hidden mt-4 p-4 bg-card border border-border rounded-xl shadow-2xl animate-fade-in">
              <div className="flex flex-col space-y-2">
                <Link to="/" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>HOME</Link>
                
                <div className="border-b border-border my-2"></div>
                
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase">About</p>
                <Link to="/about" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>About Us</Link>
                <Link to="/mission" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Vision & Mission</Link>
                <Link to="/management" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Management</Link>
                <Link to="/certificates" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Certificates</Link>
                <Link to="/gallery" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Gallery</Link>
                <Link to="/ehs" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>EHS</Link>

                <div className="border-b border-border my-2"></div>

                <Link to="/services" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>SERVICES</Link>

                <div className="border-b border-border my-2"></div>

                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase">Projects</p>
                <Link to="/projects?type=running" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Running Projects</Link>
                <Link to="/projects?type=completed" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Completed Projects</Link>

                <div className="border-b border-border my-2"></div>

                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase">Resources</p>
                <Link to="/resources" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Tools & Machinery</Link>
                <Link to="/workforce" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Workforce</Link>

                <div className="border-b border-border my-2"></div>

                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase">Contact</p>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Contact Us</Link>
                <Link to="/career" onClick={() => setMenuOpen(false)} className={dropdownItemClass}>Career</Link>
                
                <Button asChild className="w-full mt-4">
                  <Link to="/quote" onClick={() => setMenuOpen(false)}>{headerData.quoteButtonText}</Link>
                </Button>
                
                {isAdmin && (
                  <Button variant="destructive" className="w-full mt-2" onClick={() => { logout(); setMenuOpen(false); }}>
                    Logout
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {isEditing && (
        <EditModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          title="Edit Header"
          initialData={headerData}
          fields={[
            { name: 'logo', label: 'Logo URL', type: 'image' },
            { name: 'brandName', label: 'Brand Name', type: 'text' },
            { name: 'phone', label: 'Phone Number', type: 'text' },
            { name: 'quoteButtonText', label: 'Quote Button Text', type: 'text' }
          ]}
        />
      )}
    </>
  );
};

export default Navbar;
