import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Eye,
  Terminal,
  Sparkles,
  Share2,
  FileCode,
  Layers
} from 'lucide-react';

interface FrontendCodeStudioProps {
  onSyncCodeWithMentor?: (snippet: string) => void;
  trainerName?: string;
}

const TEMPLATES = [
  {
    id: 'counter',
    name: 'Interactive Counter (HTML + Tailwind + JS)',
    lang: 'frontend',
    code: `<!-- LearnX Frontend Challenge: Interactive Counter Component -->
<div class="p-6 max-w-sm mx-auto bg-slate-900 rounded-2xl shadow-xl border border-teal-500/30 text-center font-sans">
  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-4">
    <span>⚡ LearnX Live Frontend</span>
  </div>
  
  <h3 class="text-lg font-bold text-white mb-2">Time Credit Multiplier</h3>
  <p class="text-xs text-slate-400 mb-6">Mastering peer-to-peer knowledge sharing</p>

  <div class="text-5xl font-extrabold text-teal-400 font-mono mb-6" id="counter-val">
    0
  </div>

  <div class="flex justify-center gap-3">
    <button 
      id="decrement-btn" 
      class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold border border-slate-700 active:scale-95 transition"
    >
      - 1 Credit
    </button>
    <button 
      id="increment-btn" 
      class="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 rounded-xl text-sm font-bold active:scale-95 shadow-lg shadow-teal-500/20 transition"
    >
      + 1 Credit
    </button>
  </div>
</div>

<script>
  let count = 0;
  const display = document.getElementById('counter-val');
  
  document.getElementById('increment-btn').addEventListener('click', () => {
    count++;
    display.textContent = count;
    console.log('Credits updated:', count);
  });

  document.getElementById('decrement-btn').addEventListener('click', () => {
    if (count > 0) count--;
    display.textContent = count;
    console.log('Credits updated:', count);
  });
</script>`
  },
  {
    id: 'profile-card',
    name: 'LearnX Peer Card (Tailwind + HTML)',
    lang: 'frontend',
    code: `<!-- LearnX Knowledge Sharer Card Component -->
<div class="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl text-slate-100">
  <div class="flex items-center gap-4 mb-4">
    <div class="relative">
      <img 
        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
        alt="Priya Raman"
        class="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
      />
      <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
    </div>
    
    <div>
      <div class="flex items-center gap-2">
        <h4 class="font-extrabold text-lg text-white">Priya Raman</h4>
        <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
          Verified Peer
        </span>
      </div>
      <p class="text-xs text-slate-400">Senior Python & React Lead</p>
      <div class="flex items-center gap-1 text-xs text-amber-400 mt-1">
        <span>★ 4.95 rating</span>
        <span class="text-slate-500">• 48 sessions shared</span>
      </div>
    </div>
  </div>

  <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 mb-4 text-xs text-slate-300">
    <span class="text-teal-400 font-bold block mb-1">Knowledge Areas:</span>
    <div class="flex flex-wrap gap-1.5">
      <span class="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-200">React Hooks</span>
      <span class="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-200">Tailwind CSS</span>
      <span class="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-200">Python OOP</span>
    </div>
  </div>

  <button class="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition">
    Exchange 1 Hour Learning
  </button>
</div>`
  },
  {
    id: 'python-example',
    name: 'Python: Functions & Variable Arguments',
    lang: 'python',
    code: `# LearnX Interactive Python Exercise: Variable Arguments
def calculate_session_credits(*student_credits, bonus_rate=1.2):
    """
    Calculate accumulated Time Credits with peer mentor incentive.
    *student_credits packs multiple integer parameters into a tuple.
    """
    base_sum = sum(student_credits)
    total_with_bonus = base_sum * bonus_rate
    return {
        "base_credits": base_sum,
        "bonus_multiplier": bonus_rate,
        "final_credits": round(total_with_bonus, 2)
    }

# Execute function with variable arguments
result = calculate_session_credits(2, 3, 1, 4, bonus_rate=1.25)
print("=== LearnX Time Credit Simulation ===")
for key, value in result.items():
    print(f"{key}: {value}")`
  }
];

export const FrontendCodeStudio: React.FC<FrontendCodeStudioProps> = ({
  onSyncCodeWithMentor,
  trainerName = 'Priya Raman'
}) => {
  const [activeTemplate, setActiveTemplate] = useState<string>('counter');
  const [code, setCode] = useState<string>(TEMPLATES[0].code);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'console'>('preview');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[LearnX Console] Environment initialized. Ready to execute code.',
    '[Mentor Synced] Priya Raman joined your frontend code workspace.'
  ]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // Switch template
  const handleTemplateChange = (id: string) => {
    const t = TEMPLATES.find((item) => item.id === id);
    if (t) {
      setActiveTemplate(id);
      setCode(t.code);
      runCode(t.code);
    }
  };

  // Run code inside sandboxed iframe
  const runCode = (codeToRun: string) => {
    setIsRunning(true);
    setConsoleOutput((prev) => [
      ...prev,
      `> [${new Date().toLocaleTimeString()}] Executing code...`
    ]);

    setPreviewHtml(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body {
                  margin: 0;
                  padding: 16px;
                  background-color: #0f172a;
                  color: #f8fafc;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  box-sizing: border-box;
                }
              </style>
            </head>
            <body>
              ${codeToRun}
              <script>
                // Intercept console.log
                const originalLog = console.log;
                console.log = (...args) => {
                  window.parent.postMessage({ type: 'LOG', data: args.join(' ') }, '*');
                  originalLog(...args);
                };
              </script>
            </body>
          </html>
        `);

    setTimeout(() => {
      setIsRunning(false);
    }, 400);
  };

  useEffect(() => {
    runCode(code);

    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'LOG') {
        setConsoleOutput((prev) => [...prev, `[Console] ${e.data.data}`]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShareWithMentor = () => {
    if (onSyncCodeWithMentor) {
      onSyncCodeWithMentor(code);
    }
    setConsoleOutput((prev) => [
      ...prev,
      `[Shared] Code synced with mentor ${trainerName}.`
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Studio Header Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
              Frontend Code Studio
              <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono">
                Live Preview
              </span>
            </h3>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <select
            value={activeTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="text-[11px] bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-teal-500"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Run Code Button */}
          <button
            onClick={() => runCode(code)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold shadow transition"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Mode / Tab switcher for editor vs live preview */}
      <div className="bg-slate-900/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition font-medium ${
              activeTab === 'editor'
                ? 'bg-slate-800 text-teal-300 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Code Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition font-medium ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-teal-300 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Render View</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition font-medium ${
              activeTab === 'console'
                ? 'bg-slate-800 text-teal-300 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console ({consoleOutput.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShareWithMentor}
            className="p-1 text-slate-400 hover:text-teal-400 rounded hover:bg-slate-800 text-[11px] flex items-center gap-1"
            title={`Sync code snippet with mentor ${trainerName}`}
          >
            <Share2 className="w-3 h-3" />
            <span className="hidden sm:inline">Share with Mentor</span>
          </button>
          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 text-[11px]"
            title="Copy Code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 relative flex flex-col min-h-[300px] overflow-hidden">
        {/* Editor View */}
        {activeTab === 'editor' && (
          <div className="w-full h-full flex flex-col relative bg-[#0b0f19]">
            <div className="px-3 py-1 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">editable_frontend.html</span>
              <span className="text-teal-400 text-[10px]">
                Type code then press "Run" or switch to Live Render View
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 p-4 font-mono text-xs text-slate-200 bg-transparent resize-none focus:outline-none leading-relaxed selection:bg-teal-500/30 selection:text-white"
            />
            {/* Quick helper tag */}
            <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>{code.split('\n').length} lines • Tailwind 3.4 CDN embedded</span>
              <button
                onClick={() => runCode(code)}
                className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
              >
                <span>Run & Preview</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            </div>
          </div>
        )}

        {/* Live Preview View */}
        <div
          className={`w-full h-full flex-col bg-slate-950 ${
            activeTab === 'preview' ? 'flex' : 'hidden'
          }`}
        >
          <iframe
            title="Frontend Code Live Preview"
            sandbox="allow-scripts"
            srcDoc={previewHtml}
            className="w-full h-full border-0 bg-slate-950"
          />
        </div>

        {/* Console View */}
        {activeTab === 'console' && (
          <div className="w-full h-full bg-slate-950 p-4 font-mono text-xs overflow-y-auto space-y-1.5 text-slate-300">
            {consoleOutput.map((log, idx) => (
              <div
                key={idx}
                className={`py-0.5 ${
                  log.includes('Error')
                    ? 'text-red-400'
                    : log.includes('Executing')
                    ? 'text-amber-300'
                    : log.includes('Mentor')
                    ? 'text-teal-300'
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
