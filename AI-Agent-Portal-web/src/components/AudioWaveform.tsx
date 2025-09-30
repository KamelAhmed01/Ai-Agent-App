import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface AudioWaveformProps {
  isRecording: boolean;
  onAudioData?: (audioData: Float32Array) => void;
  size?: 'normal' | 'small';
}

export function AudioWaveform({ isRecording, onAudioData, size = 'normal' }: AudioWaveformProps) {
  const [audioData, setAudioData] = useState<number[]>(new Array(20).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isRecording]);

  const startRecording = async () => {
    // Check if microphone access is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      simulateWaveform();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      mediaStreamRef.current = stream;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 64;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateWaveform = () => {
        if (!analyserRef.current || !isRecording) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Convert to normalized values and create waveform data
        const waveformData = Array.from(dataArray)
          .slice(0, 20)
          .map(value => (value / 255) * 100);
        
        setAudioData(waveformData);
        
        if (onAudioData) {
          const floatArray = new Float32Array(dataArray.length);
          for (let i = 0; i < dataArray.length; i++) {
            floatArray[i] = dataArray[i] / 255;
          }
          onAudioData(floatArray);
        }
        
        animationRef.current = requestAnimationFrame(updateWaveform);
      };
      
      updateWaveform();
    } catch (error) {
      // Silently fall back to simulated waveform - no console error needed
      // This is expected behavior in environments without mic access
      simulateWaveform();
    }
  };

  const simulateWaveform = () => {
    const updateSimulated = () => {
      if (!isRecording) return;
      
      // Create more realistic simulated audio data
      const simulatedData = new Array(20).fill(0).map((_, index) => {
        // Add some variation based on position and time
        const baseHeight = 30 + Math.sin(Date.now() * 0.001 + index * 0.5) * 20;
        const randomVariation = Math.random() * 40 + 10;
        return Math.max(baseHeight + randomVariation, 8);
      });
      
      setAudioData(simulatedData);
      
      if (onAudioData) {
        // Provide simulated audio data for any listeners
        const floatArray = new Float32Array(20);
        simulatedData.forEach((value, index) => {
          floatArray[index] = value / 100;
        });
        onAudioData(floatArray);
      }
      
      animationRef.current = requestAnimationFrame(updateSimulated);
    };
    
    updateSimulated();
  };

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {
        // Ignore errors when closing audio context
      });
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioData(new Array(20).fill(0));
  };

  if (!isRecording) return null;

  const isSmall = size === 'small';
  const barCount = isSmall ? 8 : 20;
  const barWidth = isSmall ? '1.5px' : '3px';
  const heightMultiplier = isSmall ? 0.3 : 0.6;
  const minHeight = isSmall ? 2 : 4;
  const containerHeight = isSmall ? 'h-6' : 'h-16';
  const spacing = isSmall ? 'space-x-0.5' : 'space-x-1';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-center justify-center ${spacing} ${containerHeight}`}
    >
      {audioData.slice(0, barCount).map((value, index) => (
        <motion.div
          key={index}
          className="bg-white/90 rounded-full"
          style={{
            width: barWidth,
            height: `${Math.max(value * heightMultiplier, minHeight)}px`,
            minHeight: `${minHeight}px`
          }}
          animate={{
            height: `${Math.max(value * heightMultiplier, minHeight)}px`,
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            height: { duration: 0.1 },
            opacity: { duration: 1, repeat: Infinity }
          }}
        />
      ))}
    </motion.div>
  );
}