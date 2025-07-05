
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, User, Briefcase, Heart, Star } from 'lucide-react';

interface UserProfile {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  maritalStatus: string;
  profession: string;
  numberOfChildren: string;
  preferredLanguage: string;
  festivalRegion: string;
  specificQuestions: string;
}

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, isLoading = false }) => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    maritalStatus: '',
    profession: '',
    numberOfChildren: '',
    preferredLanguage: 'english',
    festivalRegion: 'north-india',
    specificQuestions: ''
  });

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const isFormValid = profile.fullName && profile.gender && profile.dateOfBirth && 
                     profile.timeOfBirth && profile.placeOfBirth;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Personal Details for 50-Page Comprehensive Report
        </CardTitle>
        <CardDescription>
          Provide your details for an in-depth palmistry and astrology analysis combining traditional wisdom with modern insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Birth Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeOfBirth">Time of Birth *</Label>
              <Input
                id="timeOfBirth"
                type="time"
                value={profile.timeOfBirth}
                onChange={(e) => handleInputChange('timeOfBirth', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeOfBirth" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Place of Birth *
            </Label>
            <Input
              id="placeOfBirth"
              value={profile.placeOfBirth}
              onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
              placeholder="City, State, Country"
              required
            />
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Marital Status
              </Label>
              <Select onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="in-relationship">In Relationship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profession" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Profession
              </Label>
              <Input
                id="profession"
                value={profile.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                placeholder="Your current profession"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfChildren">Number of Children (Optional)</Label>
            <Input
              id="numberOfChildren"
              type="number"
              min="0"
              value={profile.numberOfChildren}
              onChange={(e) => handleInputChange('numberOfChildren', e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Select 
                defaultValue="english"
                onValueChange={(value) => handleInputChange('preferredLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="bengali">Bengali</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="festivalRegion">Festival Region</Label>
              <Select 
                defaultValue="north-india"
                onValueChange={(value) => handleInputChange('festivalRegion', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-india">North India</SelectItem>
                  <SelectItem value="south-india">South India</SelectItem>
                  <SelectItem value="east-india">East India</SelectItem>
                  <SelectItem value="west-india">West India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificQuestions">Specific Questions or Areas of Focus (Optional)</Label>
            <Textarea
              id="specificQuestions"
              value={profile.specificQuestions}
              onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
              placeholder="Any specific areas you'd like me to focus on in your reading..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Generating Report...' : 'Generate 50-Page Comprehensive Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
