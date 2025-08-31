"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import ProfileEditor from '../components/ProfileEditor';
import ProjectManager from '../components/ProjectManager';
import WorkManager from '../components/WorkManager';
import SkillsManager from '../components/SkillsManager';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';

const API_URL = "http://localhost:4000";

export default function ProfileManagement() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [skill, setSkill] = useState("");

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/profile`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      setProfile(data);
      setProjects(data.projects || []);
      setWorkExperience(data.work || []);
      setSkills(data.skills || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!skill.trim()) {
      setProjects(profile.projects || []);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects?skill=${encodeURIComponent(skill)}`);
      
      if (!response.ok) {
        throw new Error('Project search failed');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      toast.error('Failed to search projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
    toast.success('Profile updated successfully');
  };

  const handleProjectsUpdate = (updatedProjects: any[]) => {
    setProjects(updatedProjects);
    setProfile((prev: any) => ({ ...prev, projects: updatedProjects }));
  };

  const handleWorkUpdate = (updatedWork: any[]) => {
    setWorkExperience(updatedWork);
    setProfile((prev: any) => ({ ...prev, work: updatedWork }));
  };

  const handleSkillsUpdate = (updatedSkills: string[]) => {
    setSkills(updatedSkills);
    setProfile((prev: any) => ({ ...prev, skills: updatedSkills }));
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load profile data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadProfileData} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Profile Management
            </h1>
            <p className="text-gray-600">
              Manage your professional portfolio, projects, and experience
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant={editMode ? "default" : "outline"}
              onClick={() => setEditMode(!editMode)}
              className="px-6"
            >
              {editMode ? "View Mode" : "Edit Mode"}
            </Button>
            <Button onClick={loadProfileData} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {/* Profile Overview */}
        {profile && (
          <Card className="mb-8 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">{profile.name}</CardTitle>
                  <CardDescription className="text-lg">{profile.email}</CardDescription>
                  {profile.bio && (
                    <p className="text-gray-600 mt-2">{profile.bio}</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{projects.length}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{workExperience.length}</div>
                  <div className="text-sm text-gray-600">Work Experience</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
              </div>
              
              {/* Skills Preview */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 10).map((skillItem, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skillItem}
                    </Badge>
                  ))}
                  {skills.length > 10 && (
                    <Badge variant="outline">+{skills.length - 10} more</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Search Projects by Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter skill to search projects..."
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} className="px-8">
                Search
              </Button>
              <Button 
                onClick={() => {
                  setSkill("");
                  setProjects(profile?.projects || []);
                }} 
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="work">Work Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectManager
              projects={projects}
              onUpdate={handleProjectsUpdate}
              editMode={editMode}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="work">
            <WorkManager
              workExperience={workExperience}
              onUpdate={handleWorkUpdate}
              editMode={editMode}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsManager
              skills={skills}
              onUpdate={handleSkillsUpdate}
              editMode={editMode}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileEditor
              profile={profile}
              onUpdate={handleProfileUpdate}
              editMode={editMode}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}