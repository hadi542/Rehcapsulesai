import { motion } from 'motion/react';
import { Rocket, Shield, Zap, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#050505] relative px-6 py-24">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-5xl relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-medium tracking-widest uppercase text-white/60">The Ultimate VC Prep Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] font-display"
        >
          CRUSH YOUR <br />
          <span className="text-orange-600">NEXT PITCH.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
        >
          RayPitch AI simulates hyper-realistic VC interviews. Get brutally honest feedback, 
          identify red flags, and refine your narrative.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button 
            onClick={onStart}
            className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-8 rounded-2xl text-xl font-bold group shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)]"
          >
            Start Simulation
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          <FeatureCard 
            icon={Rocket}
            title="Realistic Simulation"
            description="Dynamic AI that probes your business model like a Tier-1 VC Partner."
          />
          <FeatureCard 
            icon={Shield}
            title="Red Flag Detection"
            description="Identify dangerous assumptions and weak logic before investors do."
          />
          <FeatureCard 
            icon={Target}
            title="Actionable Roadmap"
            description="Get a concrete list of changes you must make to secure funding."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-orange-600/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-orange-500" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}
