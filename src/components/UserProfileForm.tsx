import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, User, Briefcase, Heart, Star, Hand, Brain, Target } from 'lucide-react';

interface UserProfile {
  // Basic Information
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
  
  // Palm Characteristics
  handShape: string;
  dominantHand: string;
  handSize: string;
  skinTexture: string;
  handFlexibility: string;
  
  // Major Lines
  heartLineCharacteristics: string;
  headLineCharacteristics: string;
  lifeLineCharacteristics: string;
  fateLinePresent: string;
  fateLineCharacteristics: string;
  
  // Mounts
  venusMount: string;
  jupiterMount: string;
  saturnMount: string;
  sunMount: string;
  mercuryMount: string;
  marsMount: string;
  lunarMount: string;
  
  // Finger Characteristics
  fingerLength: string;
  fingernailShape: string;
  thumbCharacteristics: string;
  
  // Personal Preferences & Focus Areas
  primaryConcerns: string[];
  lifeGoals: string[];
  currentChallenges: string[];
  personalityTraits: string[];
  
  // Numerology Data (auto-calculated)
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
}

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, isLoading = false }) => {
  const [profile, setProfile] = useState<UserProfile>({
    // Basic Information
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
    specificQuestions: '',
    
    // Palm Characteristics
    handShape: '',
    dominantHand: 'right',
    handSize: '',
    skinTexture: '',
    handFlexibility: '',
    
    // Major Lines
    heartLineCharacteristics: '',
    headLineCharacteristics: '',
    lifeLineCharacteristics: '',
    fateLinePresent: '',
    fateLineCharacteristics: '',
    
    // Mounts
    venusMount: '',
    jupiterMount: '',
    saturnMount: '',
    sunMount: '',
    mercuryMount: '',
    marsMount: '',
    lunarMount: '',
    
    // Finger Characteristics
    fingerLength: '',
    fingernailShape: '',
    thumbCharacteristics: '',
    
    // Personal Preferences
    primaryConcerns: [],
    lifeGoals: [],
    currentChallenges: [],
    personalityTraits: [],
    
    // Numerology (calculated)
    lifePathNumber: 0,
    expressionNumber: 0,
    soulUrgeNumber: 0
  });

  const calculateNumerology = (dateOfBirth: string, fullName: string) => {
    // Life Path Number calculation
    const birthNumbers = dateOfBirth.replace(/-/g, '').split('').map(Number);
    let lifePathSum = birthNumbers.reduce((sum, num) => sum + num, 0);
    while (lifePathSum > 9 && lifePathSum !== 11 && lifePathSum !== 22 && lifePathSum !== 33) {
      lifePathSum = lifePathSum.toString().split('').map(Number).reduce((sum, num) => sum + num, 0);
    }
    
    // Expression Number (simplified calculation based on name)
    const nameValue = fullName.toLowerCase().replace(/[^a-z]/g, '').split('')
      .reduce((sum, char) => sum + (char.charCodeAt(0) - 96), 0);
    let expressionSum = nameValue;
    while (expressionSum > 9 && expressionSum !== 11 && expressionSum !== 22 && expressionSum !== 33) {
      expressionSum = expressionSum.toString().split('').map(Number).reduce((sum, num) => sum + num, 0);
    }
    
    return {
      lifePathNumber: lifePathSum,
      expressionNumber: expressionSum,
      soulUrgeNumber: Math.floor(Math.random() * 9) + 1 // Simplified for demo
    };
  };

  const handleInputChange = (field: keyof UserProfile, value: string | string[] | number) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Auto-calculate numerology when birth date or name changes
      if (field === 'dateOfBirth' || field === 'fullName') {
        if (updated.dateOfBirth && updated.fullName) {
          const numerology = calculateNumerology(updated.dateOfBirth, updated.fullName);
          Object.assign(updated, numerology);
        }
      }
      
      return updated;
    });
  };

  const handleMultiSelectChange = (field: keyof UserProfile, value: string, checked: boolean) => {
    setProfile(prev => {
      const currentValues = prev[field] as string[] || [];
      const updatedValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      return {
        ...prev,
        [field]: updatedValues
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const isFormValid = profile.fullName && profile.gender && profile.dateOfBirth && 
                     profile.timeOfBirth && profile.placeOfBirth;

  const primaryConcernOptions = [
    'Career & Professional Growth', 'Love & Relationships', 'Health & Wellness',
    'Family & Children', 'Finances & Wealth', 'Spiritual Growth', 'Education & Learning',
    'Travel & Adventure', 'Creative Expression', 'Social Recognition'
  ];

  const lifeGoalOptions = [
    'Financial Independence', 'Happy Marriage', 'Successful Career', 'Good Health',
    'Spiritual Enlightenment', 'Family Happiness', 'Creative Achievement', 'Social Impact',
    'Personal Freedom', 'Knowledge & Wisdom'
  ];

  const challengeOptions = [
    'Career Confusion', 'Relationship Issues', 'Financial Stress', 'Health Concerns',
    'Family Problems', 'Self-Confidence', 'Decision Making', 'Time Management',
    'Communication Issues', 'Stress & Anxiety'
  ];

  const personalityOptions = [
    'Ambitious', 'Caring', 'Creative', 'Analytical', 'Intuitive', 'Practical',
    'Adventurous', 'Diplomatic', 'Independent', 'Spiritual', 'Leader', 'Helper'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Comprehensive Life Analysis Profile
        </CardTitle>
        <CardDescription>
          Provide detailed information for an in-depth palmistry, astrology, and numerology analysis that combines traditional wisdom with modern insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="palm">Palm Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Basic Information - keep existing fields */}
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

              {/* Numerology Display */}
              {profile.lifePathNumber > 0 && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Auto-Calculated Numerology
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>Life Path: <span className="font-bold">{profile.lifePathNumber}</span></div>
                    <div>Expression: <span className="font-bold">{profile.expressionNumber}</span></div>
                    <div>Soul Urge: <span className="font-bold">{profile.soulUrgeNumber}</span></div>
                  </div>
                </div>
              )}

              {/* Keep existing personal details fields */}
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
            </TabsContent>

            <TabsContent value="palm" className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Hand className="h-5 w-5" />
                  Palm Characteristics Analysis
                </h3>
                
                {/* Hand Shape & Basic Characteristics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hand Shape</Label>
                    <Select onValueChange={(value) => handleInputChange('handShape', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hand shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earth">Earth (Square palm, square fingers)</SelectItem>
                        <SelectItem value="air">Air (Square palm, long fingers)</SelectItem>
                        <SelectItem value="water">Water (Long palm, long fingers)</SelectItem>
                        <SelectItem value="fire">Fire (Square palm, short fingers)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Dominant Hand</Label>
                    <Select 
                      defaultValue="right"
                      onValueChange={(value) => handleInputChange('dominantHand', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="right">Right Hand</SelectItem>
                        <SelectItem value="left">Left Hand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Hand Size (relative to body)</Label>
                    <Select onValueChange={(value) => handleInputChange('handSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Skin Texture</Label>
                    <Select onValueChange={(value) => handleInputChange('skinTexture', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select texture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soft">Soft</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="coarse">Coarse/Rough</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Hand Flexibility</Label>
                    <Select onValueChange={(value) => handleInputChange('handFlexibility', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flexibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Very Flexible</SelectItem>
                        <SelectItem value="medium">Medium Flexibility</SelectItem>
                        <SelectItem value="stiff">Stiff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Major Lines */}
                <div className="space-y-4">
                  <h4 className="font-medium">Major Lines Characteristics</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Heart Line</Label>
                      <Select onValueChange={(value) => handleInputChange('heartLineCharacteristics', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Heart line characteristics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long-curved">Long and Curved</SelectItem>
                          <SelectItem value="straight-short">Straight and Short</SelectItem>
                          <SelectItem value="broken">Broken or Fragmented</SelectItem>
                          <SelectItem value="deep-clear">Deep and Clear</SelectItem>
                          <SelectItem value="faint">Faint or Unclear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Head Line</Label>
                      <Select onValueChange={(value) => handleInputChange('headLineCharacteristics', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Head line characteristics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long-straight">Long and Straight</SelectItem>
                          <SelectItem value="curved-sloping">Curved/Sloping</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="deep-clear">Deep and Clear</SelectItem>
                          <SelectItem value="wavy">Wavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Life Line</Label>
                      <Select onValueChange={(value) => handleInputChange('lifeLineCharacteristics', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Life line characteristics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long-deep">Long and Deep</SelectItem>
                          <SelectItem value="short-shallow">Short and Shallow</SelectItem>
                          <SelectItem value="curved-strong">Curved and Strong</SelectItem>
                          <SelectItem value="close-thumb">Close to Thumb</SelectItem>
                          <SelectItem value="multiple">Multiple Life Lines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fate Line Present?</Label>
                      <Select onValueChange={(value) => handleInputChange('fateLinePresent', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Fate line presence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present-strong">Present and Strong</SelectItem>
                          <SelectItem value="present-faint">Present but Faint</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="broken">Broken/Fragmented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Mounts */}
                <div className="space-y-4">
                  <h4 className="font-medium">Mount Prominence</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'venusMount', label: 'Venus (under thumb)' },
                      { key: 'jupiterMount', label: 'Jupiter (under index)' },
                      { key: 'saturnMount', label: 'Saturn (under middle)' },
                      { key: 'sunMount', label: 'Sun (under ring)' },
                      { key: 'mercuryMount', label: 'Mercury (under pinkie)' },
                      { key: 'marsMount', label: 'Mars' }
                    ].map(mount => (
                      <div key={mount.key} className="space-y-2">
                        <Label className="text-sm">{mount.label}</Label>
                        <Select onValueChange={(value) => handleInputChange(mount.key as keyof UserProfile, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High/Prominent</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="low">Low/Flat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Personal Preferences & Focus Areas
                </h3>

                {/* Primary Concerns */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Primary Life Concerns (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {primaryConcernOptions.map(concern => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={`concern-${concern}`}
                          checked={profile.primaryConcerns.includes(concern)}
                          onCheckedChange={(checked) => 
                            handleMultiSelectChange('primaryConcerns', concern, checked as boolean)
                          }
                        />
                        <Label htmlFor={`concern-${concern}`} className="text-sm">{concern}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Life Goals */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Life Goals & Aspirations</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {lifeGoalOptions.map(goal => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={profile.lifeGoals.includes(goal)}
                          onCheckedChange={(checked) => 
                            handleMultiSelectChange('lifeGoals', goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={`goal-${goal}`} className="text-sm">{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Challenges */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Current Life Challenges</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {challengeOptions.map(challenge => (
                      <div key={challenge} className="flex items-center space-x-2">
                        <Checkbox
                          id={`challenge-${challenge}`}
                          checked={profile.currentChallenges.includes(challenge)}
                          onCheckedChange={(checked) => 
                            handleMultiSelectChange('currentChallenges', challenge, checked as boolean)
                          }
                        />
                        <Label htmlFor={`challenge-${challenge}`} className="text-sm">{challenge}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personality Traits */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">How would you describe yourself?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {personalityOptions.map(trait => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`trait-${trait}`}
                          checked={profile.personalityTraits.includes(trait)}
                          onCheckedChange={(checked) => 
                            handleMultiSelectChange('personalityTraits', trait, checked as boolean)
                          }
                        />
                        <Label htmlFor={`trait-${trait}`} className="text-sm">{trait}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keep existing preferences fields */}
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
                    <Label htmlFor="festivalRegion">Cultural Region</Label>
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
                  <Label htmlFor="specificQuestions">Additional Questions or Focus Areas</Label>
                  <Textarea
                    id="specificQuestions"
                    value={profile.specificQuestions}
                    onChange={(e) => handleInputChange('specificQuestions', e.target.value)}
                    placeholder="Any specific areas, questions, or concerns you'd like emphasized in your comprehensive analysis..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review Your Information</h3>
                
                <div className="grid gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {profile.fullName || 'Not provided'}</p>
                      <p><strong>Birth:</strong> {profile.dateOfBirth} at {profile.timeOfBirth}</p>
                      <p><strong>Place:</strong> {profile.placeOfBirth || 'Not provided'}</p>
                      {profile.lifePathNumber > 0 && (
                        <p><strong>Numerology:</strong> Life Path {profile.lifePathNumber}, Expression {profile.expressionNumber}</p>
                      )}
                    </div>
                  </div>

                  {profile.handShape && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Palm Characteristics</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Hand Shape:</strong> {profile.handShape}</p>
                        <p><strong>Dominant Hand:</strong> {profile.dominantHand}</p>
                        {profile.heartLineCharacteristics && (
                          <p><strong>Heart Line:</strong> {profile.heartLineCharacteristics}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {(profile.primaryConcerns.length > 0 || profile.lifeGoals.length > 0) && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Personal Focus Areas</h4>
                      <div className="text-sm space-y-1">
                        {profile.primaryConcerns.length > 0 && (
                          <p><strong>Primary Concerns:</strong> {profile.primaryConcerns.join(', ')}</p>
                        )}
                        {profile.lifeGoals.length > 0 && (
                          <p><strong>Life Goals:</strong> {profile.lifeGoals.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!isFormValid || isLoading}
                  size="lg"
                >
                  {isLoading ? 'Generating Comprehensive Report...' : 'Generate 50-Page Comprehensive Analysis'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
