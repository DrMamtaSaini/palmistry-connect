
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hand } from 'lucide-react';

interface PalmData {
  handShape: string;
  dominantHand: string;
  handSize: string;
  skinTexture: string;
  handFlexibility: string;
  heartLineCharacteristics: string;
  headLineCharacteristics: string;
  lifeLineCharacteristics: string;
  fateLinePresent: string;
  fateLineCharacteristics: string;
  venusMount: string;
  jupiterMount: string;
  saturnMount: string;
  sunMount: string;
  mercuryMount: string;
  marsMount: string;
  lunarMount: string;
  fingerLength: string;
  fingernailShape: string;
  thumbCharacteristics: string;
}

interface PalmAnalysisFormProps {
  palmData: PalmData;
  onPalmDataChange: (field: string, value: string) => void;
}

const PalmAnalysisForm: React.FC<PalmAnalysisFormProps> = ({ palmData, onPalmDataChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Hand className="h-5 w-5" />
        Palm Characteristics Analysis
      </h3>
      
      {/* Hand Shape & Basic Characteristics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hand Shape</Label>
          <Select onValueChange={(value) => onPalmDataChange('handShape', value)}>
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
            onValueChange={(value) => onPalmDataChange('dominantHand', value)}
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
          <Select onValueChange={(value) => onPalmDataChange('handSize', value)}>
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
          <Select onValueChange={(value) => onPalmDataChange('skinTexture', value)}>
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
          <Select onValueChange={(value) => onPalmDataChange('handFlexibility', value)}>
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
            <Select onValueChange={(value) => onPalmDataChange('heartLineCharacteristics', value)}>
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
            <Select onValueChange={(value) => onPalmDataChange('headLineCharacteristics', value)}>
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
            <Select onValueChange={(value) => onPalmDataChange('lifeLineCharacteristics', value)}>
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
            <Select onValueChange={(value) => onPalmDataChange('fateLinePresent', value)}>
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
              <Select onValueChange={(value) => onPalmDataChange(mount.key, value)}>
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
  );
};

export default PalmAnalysisForm;
