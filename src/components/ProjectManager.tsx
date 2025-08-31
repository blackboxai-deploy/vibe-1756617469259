"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

const API_URL = "http://localhost:4000";

interface Project {
  title: string;
  description: string;
  skills: string[] | string;
  status: 'completed' | 'in-progress' | 'planned';
  links: {
    repo?: string;
    demo?: string;
    live?: string;
  };
  startDate?: string;
  endDate?: string;
}

interface ProjectManagerProps {
  projects: any[];
  onUpdate: (projects: any[]) => void;
  editMode: boolean;
  loading: boolean;
}

export default function ProjectManager({ projects, onUpdate, editMode, loading }: ProjectManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Project>();

  const handleAddProject = () => {
    reset({
      title: '',
      description: '',
      skills: [],
      status: 'completed',
      links: {},
      startDate: '',
      endDate: ''
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (index: number) => {
    const project = projects[index];
    reset({
      title: project.title,
      description: project.description,
      skills: project.skills || [],
      status: project.status || 'completed',
      links: project.links || {},
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
    });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (index: number) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/projects/${index}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      const result = await response.json();
      onUpdate(result.projects);
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: Project) => {
    try {
      setIsSubmitting(true);
      
      // Process skills from comma-separated string
      const skillsArray = typeof data.skills === 'string' 
        ? (data.skills as string).split(',').map(s => s.trim()).filter(s => s.length > 0)
        : data.skills as string[];

      const projectData = {
        ...data,
        skills: skillsArray,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined
      };

      const url = editingIndex !== null 
        ? `${API_URL}/projects/${editingIndex}`
        : `${API_URL}/projects`;
      
      const method = editingIndex !== null ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      const result = await response.json();
      onUpdate(result.projects);
      toast.success(editingIndex !== null ? 'Project updated successfully' : 'Project added successfully');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Projects ({projects.length})</CardTitle>
              <CardDescription>Manage your project portfolio</CardDescription>
            </div>
            {editMode && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddProject}>Add Project</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingIndex !== null ? 'Update project details' : 'Add a new project to your portfolio'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          {...register('title', { 
                            required: 'Title is required',
                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                          })}
                          className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          {...register('status')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="completed">Completed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="planned">Planned</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        {...register('description', { 
                          required: 'Description is required',
                          minLength: { value: 10, message: 'Description must be at least 10 characters' }
                        })}
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="skills">Skills (comma-separated)</Label>
                      <Input
                        id="skills"
                        {...register('skills')}
                        placeholder="React, Node.js, MongoDB, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          {...register('startDate')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          {...register('endDate')}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Project Links</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="repo" className="text-sm">Repository</Label>
                          <Input
                            id="repo"
                            type="url"
                            {...register('links.repo')}
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="demo" className="text-sm">Demo</Label>
                          <Input
                            id="demo"
                            type="url"
                            {...register('links.demo')}
                            placeholder="https://demo.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="live" className="text-sm">Live Site</Label>
                          <Input
                            id="live"
                            type="url"
                            {...register('links.live')}
                            placeholder="https://live-site.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? 'Saving...' : editingIndex !== null ? 'Update' : 'Add Project'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No projects found</p>
              {editMode && (
                <Button onClick={handleAddProject}>Add Your First Project</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {editMode && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProject(index)}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteProject(index)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </div>

                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skills.map((skill: string, skillIndex: number) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {(project.links?.repo || project.links?.demo || project.links?.live) && (
                      <div className="flex flex-wrap gap-3 text-sm">
                        {project.links.repo && (
                          <a 
                            href={project.links.repo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Repository
                          </a>
                        )}
                        {project.links.demo && (
                          <a 
                            href={project.links.demo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Demo
                          </a>
                        )}
                        {project.links.live && (
                          <a 
                            href={project.links.live} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Live Site
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}