"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

const API_URL = "http://localhost:4000";

interface SkillsManagerProps {
  skills: string[];
  onUpdate: (skills: string[]) => void;
  editMode: boolean;
  loading: boolean;
}

export default function SkillsManager({ skills, onUpdate, editMode, loading }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkSkills, setBulkSkills] = useState('');
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSkill.trim()) {
      toast.error('Please enter a skill');
      return;
    }

    if (skills.some(skill => skill.toLowerCase() === newSkill.toLowerCase())) {
      toast.error('Skill already exists');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skill: newSkill.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add skill');
      }

      const result = await response.json();
      onUpdate(result.skills);
      setNewSkill('');
      toast.success('Skill added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillToDelete: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/skills/${encodeURIComponent(skillToDelete)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete skill');
      }

      const result = await response.json();
      onUpdate(result.skills);
      toast.success('Skill deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpdate = async () => {
    try {
      setIsSubmitting(true);
      
      const skillsArray = bulkSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length >= 2);

      if (skillsArray.length === 0) {
        toast.error('Please enter at least one valid skill');
        return;
      }

      const response = await fetch(`${API_URL}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills: skillsArray }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update skills');
      }

      const result = await response.json();
      onUpdate(result.skills);
      setShowBulkEdit(false);
      setBulkSkills('');
      toast.success('Skills updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update skills');
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Vue.js', 'Angular',
    'Node.js', 'Express.js', 'Django', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'GraphQL', 'REST API', 'Machine Learning',
    'Data Science', 'DevOps', 'CI/CD', 'Testing', 'Agile', 'Scrum'
  ];

  const availableSuggestions = suggestedSkills.filter(
    suggested => !skills.some(skill => skill.toLowerCase() === suggested.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Skills ({skills.length})</CardTitle>
              <CardDescription>Manage your technical and professional skills</CardDescription>
            </div>
            {editMode && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBulkSkills(skills.join(', '));
                    setShowBulkEdit(!showBulkEdit);
                  }}
                >
                  {showBulkEdit ? 'Cancel' : 'Bulk Edit'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Single Skill */}
          {editMode && !showBulkEdit && (
            <div>
              <Label htmlFor="newSkill">Add New Skill</Label>
              <form onSubmit={handleAddSkill} className="flex gap-2 mt-2">
                <Input
                  id="newSkill"
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill (e.g., JavaScript, React, etc.)"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newSkill.trim()}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? 'Adding...' : 'Add Skill'}
                </Button>
              </form>
            </div>
          )}

          {/* Bulk Edit Mode */}
          {editMode && showBulkEdit && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkSkills">Edit All Skills (comma-separated)</Label>
                <textarea
                  id="bulkSkills"
                  value={bulkSkills}
                  onChange={(e) => setBulkSkills(e.target.value)}
                  rows={4}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js, Python, etc."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBulkEdit(false);
                    setBulkSkills('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkUpdate}
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Skills Display */}
          {!showBulkEdit && (
            <div>
              <Label className="text-base font-medium mb-3 block">Current Skills</Label>
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No skills added yet</p>
                  {editMode && (
                    <p className="text-sm text-gray-400">Add your first skill using the form above</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="relative group">
                      <Badge 
                        variant="secondary" 
                        className="text-sm py-1 px-3 pr-8 hover:bg-gray-200 transition-colors"
                      >
                        {skill}
                        {editMode && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
                                type="button"
                                disabled={isSubmitting}
                              >
                                ×
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove &quot;{skill}&quot; from your skills? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSkill(skill)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggested Skills */}
          {editMode && !showBulkEdit && availableSuggestions.length > 0 && (
            <div>
              <Label className="text-base font-medium mb-3 block">Suggested Skills</Label>
              <div className="flex flex-wrap gap-2">
                {availableSuggestions.slice(0, 12).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setNewSkill(suggestion)}
                    className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 hover:bg-indigo-100 transition-colors"
                    disabled={isSubmitting}
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Click on suggestions to add them quickly
              </p>
            </div>
          )}

          {/* Skills Analytics */}
          {skills.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Skills Overview</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-indigo-600">{skills.length}</div>
                  <div className="text-xs text-gray-600">Total Skills</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {skills.filter(s => s.toLowerCase().includes('script') || s.toLowerCase().includes('java') || s.toLowerCase().includes('python')).length}
                  </div>
                  <div className="text-xs text-gray-600">Languages</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">
                    {skills.filter(s => s.toLowerCase().includes('react') || s.toLowerCase().includes('vue') || s.toLowerCase().includes('angular')).length}
                  </div>
                  <div className="text-xs text-gray-600">Frameworks</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {skills.filter(s => s.toLowerCase().includes('aws') || s.toLowerCase().includes('docker') || s.toLowerCase().includes('kubernetes')).length}
                  </div>
                  <div className="text-xs text-gray-600">DevOps/Cloud</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}