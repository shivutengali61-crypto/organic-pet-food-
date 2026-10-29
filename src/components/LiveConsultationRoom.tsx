import React, { useState, useEffect, useRef } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Send, 
  Activity, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'vet' | 'user';
  text: string;
  timestamp: string;
}

export const LiveConsultationRoom: React.FC = () => {
  const { 
    isConsultRoomOpen, 
    setIsConsultRoomOpen, 
    activeAppointment, 
    activePet, 
    products, 
    addToCart 
  } = useRealtime();

  if (!isConsultRoomOpen || !activeAppointment) return null;

  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [isVetTyping, setIsVetTyping] = useState<boolean>(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(142);
  const [activeTab, setActiveTab] = useState<'chat' | 'vitals' | 'prescription'>('chat');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'vet',
      text: `Hello! I'm ${activeAppointment.vetName}. I have ${activeAppointment.petName}'s medical profile and nutrition log open right here. How can I assist you with ${activeAppointment.petName}'s diet and wellness today?`,
      timestamp: '00:05'
    },
    {
      id: 'm2',
      sender: 'user',
      text: `Hi Dr. Vance! We've been looking to transition ${activeAppointment.petName} to your 100% organic freeze-dried raw beef, but he had slight skin itching last month on regular kibble.`,
      timestamp: '00:45'
    },
    {
      id: 'm3',
      sender: 'vet',
      text: `That's a very common symptom of grain and rendered meat-meal sensitivities in ${activePet?.breed || 'dogs'}. Switching to single-protein grass-fed raw beef with pure organic greens removes those inflammatory fillers. I also recommend adding 2 oz of our Artisan Bone Broth for gut barrier repair.`,
      timestamp: '01:20'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real-time call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isVetTyping]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: formatTimer(callDurationSeconds)
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Vet simulated response
    setIsVetTyping(true);
    setTimeout(() => {
      let reply = "I understand completely. Let's start with a 7-day transition ratio: 25% organic raw food for days 1-3, then 50% for days 4-5, reaching 100% by day 7. His digestion will thrive!";
      
      const lower = text.toLowerCase();
      if (lower.includes('itching') || lower.includes('scratching') || lower.includes('skin')) {
        reply = `For ${activeAppointment.petName}'s skin inflammation, the cold-pressed wild salmon feast has high EPA/DHA Omega-3s that calm mast cells within 10-14 days. I've noted this in your digital prescription!`;
      } else if (lower.includes('kibble') || lower.includes('transition') || lower.includes('mix')) {
        reply = `Never rush a transition. Mixing raw organic patties with gently warmed bone broth makes it irresistible and eases gastric enzyme adaptation.`;
      } else if (lower.includes('broth') || lower.includes('joint') || lower.includes('mobility')) {
        reply = `The Artisan Bone Broth provides bio-available collagen peptides and natural glucosamine. Add 1/4 cup daily to his morning bowl.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'vet',
          text: reply,
          timestamp: formatTimer(callDurationSeconds + 2)
        }
      ]);
      setIsVetTyping(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-6xl h-[92vh] bg-stone-950 text-white rounded-3xl shadow-2xl overflow-hidden border border-stone-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Video Header */}
        <div className="px-6 py-3.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-sm tracking-tight text-white">
                Live Telehealth Consultation
              </span>
            </div>
            <span className="text-xs text-stone-500">·</span>
            <span className="text-xs text-stone-400">Patient: <strong className="text-white">{activeAppointment.petName}</strong></span>
            <span className="text-xs text-stone-500">·</span>
            <span className="text-xs font-mono tabular-nums text-emerald-400 font-semibold">{formatTimer(callDurationSeconds)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 hidden sm:inline">Encrypted HD Stream</span>
            <button
              onClick={() => setIsConsultRoomOpen(false)}
              className="px-3 py-1 text-xs font-medium text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
            >
              Minimize
            </button>
          </div>
        </div>

        {/* Main Body: Video Feed Left + Clinical & Chat Sidebar Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Video Stream Column */}
          <div className="lg:col-span-7 bg-stone-950 flex flex-col justify-between p-4 sm:p-6 relative">
            {/* Primary Doctor Feed */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 flex flex-col justify-between p-6">
              {/* Doctor HUD overlay */}
              <div className="flex items-center justify-between relative z-10">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold">{activeAppointment.vetName}</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-stone-400 font-mono">
                  1080p · 60fps · Low-Latency
                </div>
              </div>

              {/* Central Doctor Graphic / Avatar with wave audio animation */}
              <div className="my-auto text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-emerald-950 border-4 border-emerald-500/40 mx-auto flex items-center justify-center text-4xl font-bold text-emerald-300 shadow-2xl">
                    EV
                  </div>
                  {/* Real-time audio ripple rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping pointer-events-none" />
                </div>
                <div>
                  <div className="font-bold text-lg text-white">Dr. Elena Vance, DVM</div>
                  <div className="text-xs text-emerald-400 font-medium">Listening to {activeAppointment.petName}'s symptoms</div>
                </div>
              </div>

              {/* Self Video PIP (Picture-in-picture) */}
              <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-video rounded-xl bg-stone-800/90 border border-stone-700 p-2 flex flex-col justify-between shadow-2xl overflow-hidden">
                <span className="text-[10px] text-stone-300 font-medium">Your Camera ({activeAppointment.petName})</span>
                <div className="flex items-center justify-center text-xs text-stone-400">
                  {isVideoOn ? (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Transmitting</span>
                    </div>
                  ) : (
                    <span>Camera Off</span>
                  )}
                </div>
                <div className="text-[9px] text-stone-500 text-right">HD Camera</div>
              </div>
            </div>

            {/* Bottom Call Controls Toolbar */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-colors ${
                  isMicOn ? 'bg-stone-800 hover:bg-stone-700 text-white' : 'bg-rose-900 text-rose-200'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoOn ? 'bg-stone-800 hover:bg-stone-700 text-white' : 'bg-rose-900 text-rose-200'
                }`}
                title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsConsultRoomOpen(false)}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Telehealth Visit</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Chat, Live Vitals, and Digital Prescription */}
          <div className="lg:col-span-5 bg-stone-900 border-l border-stone-800 flex flex-col min-h-0">
            {/* Tab Selector */}
            <div className="flex border-b border-stone-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                  activeTab === 'chat'
                    ? 'border-emerald-500 text-white bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                Live Clinical Chat
              </button>
              <button
                onClick={() => setActiveTab('vitals')}
                className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                  activeTab === 'vitals'
                    ? 'border-emerald-500 text-white bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                Patient Chart
              </button>
              <button
                onClick={() => setActiveTab('prescription')}
                className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
                  activeTab === 'prescription'
                    ? 'border-emerald-500 text-white bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                Live Rx & Diet Plan
              </button>
            </div>

            {/* Tab 1: Live Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0 p-4">
                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1">
                        <span>{m.sender === 'user' ? 'You' : 'Dr. Elena Vance'}</span>
                        <span>·</span>
                        <span className="font-mono">{m.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-stone-800 text-stone-100 rounded-tl-none border border-stone-700'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {isVetTyping && (
                    <div className="flex items-center gap-2 text-xs text-stone-400 italic py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                      <span>Dr. Vance is typing clinical response...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className="pt-2 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
                  <button
                    onClick={() => handleSendMessage("He licks his paws after eating regular poultry.")}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                  >
                    🐾 Paw licking question
                  </button>
                  <button
                    onClick={() => handleSendMessage("How many grams of freeze-dried beef should I serve?")}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                  >
                    🥩 Serving grams question
                  </button>
                  <button
                    onClick={() => handleSendMessage("Can I add the bone broth to his meals daily?")}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                  >
                    🍲 Bone broth question
                  </button>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 pt-2 border-t border-stone-800"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type symptom or ask Dr. Vance..."
                    className="flex-1 bg-stone-800 border border-stone-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Live Patient Chart & Vitals */}
            {activeTab === 'vitals' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                <div className="bg-stone-800/60 rounded-xl p-4 border border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200">Patient Baseline Metrics</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Sync: Verified</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Name & Species</span>
                      <strong className="text-white">{activePet?.name} ({activePet?.species})</strong>
                    </div>
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Weight</span>
                      <strong className="text-white font-mono">{activePet?.weightLbs} lbs</strong>
                    </div>
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Body Condition Score</span>
                      <strong className="text-emerald-400">5 / 9 (Ideal Muscle)</strong>
                    </div>
                    <div className="bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Resting Heart Rate</span>
                      <strong className="text-white font-mono">84 bpm (Normal)</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-stone-300">Reported Allergies & Intolerances:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePet?.allergies.map(all => (
                      <span key={all} className="bg-rose-950/80 text-rose-200 border border-rose-800 px-2.5 py-1 rounded text-[11px]">
                        ⛔ {all}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-stone-800/40 rounded-xl border border-stone-700 space-y-1">
                  <span className="font-bold text-stone-200">Current Health Target:</span>
                  <p className="text-stone-400">{activePet?.dietaryGoal}</p>
                </div>
              </div>
            )}

            {/* Tab 3: Digital Prescription & Diet Plan */}
            {activeTab === 'prescription' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Official Veterinary Dietary Recommendation</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    Prescribed by {activeAppointment.vetName} for {activeAppointment.petName}. Validated under AAFCO Complete & Balanced Nutrition guidelines.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-emerald-800/60">
                    <div className="font-semibold text-white">Recommended Meal Plan:</div>
                    <div className="bg-stone-900 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">Pasture-Raised Grass-Fed Beef & Organs</div>
                        <div className="text-[10px] text-stone-400">180g / day split into 2 meals</div>
                      </div>
                      <button
                        onClick={() => addToCart(products[1], '3.5 lb Bag')}
                        className="px-2.5 py-1.5 text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg"
                      >
                        Add to Cart
                      </button>
                    </div>

                    <div className="bg-stone-900 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">Artisan Golden Bone Broth & Collagen</div>
                        <div className="text-[10px] text-stone-400">50ml topper morning and evening</div>
                      </div>
                      <button
                        onClick={() => addToCart(products[4], '32 fl oz Bottle')}
                        className="px-2.5 py-1.5 text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-800/50 rounded-xl text-stone-300 space-y-1">
                  <div className="font-semibold text-white">Transition Protocol:</div>
                  <p className="text-[11px] text-stone-400">
                    Days 1–3: 75% old food, 25% organic raw. Days 4–5: 50/50. Day 6: 75% raw. Day 7: 100% PetCart Organic.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
