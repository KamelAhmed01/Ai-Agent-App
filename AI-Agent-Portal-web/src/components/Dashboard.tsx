import { motion } from 'motion/react';
import { AIAvatar } from './AIAvatar';
import { StatusDisplay } from './StatusDisplay';
import { TaskResults } from './TaskResults';

interface DashboardProps {
  state: 'idle' | 'recording' | 'processing' | 'complete' | 'showing-summary';
  currentStatus: string;
  processedTask: string;
  onRecordingStart: () => void;
  onRecordingStop: (recordingTime: number) => void;
  onNewTask: () => void;
}

export function Dashboard({
  state,
  currentStatus,
  processedTask,
  onRecordingStart,
  onRecordingStop,
  onNewTask
}: DashboardProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="w-full max-w-md mx-auto">
        
        {/* AI Avatar - Always visible and centered */}
        <motion.div
          className="mb-12 flex justify-center"
          animate={{ 
            y: state === 'recording' ? -8 : 0,
            scale: (state === 'complete' || state === 'showing-summary') ? 1.1 : 1
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AIAvatar 
            isRecording={state === 'recording'} 
            isProcessing={state === 'processing'}
            isComplete={state === 'complete'}
            isShowingSummary={state === 'showing-summary'}
            onRecordingStart={onRecordingStart}
            onRecordingStop={onRecordingStop}
            isDisabled={state === 'processing'}
            processedTask={processedTask}
          />
        </motion.div>

        {/* Status and results */}
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {state === 'idle' && (
            <div className="text-center">
              <p className="text-slate-500 text-sm font-medium tracking-wide">Press & Hold</p>
            </div>
          )}

          {(state === 'recording' || state === 'processing') && (
            <StatusDisplay 
              currentStatus={currentStatus}
              isComplete={false}
            />
          )}

          {(state === 'complete' || state === 'showing-summary') && (
            <div className="opacity-0"></div> // Hidden as content is now in avatar
          )}
        </motion.div>
      </div>
    </div>
  );
}