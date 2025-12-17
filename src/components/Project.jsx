import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EditModal from './EditModal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Zap, TrendingUp, Edit3, Briefcase, CheckCircle2, Activity } from "lucide-react";

/**
 * Helper to determine project status color
 */
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "running": return "bg-orange-500 hover:bg-orange-600";
    case "completed": return "bg-green-600 hover:bg-green-700";
    default: return "bg-gray-500";
  }
};

const Project = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get('type'); // 'running' | 'completed' | null
  
  const { isAdmin, token } = useAuth();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [modalData, setModalData] = useState(null);

  const fetchProjectData = async () => {
    try {
      const data = await api.getProjectPageData();
      setProjectData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleEdit = () => {
    setEditingSection('projects');
    setModalData({
      title: 'Edit Projects',
      initialData: { projects: projectData.projects },
      fields: [
        {
          name: 'projects',
          label: 'Projects',
          type: 'array',
          subFields: [
            { name: 'title', placeholder: 'Project Title' },
            { name: 'company', placeholder: 'Company' },
            { name: 'client', placeholder: 'Client' },
            { name: 'year', placeholder: 'Year' },
            { name: 'nature', placeholder: 'Nature of Work' },
            { name: 'image', placeholder: 'Image URL', type: 'image' },
            /* NEW: Progress field */
            { name: 'progress', placeholder: 'Progress (%)', type: 'number' },
            {
              name: 'status',
              placeholder: 'Status',
              type: 'select',
              options: ['running', 'completed'],
              defaultValue: 'completed'
            }
          ]
        }
      ]
    });
  };

  const handleSave = async (updatedData) => {
    try {
      await api.updateProjectPageData(updatedData, token);
      await fetchProjectData();
      setEditingSection(null);
      setModalData(null);
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Update failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!projectData || !projectData.projects) return null;

  const projects = projectData.projects;

  // Filter based on URL param or show all if editing
  const filteredProjects = editMode
    ? projects
    : projects.filter((p) => {
        if (!type) return true;
        return (p.status || 'completed') === type;
      });

  // Calculate Stats
  const totalProjects = projects.length;
  const runningCount = projects.filter(p => p.status === 'running').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const avgProgress = runningCount > 0 
    ? Math.round(projects.filter(p => p.status === 'running').reduce((acc, curr) => acc + (curr.progress || 0), 0) / runningCount) 
    : 0;

  const pageTitle = type === 'running' ? 'Running Projects' : type === 'completed' ? 'Completed Projects' : 'All Projects';

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      
      {/* ADMIN CONTROLS */}
      {isAdmin && (
        <div className="fixed top-24 left-4 z-50 flex gap-2">
          <Button 
            variant={editMode ? "destructive" : "secondary"}
            onClick={() => setEditMode(!editMode)}
            className="shadow-xl"
          >
            {editMode ? "Exit Edit Mode" : "Enable Edit Mode"}
          </Button>
          {editMode && (
             <Button onClick={handleEdit} className="shadow-xl">
               <Edit3 className="w-4 h-4 mr-2" /> Manage Projects
             </Button>
          )}
        </div>
      )}

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {pageTitle}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Delivering excellence in power infrastructure across the nation.
          </p>
        </div>

        {/* Stats Summary (Show only on All or Running view typically, or always) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-heading font-bold mb-2">{totalProjects}</div>
              <div className="text-sm opacity-90">Total Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500 text-white border-none">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-heading font-bold mb-2">{runningCount}</div>
              <div className="text-sm opacity-90">Running</div>
            </CardContent>
          </Card>
          <Card className="bg-green-600 text-white border-none">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-heading font-bold mb-2">{completedCount}</div>
              <div className="text-sm opacity-90">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-navy text-white border-none">
            <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
              <div className="text-3xl font-heading font-bold mb-2">{avgProgress}%</div>
              <div className="text-sm opacity-90">Avg Progress (Running)</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              key={index}
              className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-default"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = '/image1.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                   {project.company && (
                     <Badge variant="secondary" className="backdrop-blur-md bg-white/20 text-white border-none">
                       {project.company}
                     </Badge>
                   )}
                   <Badge className={`${getStatusColor(project.status)} text-white border-none capitalization`}>
                     {project.status}
                   </Badge>
                </div>

                {/* Progress Bar (Only for running projects usually, or all if desired) */}
                {project.status === 'running' && (
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-sm font-medium">Project Progress</span>
                       <span className="text-sm font-bold">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    {project.client && (
                       <p className="text-sm text-muted-foreground">
                         <span className="font-semibold text-foreground">Client:</span> {project.client}
                       </p>
                    )}
                  </div>
                  {project.year && (
                    <div className="flex items-center text-muted-foreground text-sm whitespace-nowrap bg-secondary px-2 py-1 rounded">
                      <Calendar className="w-3 h-3 mr-1" /> {project.year}
                    </div>
                  )}
                </div>

                {project.nature && (
                   <div className="mt-4 pt-4 border-t border-border">
                     <p className="text-sm font-semibold text-muted-foreground mb-1">Nature of Work</p>
                     <p className="text-sm text-foreground">{project.nature}</p>
                   </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border text-muted-foreground">
             <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p className="text-lg">No projects found in this category.</p>
          </div>
        )}

      </div>

      <EditModal
        isOpen={!!editingSection}
        onClose={() => {
          setEditingSection(null);
          setModalData(null);
        }}
        onSave={handleSave}
        title={modalData?.title}
        fields={modalData?.fields || []}
        initialData={modalData?.initialData}
      />
    </main>
  );
};

export default Project;
