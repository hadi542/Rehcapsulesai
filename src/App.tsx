import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, MessageSquare, BarChart3, Shield, Info, Send, User, Bot, Loader2, ChevronRight, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phase, Message, VCReport, OnboardingData } from './types';
import { chat, generateReportData } from './services/gemini';
import ReactMarkdown from 'react-markdown';
import ReportView from './components/ReportView';
import LandingPage from './components/LandingPage';
import OnboardingForm from './components/OnboardingForm';

export default function App() {
  const [phase, setPhase] = useState<Phase>('LANDING');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<VCReport | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartOnboarding = () => {
    setPhase('ONBOARDING');
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setIsLoading(true);
    setPhase('INTERVIEW');
    
    const summaryPrompt = `
      Founder Profile:
      - Name: ${data.founderName}
      - Team: ${data.teamSize}
      - Experience: ${data.experience}
      - Education: ${data.education}
      
      Startup Profile:
      - Name: ${data.startupName}
      - Industry: ${data.industry}
      - Description: ${data.description}
      - Traction: ${data.traction}
      - Challenges: ${data.challenges}
      - Prior Experience: ${data.priorExperience}
      
      Start Phase 2: Dynamic VC Interview Simulation based on this data.
    `;

    try {
      const response = await chat([{ role: 'user', content: summaryPrompt }]);
      setMessages([{ role: 'model', content: response }]);
    } catch (error) {
      console.error('Failed to start interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage];
      const response = await chat(history);
      setMessages(prev => [...prev, { role: 'model', content: response }]);

      if (
        input.toLowerCase().includes('generate report') || 
        input.toLowerCase().includes('end interview') ||
        response.includes('Interview complete')
      ) {
        handleGenerateReport();
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const chatHistory = messages.map(m => `${m.role === 'user' ? 'Founder' : 'VC'}: ${m.content}`).join('\n');
      const reportData = await generateReportData(chatHistory);
      setReport(reportData);
      setPhase('REPORT');
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setPhase('LANDING');
    setMessages([]);
    setReport(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">RayPitch<span className="text-orange-600">AI</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-4">
              <PhaseIndicator currentPhase={phase} />
            </div>
          </nav>

          <Button variant="ghost" size="sm" onClick={resetApp} className="text-white/60 hover:text-white hover:bg-white/10">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-16">
        <AnimatePresence mode="wait">
          {phase === 'LANDING' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <LandingPage onStart={handleStartOnboarding} />
            </motion.div>
          ) : phase === 'ONBOARDING' ? (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <OnboardingForm onComplete={handleOnboardingComplete} />
            </motion.div>
          ) : phase === 'INTERVIEW' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col max-w-5xl mx-auto w-full h-[calc(100vh-4rem)] overflow-hidden"
            >
              <Card className="flex-1 bg-white/5 border-white/10 overflow-hidden flex flex-col m-4 md:m-6">
                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-6">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex gap-4 max-w-[90%] md:max-w-[85%]",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          msg.role === 'user' ? "bg-orange-600" : "bg-white/10"
                        )}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed",
                          msg.role === 'user' 
                            ? "bg-orange-600 text-white rounded-tr-none" 
                            : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                        )}>
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/10 rounded-tl-none border border-white/5 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                          <span className="text-xs text-white/60">RayPitch is thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2 max-w-4xl mx-auto"
                  >
                    <Input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your response to the VC..."
                      className="bg-white/5 border-white/10 focus:border-orange-600 text-white h-12 rounded-xl flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !input.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 h-12 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="w-full max-w-5xl mx-auto p-6">
                {report && <ReportView report={report} onReset={resetApp} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-4 left-6 right-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <Shield className="w-3 h-3 text-orange-600" />
          <span className="text-[10px] text-white/60 uppercase tracking-widest">Secure Simulation Environment</span>
        </div>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <Info className="w-3 h-3 text-orange-600" />
          <span className="text-[10px] text-white/60 uppercase tracking-widest">Powered by Gemini 3 Flash</span>
        </div>
      </footer>
    </div>
  );
}

function PhaseIndicator({ currentPhase }: { currentPhase: Phase }) {
  const steps = [
    { id: 'ONBOARDING', label: 'Onboarding', icon: Info },
    { id: 'INTERVIEW', label: 'Interview', icon: MessageSquare },
    { id: 'REPORT', label: 'Analysis', icon: BarChart3 },
  ];

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = step.id === currentPhase;
        const isPast = steps.findIndex(s => s.id === currentPhase) > i;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
              isActive ? "bg-orange-600/20 text-orange-500 border border-orange-600/30" : 
              isPast ? "text-orange-500" : "text-white/40"
            )}>
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-white/10 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
