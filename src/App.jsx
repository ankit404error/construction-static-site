import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from './components/Footer';
import About from './components/About';
import Mission from './components/Mission';
import Management from './components/Management';
import Gallery from './components/Gallery';
import EHS from './components/EHS';
import Certificates from './components/Certificates';
import Project from './components/Project';
import Service from './components/Service';
import Plant from './components/Plant';
import Resources from './components/Resources';
import Contact from './components/Contact';
import Career from './components/Career';
import Quote from './components/Quote';
import Workforce from './components/Workforce';
import Feedback from './components/Feedback';
// AuthContext removed

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-root min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 app-content pt-20 pb-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/management" element={<Management />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/ehs" element={<EHS />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/services" element={<Service />} />
          <Route path="/plant" element={<Plant />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

