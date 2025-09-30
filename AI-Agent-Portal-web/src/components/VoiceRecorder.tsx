import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingStart: () => void;
  onRecordingStop: (recordingTime: number) => void;
  isDisabled: boolean;
}

export function VoiceRecorder({ onRecordingStart, onRecordingStop, isDisabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(() => {
    if (isDisabled) return;
    
    setIsRecording(true);
    setRecordingTime(0);
    startTimeRef.current = Date.now();
    onRecordingStart();
    
    // Update recording time every 100ms
    recordingInterval.current = setInterval(() => {
      setRecordingTime(Date.now() - startTimeRef.current);
    }, 100);
  }, [isDisabled, onRecordingStart]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    
    setIsRecording(false);
    const finalTime = Date.now() - startTimeRef.current;
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    
    onRecordingStop(finalTime);
    setRecordingTime(0);
  }, [isRecording, onRecordingStop]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Recording timer */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500 text-white px-4 py-2 rounded-full"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>
        </motion.div>
      )}

      {/* Hold to record button */}
      <motion.button
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
          isDisabled 
            ? 'bg-gray-300 cursor-not-allowed' 
            : isRecording 
              ? 'bg-red-500 shadow-lg' 
              : 'bg-blue-500 hover:bg-blue-600 shadow-md'
        }`}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        animate={isRecording ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            "0 10px 15px -3px rgba(239, 68, 68, 0.4)",
            "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          ]
        } : {}}
        transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
      >
        {isRecording ? (
          <MicOff className="text-white" size={28} />
        ) : (
          <Mic className="text-white" size={28} />
        )}
      </motion.button>

      {/* Instructions */}
      <motion.p
        className="text-center text-gray-600 max-w-xs"
        animate={isRecording ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
      >
        {isDisabled 
          ? 'Processing...'
          : isRecording 
            ? 'Release to stop recording'
            : 'Hold to record your medical request'
        }
      </motion.p>
    </div>
  );
}