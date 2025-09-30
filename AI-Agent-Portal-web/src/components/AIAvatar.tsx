import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, CheckCircle } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface AIAvatarProps {
  isRecording: boolean;
  isProcessing: boolean;
  isComplete: boolean;
  isShowingSummary?: boolean;
  onRecordingStart: () => void;
  onRecordingStop: (recordingTime: number) => void;
  isDisabled: boolean;
  processedTask?: string;
}

export function AIAvatar({ 
  isRecording, 
  isProcessing, 
  isComplete,
  isShowingSummary = false,
  onRecordingStart, 
  onRecordingStop, 
  isDisabled,
  processedTask = ''
}: AIAvatarProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(() => {
    if (isDisabled) return;
    
    setRecordingTime(0);
    startTimeRef.current = Date.now();
    onRecordingStart();
    
    recordingInterval.current = setInterval(() => {
      setRecordingTime(Date.now() - startTimeRef.current);
    }, 10);
  }, [isDisabled, onRecordingStart]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    
    const finalTime = Date.now() - startTimeRef.current;
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    
    onRecordingStop(finalTime);
    setRecordingTime(0);
  }, [isRecording, onRecordingStop]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Define avatar state styles
  const getAvatarStyles = () => {
    if (isComplete || isShowingSummary) {
      return {
        gradient: 'from-emerald-500 via-green-500 to-teal-500',
        shadow: 'shadow-2xl shadow-emerald-500/25',
        ring: 'ring-4 ring-emerald-400/30'
      };
    }
    if (isProcessing) {
      return {
        gradient: 'from-blue-500 via-cyan-500 to-blue-600',
        shadow: 'shadow-2xl shadow-blue-500/25',
        ring: 'ring-4 ring-blue-400/30'
      };
    }
    if (isRecording) {
      return {
        gradient: 'from-red-500 via-rose-500 to-red-600',
        shadow: 'shadow-2xl shadow-red-500/25',
        ring: 'ring-4 ring-red-400/50'
      };
    }
    return {
      gradient: 'from-slate-700 via-slate-600 to-slate-800',
      shadow: 'shadow-xl shadow-slate-500/20',
      ring: 'ring-2 ring-slate-400/20'
    };
  };

  const styles = getAvatarStyles();

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Recording pulse rings */}
      {isRecording && (
        <>
          <motion.div
            className="absolute rounded-full border border-red-400/40"
            initial={{ width: 180, height: 180, opacity: 0.6 }}
            animate={{ 
              width: 240, 
              height: 240, 
              opacity: 0,
              transition: { duration: 2, repeat: Infinity, ease: "easeOut" }
            }}
          />
          <motion.div
            className="absolute rounded-full border border-red-400/60"
            initial={{ width: 180, height: 180, opacity: 0.8 }}
            animate={{ 
              width: 220, 
              height: 220, 
              opacity: 0,
              transition: { duration: 2, repeat: Infinity, delay: 0.5, ease: "easeOut" }
            }}
          />
        </>
      )}
      
      {/* Processing pulse */}
      {isProcessing && (
        <motion.div
          className="absolute rounded-full border border-blue-400/50"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ width: 200, height: 200 }}
        />
      )}
      
      {/* Main avatar button */}
      <motion.button
        className={`relative w-44 h-44 rounded-full bg-gradient-to-br ${styles.gradient} ${styles.shadow} ${styles.ring} 
                   flex flex-col items-center justify-center border-none outline-none backdrop-blur-sm
                   ${isDisabled || isComplete || isShowingSummary ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-110'} 
                   transition-all duration-200 ease-out overflow-hidden`}
        onMouseDown={!isComplete && !isShowingSummary ? startRecording : undefined}
        onMouseUp={!isComplete && !isShowingSummary ? stopRecording : undefined}
        onMouseLeave={!isComplete && !isShowingSummary ? stopRecording : undefined}
        onTouchStart={!isComplete && !isShowingSummary ? startRecording : undefined}
        onTouchEnd={!isComplete && !isShowingSummary ? stopRecording : undefined}
        disabled={isDisabled || isComplete || isShowingSummary}
        whileTap={!isDisabled && !isComplete && !isShowingSummary ? { scale: 1.05 } : {}}
        animate={{
          scale: isRecording ? 1.02 : 1,
        }}
        transition={{ 
          scale: { duration: 0.2, ease: "easeOut" }
        }}
      >
        {/* Content based on state */}
        <AnimatePresence mode="wait">
          {isShowingSummary ? (
            <motion.div
              key="summary"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                mass: 0.8
              }}
              className="text-white flex flex-col items-center justify-center px-4 text-center absolute inset-0"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  stiffness: 500,
                  damping: 20
                }}
                className="mb-2"
              >
                <CheckCircle size={32} strokeWidth={2.5} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 300
                }}
                className="text-xs leading-tight font-medium"
              >
                {processedTask.length > 80 ? processedTask.substring(0, 80) + '...' : processedTask}
              </motion.p>
            </motion.div>
          ) : isComplete ? (
            <motion.div
              key="complete"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                mass: 0.8
              }}
              className="text-white flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  stiffness: 500,
                  damping: 20
                }}
              >
                <CheckCircle size={56} strokeWidth={2.5} />
              </motion.div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.4,
                  type: "spring",
                  stiffness: 300
                }}
                className="mt-2 text-sm font-medium tracking-wide"
              >
                TASK COMPLETE
              </motion.span>
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="recording"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-white flex flex-col items-center"
            >
              {/* Audio waveform */}
              <AudioWaveform isRecording={isRecording} />
              
              {/* Recording timer */}
              <motion.div 
                className="mt-2 font-mono text-lg font-semibold tracking-wider"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                {formatTime(recordingTime)}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-white flex flex-col items-center"
            >
              <Stethoscope size={52} strokeWidth={2.5} />
              {isProcessing && (
                <span className="mt-3 text-xs font-medium tracking-wider opacity-90">
                  PROCESSING
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status indicator */}
        <motion.div
          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white
                     ${(isComplete || isShowingSummary) ? 'bg-emerald-500' : 
                       isRecording ? 'bg-red-500' : 
                       isProcessing ? 'bg-blue-500' : 'bg-slate-400'}`}
          animate={
            isRecording || isProcessing ? {
              scale: [1, 1.2, 1],
            } : (isComplete || isShowingSummary) ? {
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                "0 0 0 8px rgba(34, 197, 94, 0)",
                "0 0 0 0 rgba(34, 197, 94, 0)"
              ]
            } : {}
          }
          transition={{ 
            duration: isComplete || isShowingSummary ? 2 : 1, 
            repeat: (isRecording || isProcessing || isComplete || isShowingSummary) ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Summary text below avatar when showing summary */}
      {isShowingSummary && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ 
            delay: 0.6, 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="mt-6 max-w-md mx-auto"
        >
          <motion.div 
            className="bg-white/95 backdrop-blur-md border border-emerald-200/50 rounded-2xl p-4 shadow-xl shadow-emerald-500/10"
            initial={{ boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)" }}
            animate={{ boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.15)" }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <p className="text-slate-700 text-sm leading-relaxed font-medium">{processedTask}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}