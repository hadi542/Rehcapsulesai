import { useState } from 'react';
import { motion } from 'motion/react';
import { OnboardingData } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
}

const INDUSTRIES = [
  "SaaS", "AI/ML", "Fintech", "Healthtech", "Edtech", 
  "Consumer Tech", "Deeptech", "Climate Tech", "E-commerce", 
  "Enterprise Software", "Marketplace", "Other"
];

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [data, setData] = useState<OnboardingData>({
    founderName: '',
    teamSize: '',
    experience: '',
    education: '',
    startupName: '',
    funding: '',
    description: '',
    industry: '',
    traction: '',
    challenges: '',
    priorExperience: ''
  });

  const handleChange = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = Object.values(data).every(v => v && v.length > 0);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black tracking-tight">FOUNDER ONBOARDING</h2>
          <p className="text-white/60">Fill out the details below to seed your hyper-realistic VC simulation.</p>
        </div>

        <Card className="bg-white/5 border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-[300px] text-white/60 uppercase text-[10px] tracking-widest font-bold">Question / Section</TableHead>
                <TableHead className="text-white/60 uppercase text-[10px] tracking-widest font-bold">Your Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Founder Section */}
              <TableRow className="border-white/10 hover:bg-white/[0.02]">
                <TableCell className="align-top py-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold uppercase tracking-tight">Founder</Label>
                    <p className="text-[10px] text-white/40">Background & Team</p>
                  </div>
                </TableCell>
                <TableCell className="py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-white/30">Full Name</Label>
                      <Input 
                        placeholder="Jane Doe" 
                        value={data.founderName}
                        onChange={(e) => handleChange('founderName', e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-white/30">Education</Label>
                      <Input 
                        placeholder="Stanford MBA" 
                        value={data.education}
                        onChange={(e) => handleChange('education', e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-white/30">Experience</Label>
                    <Input 
                      placeholder="Years in industry, previous roles..." 
                      value={data.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      className="bg-white/5 border-white/10 h-9 text-xs text-white"
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* Startup Section */}
              <TableRow className="border-white/10 hover:bg-white/[0.02]">
                <TableCell className="align-top py-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold uppercase tracking-tight">Startup</Label>
                    <p className="text-[10px] text-white/40">Core Mission</p>
                  </div>
                </TableCell>
                <TableCell className="py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-white/30">Name</Label>
                      <Input 
                        placeholder="Acme AI" 
                        value={data.startupName}
                        onChange={(e) => handleChange('startupName', e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-white/30">Industry</Label>
                      <Select value={data.industry} onValueChange={(v) => handleChange('industry', v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs text-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                          {INDUSTRIES.map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-white/30">Problem & Solution</Label>
                    <Textarea 
                      placeholder="What do you solve and for whom?" 
                      value={data.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="bg-white/5 border-white/10 min-h-[60px] text-xs text-white"
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* Metrics Section */}
              <TableRow className="border-white/10 hover:bg-white/[0.02]">
                <TableCell className="align-top py-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold uppercase tracking-tight">Metrics</Label>
                    <p className="text-[10px] text-white/40">Traction & Funding</p>
                  </div>
                </TableCell>
                <TableCell className="py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-white/30">Team Size</Label>
                      <Input 
                        placeholder="e.g. 5 people" 
                        value={data.teamSize}
                        onChange={(e) => handleChange('teamSize', e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-white/30">Funding</Label>
                      <Input 
                        placeholder="e.g. Seed, $500k" 
                        value={data.funding}
                        onChange={(e) => handleChange('funding', e.target.value)}
                        className="bg-white/5 border-white/10 h-9 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-white/30">Traction</Label>
                    <Input 
                      placeholder="Users, Revenue, Growth..." 
                      value={data.traction}
                      onChange={(e) => handleChange('traction', e.target.value)}
                      className="bg-white/5 border-white/10 h-9 text-xs text-white"
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* Strategy Section */}
              <TableRow className="border-white/10 hover:bg-white/[0.02]">
                <TableCell className="align-top py-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold uppercase tracking-tight">Strategy</Label>
                    <p className="text-[10px] text-white/40">Risks & History</p>
                  </div>
                </TableCell>
                <TableCell className="py-4 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-white/30">Biggest Challenges</Label>
                    <Input 
                      placeholder="What keeps you up at night?" 
                      value={data.challenges}
                      onChange={(e) => handleChange('challenges', e.target.value)}
                      className="bg-white/5 border-white/10 h-9 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] uppercase text-white/30">Prior Pitching</Label>
                    <Input 
                      placeholder="Previous outcomes, lessons..." 
                      value={data.priorExperience}
                      onChange={(e) => handleChange('priorExperience', e.target.value)}
                      className="bg-white/5 border-white/10 h-9 text-xs text-white"
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center justify-between bg-orange-600/10 border border-orange-600/20 p-6 rounded-2xl">
          <div className="flex gap-4 items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isComplete ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/40"
            )}>
              {isComplete ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-bold text-white">Ready to start?</p>
              <p className="text-xs text-white/60">Ensure all fields are filled for the most accurate simulation.</p>
            </div>
          </div>
          <Button 
            disabled={!isComplete}
            onClick={() => onComplete(data)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-xl text-lg font-bold group"
          >
            Enter the Boardroom
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
