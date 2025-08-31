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

interface WorkExperience {
  company: string;
  title: string;
  duration: string;
  description: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

interface WorkManagerProps {
  workExperience: any[];
  onUpdate: (work: any[]) => void;
  editMode: boolean;
  loading: boolean;
}

export default function WorkManager({ workExperience, onUpdate, editMode, loading }: WorkManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<WorkExperience>();
  const currentJob = watch('current');

  const handleAddWork = () => {
    reset({
      company: '',
      title: '',
      duration: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditWork = (index: number) => {
    const work = workExperience[index];
    reset({
      company: work.company,
      title: work.title,
      duration: work.duration,
      description: work.description,
      location: work.location || '',
      startDate: work.startDate ? new Date(work.startDate).toISOString().split('T')[0] : '',
      endDate: work.endDate ? new Date(work.endDate).toISOString().split('T')[0] : '',
      current: work.current || false
    });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteWork = async (index: number) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/work/${index}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete work experience');
      }

      const result = await response.json();
      onUpdate(result.workList);
      toast.success('Work experience deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete work experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: WorkExperience) => {
    try {
      setIsSubmitting(true);
      
      const workData = {
        ...data,
        startDate: data.startDate || undefined,
        endDate: data.current ? undefined : (data.endDate || undefined)
      };

      const url = editingIndex !== null 
        ? `${API_URL}/work/${editingIndex}`
        : `${API_URL}/work`;
      
      const method = editingIndex !== null ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save work experience');
      }

      const result = await response.json();
      onUpdate(result.workList);
      toast.success(editingIndex !== null ? 'Work experience updated successfully' : 'Work experience added successfully');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save work experience');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Work Experience ({workExperience.length})</CardTitle>
              <CardDescription>Manage your professional experience</CardDescription>
            </div>
            {editMode && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddWork}>Add Work Experience</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingIndex !== null ? 'Edit Work Experience' : 'Add New Work Experience'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingIndex !== null ? 'Update work experience details' : 'Add a new work experience to your profile'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          {...register('company', { 
                            required: 'Company name is required',
                            minLength: { value: 2, message: 'Company name must be at least 2 characters' }
                          })}
                          className={errors.company ? 'border-red-500' : ''}
                        />
                        {errors.company && (
                          <p className="text-sm text-red-600 mt-1">{errors.company.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          {...register('title', { 
                            required: 'Job title is required',
                            minLength: { value: 2, message: 'Job title must be at least 2 characters' }
                          })}
                          className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Duration *</Label>
                        <Input
                          id="duration"
                          {...register('duration', { 
                            required: 'Duration is required',
                            minLength: { value: 3, message: 'Duration must be at least 3 characters' }
                          })}
                          placeholder="e.g., Jan 2020 - Present"
                          className={errors.duration ? 'border-red-500' : ''}
                        />
                        {errors.duration && (
                          <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          {...register('location')}
                          placeholder="City, State/Country"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        {...register('description', { 
                          required: 'Job description is required',
                          minLength: { value: 10, message: 'Description must be at least 10 characters' }
                        })}
                        placeholder="Describe your role, responsibilities, and achievements..."
                        className={errors.description ? 'border-red-500' : ''}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          disabled={currentJob}
                        />
                      </div>

                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="current"
                            {...register('current')}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor="current" className="text-sm font-normal">
                            Current Position
                          </Label>
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
                        {isSubmitting ? 'Saving...' : editingIndex !== null ? 'Update' : 'Add Experience'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {workExperience.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No work experience found</p>
              {editMode && (
                <Button onClick={handleAddWork}>Add Your First Work Experience</Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {workExperience.map((work, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{work.title}</h3>
                          {work.current && (
                            <Badge className="bg-green-100 text-green-800">Current</Badge>
                          )}
                        </div>
                        <p className="text-indigo-600 font-medium">{work.company}</p>
                        <p className="text-gray-600 text-sm">{work.duration}</p>
                        {work.location && (
                          <p className="text-gray-500 text-sm">{work.location}</p>
                        )}
                      </div>
                      {editMode && (
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditWork(index)}
                          >
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Work Experience</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this work experience at &quot;{work.company}&quot;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteWork(index)}
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

                    <div className="mt-3">
                      <p className="text-gray-700 leading-relaxed">{work.description}</p>
                    </div>
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