import { motion, AnimatePresence } from 'motion/react';
import { Activity, Database, FileText, Search, Zap } from 'lucide-react';

interface StatusDisplayProps {
  currentStatus: string;
  isComplete: boolean;
}

const statusConfig = {
  'Listening...': { icon: Activity, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  'Processing request...': { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'Getting patient profile...': { icon: Search, color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  'Accessing medical records...': { icon: Database, color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  'Generating report...': { icon: FileText, color: 'text-cyan-500', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  'Finalizing results...': { icon: Zap, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  'Task completed': { icon: Activity, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' }
};

export function StatusDisplay({ currentStatus, isComplete }: StatusDisplayProps) {
  const isLoading = !isComplete && currentStatus !== 'Task completed';
  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig['Processing request...'];
  const IconComponent = config.icon;

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatus}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-4 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-center space-x-3">
            <div className={`${config.color} flex-shrink-0`}>
              <IconComponent size={20} strokeWidth={2.5} />
            </div>
            
            <motion.p
              className={`${config.color} font-medium text-sm tracking-wide`}
              animate={isLoading ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 1.8, repeat: isLoading ? Infinity : 0 }}
            >
              {currentStatus}
            </motion.p>
          </div>
          
          {/* Progress bar */}
          {isLoading && (
            <motion.div
              className="w-full h-1 bg-white/50 rounded-full mt-3 overflow-hidden"
            >
              <motion.div
                className={`h-full ${config.color.replace('text-', 'bg-')} rounded-full`}
                initial={{ width: "0%", x: "-100%" }}
                animate={{ width: "100%", x: "0%" }}
                transition={{ 
                  duration: 2.5, 
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}