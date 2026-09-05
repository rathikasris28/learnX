import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  PenTool,
  MonitorUp,
  Clock,
  Sparkles,
  Send,
  Star,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Code2,
  LayoutGrid,
  Columns,
  Maximize2,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeCreditNotice } from '../../components/common/TimeCreditNotice';
import { LiveWebcamFeed } from '../../components/sessions/LiveWebcamFeed';
import { FrontendCodeStudio } from '../../components/sessions/FrontendCodeStudio';

export const SessionRoomPage: React.FC = () => {
  const {
    selectedSession,
    completeSession,
    setActiveView,
    showToast,
    currentUser,
    setIsEmailVerificationModalOpen
  } = useApp();

  // Media Controls
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  // Layout mode:
  // 'split' = Frontend Code in center, cameras stacked on right
  // 'face-to-face' = Mentor & Learner dual cameras side-by-side (50/50)
  // 'code-focus' = Full Code Studio with floating PIP camera
  const [layoutMode, setLayoutMode] = useState<'split' | 'face-to-face' | 'code-focus'>('split');
  const [isMeetingOpen, setIsMeetingOpen] = useState(true);

  // Secondary panel tabs
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'whiteboard'>('chat');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(720); // 12 mins in
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Priya Raman', text: 'Hi Aarav! Welcome to today’s session. Let’s dive into Frontend coding and functions.', time: '6:02 PM' },
    { sender: 'Aarav Sundaram', text: 'Hey Priya! Thanks, I opened the Frontend Code Studio. Ready to code together on camera!', time: '6:03 PM' },
    { sender: 'Priya Raman', text: 'Great! I see your webcam is active. Let’s build an interactive counter component.', time: '6:04 PM' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [sharedNotes, setSharedNotes] = useState<string>(
    `# Session Notes: Frontend Development & Peer Pair-Programming\n\n- HTML5 Semantic Structure\n- Modern CSS & Tailwind utility styling\n- Event Listeners and State mutations\n- Component Reusability & Clean Code\n\nMentor Tip:\n"Keep your state variable minimal and update the DOM directly or through React state hooks."`
  );

  // End session dialog state
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('Outstanding session! Really helped clarify interactive UI state handling and frontend component architecture.');

  // Canvas ref for whiteboard
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const senderName = currentUser?.name || 'You';
    setMessages((prev) => [
      ...prev,
      { sender: senderName, text: chatInput.trim(), time: 'Just now' }
    ]);
    setChatInput('');
  };

  // Canvas sketch handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0d9488';
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirmEndSession = () => {
    if (selectedSession) {
      completeSession(selectedSession.id, rating, feedback);
    }
    setIsEndModalOpen(false);
    setActiveView('sessions');
  };

  const handleSyncSnippet = (snippet: string) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: currentUser?.name || 'Aarav Sundaram',
        text: `Shared code snippet with mentor:\n\`\`\`html\n${snippet.slice(0, 140)}...\n\`\`\``,
        time: 'Just now'
      }
    ]);
    showToast('Code synced with mentor!', 'success');
  };

  if (!selectedSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">No session selected</h1>
          <p className="text-slate-400 mt-2">Choose a booked session before entering the live room.</p>
          <button onClick={() => setActiveView('sessions')} className="mt-5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-sm">View sessions</button>
        </div>
      </div>
    );
  }

  const session = selectedSession;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* Top Session Header Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        
        {/* Left: Brand Emblem & Session Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-700 flex items-center justify-center overflow-hidden shadow">
            <img
              src="https://cdn.phototourl.com/free/2026-09-05-64dcc94e-b14d-45c2-b144-78f775597507.jpg"
              alt="LearnX Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm font-heading tracking-tight text-white">
                Learn<span className="text-teal-400">X</span> Live Room
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live 1-on-1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {session.skillTitle} with <strong className="text-teal-300">{session.trainerName}</strong>
            </p>
          </div>
        </div>

        {/* Center: Timer & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono text-teal-300 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Email verification reminder pill */}
          {currentUser && !currentUser.isEmailVerified && (
            <button
              onClick={() => setIsEmailVerificationModalOpen(true)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold hover:bg-amber-500/30 transition"
              title="Verify your email to secure credit accreditation"
            >
              <Mail className="w-3 h-3" />
              <span>Verify Email (+2 Credits)</span>
            </button>
          )}
        </div>

        {/* Right: Layout Switcher & End Button */}
        <div className="flex items-center gap-2">
          {/* View layout modes */}
          <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 gap-1">
            <button
              onClick={() => setLayoutMode('split')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                layoutMode === 'split' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Split View: Frontend Code Studio + Face-to-Face Cameras"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="text-[10px]">Split</span>
            </button>
            <button
              onClick={() => setLayoutMode('face-to-face')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                layoutMode === 'face-to-face' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Face-to-Face: Large Dual Camera View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[10px]">Face-to-Face</span>
            </button>
            <button
              onClick={() => setLayoutMode('code-focus')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                layoutMode === 'code-focus' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Code Focus: Maximum Code Playground"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="text-[10px]">Code</span>
            </button>
          </div>

          <button
            id="leave-session-btn"
            onClick={() => setIsEndModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <div className="flex-1 p-3 sm:p-4 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        
        {/* ======================================================== */}
        {/* LAYOUT 1: SPLIT MODE (Code Studio on left, Dual Cameras & Chat on right) */}
        {/* ======================================================== */}
        {layoutMode === 'split' && (
          <>
            {/* Left 7 cols: Frontend Code Studio */}
            <div className="lg:col-span-7 h-full flex flex-col min-h-0">
              {isMeetingOpen ? (
                <div className="h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-black flex flex-col">
                  <div className="h-10 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                    <span className="text-xs font-bold text-slate-200">Live Jitsi Meeting</span>
                    <button onClick={() => setIsMeetingOpen(false)} className="text-[11px] text-teal-300 hover:text-white">Open Code Studio</button>
                  </div>
                  <iframe
                    title={`LearnX meeting with ${session.trainerName}`}
                    src={`https://meet.jit.si/learnx-${encodeURIComponent(session.id)}`}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    className="w-full flex-1 border-0"
                  />
                  <a href={`https://meet.jit.si/learnx-${encodeURIComponent(session.id)}`} target="_blank" rel="noreferrer" className="bg-slate-900 px-3 py-2 text-[11px] text-teal-300 hover:text-white text-center">Meeting not loading? Open Jitsi in a new tab</a>
                </div>
              ) : (
                <div className="h-full relative">
                  <FrontendCodeStudio onSyncCodeWithMentor={handleSyncSnippet} trainerName={session.trainerName} />
                  <button onClick={() => setIsMeetingOpen(true)} className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold">Open Meeting</button>
                </div>
              )}
            </div>

            {/* Right 5 cols: Face-to-Face Cameras + Chat/Whiteboard */}
            <div className="lg:col-span-5 h-full flex flex-col gap-3 min-h-0 overflow-y-auto">
              
              {/* Dual Face-to-Face Cameras (Mentor + Learner) */}
              <div className="grid grid-cols-2 gap-2 h-48 sm:h-56 shrink-0">
                <LiveWebcamFeed
                  userName={session.trainerName}
                  userRole="Knowledge Sharer"
                  isLocalUser={false}
                  avatarUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                />
                <LiveWebcamFeed
                  userName={currentUser?.name || 'Aarav Sundaram'}
                  userRole="Learner (You)"
                  isLocalUser={true}
                  isVideoOff={isVideoOff}
                  isMuted={isMuted}
                  onToggleVideo={() => setIsVideoOff(!isVideoOff)}
                  onToggleAudio={() => setIsMuted(!isMuted)}
                />
              </div>

              {/* Bottom Tab Box: Chat, Notes, Whiteboard */}
              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden min-h-[220px]">
                
                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                      activeTab === 'chat'
                        ? 'bg-slate-800 text-teal-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                      activeTab === 'notes'
                        ? 'bg-slate-800 text-teal-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Notes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('whiteboard')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                      activeTab === 'whiteboard'
                        ? 'bg-slate-800 text-teal-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Whiteboard</span>
                  </button>
                </div>

                {/* Tab Body */}
                <div className="flex-1 p-3 overflow-y-auto flex flex-col min-h-0">
                  {activeTab === 'chat' && (
                    <div className="flex flex-col h-full justify-between space-y-2">
                      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                        {messages.map((m, i) => {
                          const isMe = m.sender === 'Aarav Sundaram' || m.sender === currentUser?.name || m.sender === 'You';
                          return (
                            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <span className="text-[10px] text-slate-500 mb-0.5">{m.sender} • {m.time}</span>
                              <div
                                className={`p-2 rounded-xl text-xs max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                                  isMe
                                    ? 'bg-teal-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}
                              >
                                {m.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <form onSubmit={handleSendMessage} className="flex gap-1.5 pt-2 border-t border-slate-800">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type a message to peer..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                        <button
                          type="submit"
                          className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <textarea
                      value={sharedNotes}
                      onChange={(e) => setSharedNotes(e.target.value)}
                      className="w-full h-full bg-transparent font-mono text-xs text-slate-300 resize-none focus:outline-none leading-relaxed"
                    />
                  )}

                  {activeTab === 'whiteboard' && (
                    <div className="flex flex-col h-full space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Sketch architectural flow</span>
                        <button
                          onClick={clearWhiteboard}
                          className="text-[11px] text-red-400 hover:text-red-300 underline"
                        >
                          Clear Board
                        </button>
                      </div>
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={220}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-xl cursor-crosshair touch-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* LAYOUT 2: FACE-TO-FACE FOCUSED (50/50 Dual Camera Grid) */}
        {/* ======================================================== */}
        {layoutMode === 'face-to-face' && (
          <div className="lg:col-span-12 h-full flex flex-col gap-3 min-h-0">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
              {/* Mentor Large Camera */}
              <div className="h-full flex flex-col">
                <LiveWebcamFeed
                  userName={session.trainerName}
                  userRole="Knowledge Sharer"
                  isLocalUser={false}
                  avatarUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                />
              </div>

              {/* Learner Live Camera */}
              <div className="h-full flex flex-col">
                <LiveWebcamFeed
                  userName={currentUser?.name || 'Aarav Sundaram'}
                  userRole="Learner (You)"
                  isLocalUser={true}
                  isVideoOff={isVideoOff}
                  isMuted={isMuted}
                  onToggleVideo={() => setIsVideoOff(!isVideoOff)}
                  onToggleAudio={() => setIsMuted(!isMuted)}
                />
              </div>
            </div>

            {/* Quick Banner to switch to Frontend Coding */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300">
                  Ready to code together? Switch to <strong>Split Screen</strong> to run frontend code while talking face-to-face.
                </span>
              </div>
              <button
                onClick={() => setLayoutMode('split')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Open Code Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* LAYOUT 3: CODE FOCUS (Full stage code with Floating PIP) */}
        {/* ======================================================== */}
        {layoutMode === 'code-focus' && (
          <div className="lg:col-span-12 h-full relative min-h-0">
            <FrontendCodeStudio
              onSyncCodeWithMentor={handleSyncSnippet}
              trainerName={session.trainerName}
            />

            {/* Floating Picture-in-Picture for Face-to-Face */}
            <div className="absolute top-14 right-4 w-48 sm:w-56 h-36 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20">
              <LiveWebcamFeed
                userName={currentUser?.name || 'You'}
                userRole="Learner (You)"
                isLocalUser={true}
                isVideoOff={isVideoOff}
                isMuted={isMuted}
                onToggleVideo={() => setIsVideoOff(!isVideoOff)}
                onToggleAudio={() => setIsMuted(!isMuted)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Media Controls Bar */}
      <footer className="h-16 bg-slate-900/90 border-t border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="text-xs text-slate-400 hidden md:block">
          Goal: <span className="text-slate-200">{session.learningGoal}</span>
        </div>

        {/* Center Control Pills */}
        <div className="flex items-center gap-3 mx-auto md:mx-0">
          {/* Audio Mic Toggle */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info');
            }}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-teal-400" />}
          </button>

          {/* Video Camera Toggle */}
          <button
            onClick={() => {
              setIsVideoOff(!isVideoOff);
              showToast(isVideoOff ? 'Camera turned on' : 'Camera turned off', 'info');
            }}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-teal-400" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => {
              setIsScreenSharing(!isScreenSharing);
              showToast(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing active', 'info');
            }}
            className={`p-3 rounded-2xl transition-all shadow-md ${
              isScreenSharing
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
            title="Toggle Screen Share"
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Switch to Frontend Coding mode quickly */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'split' ? 'face-to-face' : 'split')}
            className={`px-3 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              layoutMode === 'split'
                ? 'bg-teal-500 text-slate-950 shadow-teal-500/20 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700'
            }`}
            title="Toggle Frontend Coding Split"
          >
            <Code2 className="w-5 h-5" />
            <span className="hidden sm:inline">
              {layoutMode === 'split' ? 'Coding Active' : 'Open Frontend Code'}
            </span>
          </button>
        </div>

        {/* Right Info */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Verified Dual Confirmation Session</span>
        </div>
      </footer>

      {/* End Session & Dual Confirmation Modal */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading">
                Confirm Session Completion
              </h3>
              <p className="text-xs text-slate-600">
                Both participants confirm successful knowledge exchange. This updates your Trust & Reliability Score.
              </p>
            </div>

            {/* Rating Stars */}
            <div className="text-center space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Rate knowledge sharing experience with {session.trainerName}:
              </label>
              <div className="flex items-center justify-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peer Review & Commendation
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <TimeCreditNotice compact />

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEndModalOpen(false)}
                className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Return to Room
              </button>
              <button
                type="button"
                onClick={handleConfirmEndSession}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
              >
                Complete & Submit (1 Credit)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
