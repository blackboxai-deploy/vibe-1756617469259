"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const API_URL = "http://localhost:4000";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  education?: string;
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
  };
  preferences?: {
    publicProfile?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
  };
}

interface ProfileEditorProps {
  profile: any;
  onUpdate: (profile: any) => void;
  editMode: boolean;
  loading: boolean;
}

export default function ProfileEditor({ profile, onUpdate, editMode, loading }: ProfileEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileData>();

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        education: profile.education || '',
        links: {
          github: profile.links?.github || '',
          linkedin: profile.links?.linkedin || '',
          portfolio: profile.links?.portfolio || '',
          twitter: profile.links?.twitter || '',
          website: profile.links?.website || ''
        },
        preferences: {
          publicProfile: profile.preferences?.publicProfile ?? true,
          showEmail: profile.preferences?.showEmail ?? true,
          showPhone: profile.preferences?.showPhone ?? false
        }
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      onUpdate(result.profile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editMode) {
    return (
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your personal and professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <p className="mt-1 text-gray-900">{profile?.name || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="mt-1 text-gray-900">{profile?.email || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Phone</Label>
                <p className="mt-1 text-gray-900">{profile?.phone || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <p className="mt-1 text-gray-900">{profile?.location || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Education</Label>
                <p className="mt-1 text-gray-900">{profile?.education || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Bio</Label>
                <p className="mt-1 text-gray-900">{profile?.bio || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Social Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.links?.github && (
                <div>
                  <span className="text-sm text-gray-600">GitHub:</span>
                  <a href={profile.links.github} target="_blank" rel="noopener noreferrer" 
                     className="block text-indigo-600 hover:text-indigo-800 truncate">
                    {profile.links.github}
                  </a>
                </div>
              )}
              {profile?.links?.linkedin && (
                <div>
                  <span className="text-sm text-gray-600">LinkedIn:</span>
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="block text-indigo-600 hover:text-indigo-800 truncate">
                    {profile.links.linkedin}
                  </a>
                </div>
              )}
              {profile?.links?.portfolio && (
                <div>
                  <span className="text-sm text-gray-600">Portfolio:</span>
                  <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" 
                     className="block text-indigo-600 hover:text-indigo-800 truncate">
                    {profile.links.portfolio}
                  </a>
                </div>
              )}
              {profile?.links?.website && (
                <div>
                  <span className="text-sm text-gray-600">Website:</span>
                  <a href={profile.links.website} target="_blank" rel="noopener noreferrer" 
                     className="block text-indigo-600 hover:text-indigo-800 truncate">
                    {profile.links.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle>Edit Profile Information</CardTitle>
        <CardDescription>Update your personal and professional details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  {...register('location')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  type="text"
                  {...register('education')}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  {...register('bio')}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Social Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  {...register('links.github')}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  {...register('links.linkedin')}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  id="portfolio"
                  type="url"
                  {...register('links.portfolio')}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('links.website')}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isDirty}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}