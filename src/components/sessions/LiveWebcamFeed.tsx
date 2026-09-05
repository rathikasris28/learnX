import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  RotateCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Maximize2
} from 'lucide-react';

interface LiveWebcamFeedProps {
  userName: string;
  userRole?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  onToggleVideo?: () => void;
  onToggleAudio?: () => void;
  isLocalUser?: boolean;
  avatarUrl?: string;
}

export const LiveWebcamFeed: React.FC<LiveWebcamFeedProps> = ({
  userName,
  userRole = 'Learner',
  isMuted = false,
  isVideoOff = false,
  onToggleVideo,
  onToggleAudio,
  isLocalUser = true,
  avatarUrl
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [videoFilter, setVideoFilter] = useState<'none' | 'bright' | 'contrast' | 'cool'>('none');
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Simulated peer video animation for remote trainer
  const [remoteSpeaking, setRemoteSpeaking] = useState<boolean>(true);

  // Initialize camera for local user
  useEffect(() => {
    if (!isLocalUser) {
      // Simulate remote audio fluctuation
      const interval = setInterval(() => {
        setRemoteSpeaking(Math.random() > 0.3);
      }, 1500);
      return () => clearInterval(interval);
    }

    let currentStream: MediaStream | null = null;

    const startWebcam = async () => {
      if (isVideoOff) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        setCameraState('idle');
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('error');
        setErrorMessage('Webcam API is not supported in this browser environment.');
        return;
      }

      try {
        setCameraState('requesting');
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: true
        });

        currentStream = userMedia;
        setStream(userMedia);
        setCameraState('active');
        setErrorMessage('');

        if (videoRef.current) {
          videoRef.current.srcObject = userMedia;
          videoRef.current.play().catch((e) => console.log('Autoplay handled', e));
        }
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setCameraState('denied');
        setErrorMessage(
          err.name === 'NotAllowedError'
            ? 'Camera permission was denied or iframe restricted. Using virtual camera preview.'
            : 'Camera could not be accessed. Using virtual face-to-face mode.'
        );
      }
    };

    startWebcam();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLocalUser, isVideoOff]);

  // Sync mute state to audio tracks
  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [stream, isMuted]);

  // Audio level animation for local speaker
  useEffect(() => {
    if (isVideoOff || isMuted) {
      setAudioLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 85) + 15);
    }, 250);
    return () => clearInterval(interval);
  }, [isMuted, isVideoOff]);

  const toggleMirror = () => {
    setIsMirrored((prev) => !prev);
  };

  const cycleFilter = () => {
    const filters: ('none' | 'bright' | 'contrast' | 'cool')[] = ['none', 'bright', 'contrast', 'cool'];
    const nextIdx = (filters.indexOf(videoFilter) + 1) % filters.length;
    setVideoFilter(filters[nextIdx]);
  };

  const getFilterStyle = () => {
    switch (videoFilter) {
      case 'bright':
        return 'brightness-110 saturate-105';
      case 'contrast':
        return 'contrast-125 saturate-110';
      case 'cool':
        return 'hue-rotate-15 contrast-105';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[220px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col group shadow-lg">
      {/* Remote Peer Video (Priya Raman) */}
      {!isLocalUser && (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'}
            alt={userName}
            className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
          
          {/* Active Speaking Indicator */}
          {remoteSpeaking && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/50 backdrop-blur-md text-teal-300 text-[11px] font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Speaking</span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>1080p 60fps HD</span>
          </div>
        </div>
      )}

      {/* Local User Live Camera */}
      {isLocalUser && (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-slate-900">
          {/* Active webcam stream */}
          {cameraState === 'active' && !isVideoOff && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${getFilterStyle()}`}
            />
          )}

          {/* Requesting Camera Loader */}
          {cameraState === 'requesting' && (
            <div className="text-center p-6 space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-300 font-medium">Requesting browser camera access...</p>
              <p className="text-[11px] text-slate-500">Please click "Allow" when your browser prompts for camera and microphone</p>
            </div>
          )}

          {/* Virtual Camera Fallback / Camera Off View */}
          {(isVideoOff || cameraState === 'denied' || cameraState === 'error' || cameraState === 'idle') && (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative">
              <div className="relative mb-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-teal-500/40 shadow-xl mx-auto">
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Audio pulse ring */}
                {!isMuted && audioLevel > 30 && (
                  <span className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-75" />
                )}
              </div>

              <h4 className="text-sm font-bold text-white">{userName}</h4>
              <p className="text-[11px] text-teal-400 font-medium mb-3">{userRole}</p>

              {cameraState === 'denied' && (
                <div className="max-w-[260px] bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Virtual Camera Mode</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {errorMessage || 'Webcam simulated in preview.'}
                  </p>
                  {onToggleVideo && (
                    <button
                      onClick={onToggleVideo}
                      className="mt-1 px-3 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] transition"
                    >
                      Retry Camera
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Camera Filter & Mirror Controls Overlay */}
          {cameraState === 'active' && !isVideoOff && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/70 backdrop-blur p-1 rounded-lg border border-slate-700/60 z-20">
              <button
                onClick={toggleMirror}
                className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 text-[10px] flex items-center gap-1"
                title="Flip Camera Mirror"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={cycleFilter}
                className="p-1 text-slate-300 hover:text-teal-400 rounded hover:bg-slate-800 text-[10px] flex items-center gap-1"
                title="Cycle Video Lighting Filter"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="uppercase text-[9px] font-mono">{videoFilter}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Name and audio indicator footer overlay */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 pt-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Mic status */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              isMuted ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/20 text-teal-400'
            }`}
          >
            {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-white text-xs truncate max-w-[120px] sm:max-w-[180px]">
              {userName}
            </span>
            <span className="text-[10px] text-teal-400 font-medium">({userRole})</span>
          </div>
        </div>

        {/* Audio Visualizer Bar */}
        {!isMuted && (
          <div className="flex items-center gap-0.5 h-3">
            {[40, 70, 95, 60, 30].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-teal-400 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(3, (h * (audioLevel || 25)) / 100)}px`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
