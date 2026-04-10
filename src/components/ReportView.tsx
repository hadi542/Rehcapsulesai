import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { VCReport } from '../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, Users, Target, RefreshCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportViewProps {
  report: VCReport;
  onReset: () => void;
}

export default function ReportView({ report, onReset }: ReportViewProps) {
  const verdictColors = {
    High: "text-green-500 bg-green-500/10 border-green-500/20",
    Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    Low: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-orange-600 bg-orange-600/10"
        >
          <span className="text-5xl font-black text-white">{report.overallScore}</span>
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight">RayPitch Analysis Report</h1>
        <p className="text-white/60 max-w-2xl mx-auto italic">"{report.summary}"</p>
        <div className="flex justify-center gap-4 pt-4">
          <Badge className={cn("px-4 py-1 text-sm font-semibold", verdictColors[report.finalVerdict])}>
            Verdict: {report.finalVerdict} Potential
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Performance Radar
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.categoryScores}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#ea580c"
                  fill="#ea580c"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-white/40 mt-4 text-center">{report.scoreDescription}</p>
        </Card>

        {/* Bar Chart */}
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Category Breakdown
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.categoryScores} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" domain={[0, 10]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fill: '#ffffff60', fontSize: 10 }} 
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {report.categoryScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 7 ? '#22c55e' : entry.score >= 4 ? '#eab308' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <Card className="p-6 bg-white/5 border-white/10 border-l-4 border-l-green-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-500">
            <CheckCircle2 className="w-5 h-5" />
            What You Did Well
          </h3>
          <ul className="space-y-3">
            {report.strengths.map((s, i) => (
              <li key={i} className="text-sm text-white/80 flex gap-2">
                <span className="text-green-500 mt-1">•</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* Red Flags */}
        <Card className="p-6 bg-white/5 border-white/10 border-l-4 border-l-red-500">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            Critical Red Flags
          </h3>
          <ul className="space-y-3">
            {report.redFlags.map((r, i) => (
              <li key={i} className="text-sm text-white/80 flex gap-2">
                <span className="text-red-500 mt-1">•</span>
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Actionable Changes */}
      <Card className="p-8 bg-white/5 border-white/10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-orange-600" />
          Actionable Changes You Must Make
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.actionableChanges.map((a, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center shrink-0 text-orange-500 font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Fundraising Potential */}
        <Card className="p-6 bg-white/5 border-white/10 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Fundraising Potential
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">{report.fundraisingPotential}</p>
          <Separator className="my-6 bg-white/10" />
          <h4 className="text-sm font-semibold mb-2 text-white/60 uppercase tracking-wider">Next Steps</h4>
          <p className="text-sm text-white/90">{report.nextSteps}</p>
        </Card>

        {/* Competitors */}
        <Card className="p-6 bg-white/5 border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Competitor Analysis
          </h3>
          <div className="space-y-4">
            {report.competitors.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="text-sm font-bold text-white">{c.name}</div>
                <div className="text-xs text-white/60 leading-relaxed">{c.description}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
        <Button onClick={onReset} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-2xl text-lg font-bold">
          <RefreshCcw className="w-5 h-5 mr-2" />
          Re-run Interview
        </Button>
        <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white px-8 py-6 rounded-2xl text-lg font-bold">
          <Download className="w-5 h-5 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
