import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, CheckCircle, Edit3, X, Loader2 } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface FloatingAvatarProps {
  isVisible: boolean;
  onRecordingStart: () => void;
  onRecordingStop: (recordingTime: number) => void;
  state: 'idle' | 'recording' | 'processing' | 'complete' | 'showing-summary' | 'editing';
  editingItem?: string;
  onEditComplete?: () => void;
  processedTask?: string;
}

export function FloatingAvatar({ 
  isVisible, 
  onRecordingStart, 
  onRecordingStop, 
  state,
  editingItem,
  onEditComplete,
  processedTask = ''
}: FloatingAvatarProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [drizzleParticles, setDrizzleParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  // Generate drizzle particles effect
  useEffect(() => {
    if (isVisible) {
      const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        delay: Math.random() * 2
      }));
      setDrizzleParticles(particles);
    }
  }, [isVisible]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === 'recording') {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 100);
      }, 100);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    if (state === 'idle' || state === 'editing') {
      onRecordingStart();
    }
  };

  const stopRecording = () => {
    if (state === 'recording') {
      onRecordingStop(recordingTime);
    }
  };

  const getAvatarStyles = () => {
    if (state === 'complete' || state === 'showing-summary') {
      return {
        gradient: 'from-emerald-600 to-emerald-700',
        shadow: 'shadow-lg shadow-emerald-500/20',
        ring: 'ring-2 ring-emerald-500/30'
      };
    }
    if (state === 'processing') {
      return {
        gradient: editingItem ? 'from-violet-600 to-violet-700' : 'from-blue-600 to-blue-700',
        shadow: editingItem ? 'shadow-lg shadow-violet-500/20' : 'shadow-lg shadow-blue-500/20',
        ring: editingItem ? 'ring-2 ring-violet-500/30' : 'ring-2 ring-blue-500/30'
      };
    }
    if (state === 'recording') {
      return {
        gradient: 'from-red-600 to-red-700',
        shadow: 'shadow-lg shadow-red-500/20',
        ring: 'ring-2 ring-red-500/30'
      };
    }
    if (state === 'editing') {
      return {
        gradient: 'from-violet-600 to-violet-700',
        shadow: 'shadow-lg shadow-violet-500/20',
        ring: 'ring-2 ring-violet-500/30'
      };
    }
    return {
      gradient: 'from-slate-700 to-slate-800',
      shadow: 'shadow-lg shadow-slate-500/15',
      ring: 'ring-1 ring-slate-400/20'
    };
  };

  const styles = getAvatarStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 80 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Subtle Drizzle Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {drizzleParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-0.5 h-6 bg-gradient-to-b from-blue-200/30 to-transparent rounded-full"
                style={{ left: `${particle.x}%` }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ 
                  y: 80, 
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Professional pulse rings for recording */}
          {state === 'recording' && (
            <motion.div
              className="absolute inset-0 rounded-full border border-red-400/20"
              animate={{ 
                scale: [1, 1.4],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}

          {/* Main avatar button */}
          <motion.button
            className={`relative w-16 h-16 rounded-full bg-gradient-to-b ${styles.gradient} ${styles.shadow} ${styles.ring}
                       flex items-center justify-center border-none outline-none
                       ${state === 'processing' || state === 'complete' || state === 'showing-summary' ? 'cursor-default' : 'cursor-pointer active:scale-95'} 
                       transition-all duration-150 ease-out`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={state === 'processing' || state === 'complete' || state === 'showing-summary'}
            whileHover={state !== 'processing' && state !== 'complete' && state !== 'showing-summary' ? { scale: 1.05 } : {}}
            whileTap={state !== 'processing' && state !== 'complete' && state !== 'showing-summary' ? { scale: 0.98 } : {}}
          >
            {/* Content based on state */}
            <AnimatePresence mode="wait">
              {state === 'processing' && editingItem ? (
                <motion.div
                  key="processing-edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white flex items-center justify-center"
                >
                  <Loader2 
                    size={20} 
                    className="animate-spin" 
                    strokeWidth={2.5}
                  />
                </motion.div>
              ) : state === 'processing' ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white flex items-center justify-center"
                >
                  <Loader2 
                    size={20} 
                    className="animate-spin" 
                    strokeWidth={2.5}
                  />
                </motion.div>
              ) : state === 'editing' ? (
                <motion.div
                  key="editing"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-white flex items-center justify-center"
                >
                  <Edit3 size={20} strokeWidth={2.5} />
                </motion.div>
              ) : state === 'complete' || state === 'showing-summary' ? (
                <motion.div
                  key="complete"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="text-white flex items-center justify-center"
                >
                  <CheckCircle size={20} strokeWidth={2.5} />
                </motion.div>
              ) : state === 'recording' ? (
                <motion.div
                  key="recording"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white flex flex-col items-center justify-center w-full"
                >
                  <AudioWaveform isRecording={true} size="small" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-white flex items-center justify-center"
                >
                  <Stethoscope size={20} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Professional status indicator */}
          <motion.div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white
                       ${(state === 'complete' || state === 'showing-summary') ? 'bg-emerald-500' : 
                         state === 'recording' ? 'bg-red-500' : 
                         state === 'processing' ? (editingItem ? 'bg-violet-500' : 'bg-blue-500') : 
                         state === 'editing' ? 'bg-violet-500' : 'bg-slate-500'}`}
            animate={
              state === 'recording' ? {
                scale: [1, 1.3, 1],
              } : state === 'processing' ? {
                opacity: [1, 0.5, 1],
              } : (state === 'complete' || state === 'showing-summary') ? {
                scale: [1, 1.2, 1],
              } : {}
            }
            transition={{ 
              duration: state === 'processing' ? 1.5 : 2, 
              repeat: (state === 'recording' || state === 'processing' || state === 'complete' || state === 'showing-summary') ? Infinity : 0,
              ease: "easeInOut"
            }}
          />

          {/* Recording time display */}
          {state === 'recording' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-mono"
            >
              {formatTime(recordingTime)}
            </motion.div>
          )}

          {/* Edit prompt when in editing mode */}
          {state === 'editing' && editingItem && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-64 bg-white/95 backdrop-blur-sm border border-violet-200/50 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Edit3 size={16} className="text-violet-600" />
                  <span className="font-medium text-slate-800">Edit Report</span>
                </div>
                <button
                  onClick={onEditComplete}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={14} className="text-slate-500" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                How would you like to edit "{editingItem}"?
              </p>
              <div className="text-xs text-violet-600 flex items-center space-x-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                <span>Press & hold to give voice instructions</span>
              </div>
            </motion.div>
          )}

          {/* Success message for completed edits */}
          {state === 'showing-summary' && processedTask && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-64 bg-white/95 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle size={16} className="text-emerald-600" />
                <span className="font-medium text-slate-800">Task Complete</span>
              </div>
              <p className="text-sm text-slate-600">
                {processedTask}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}