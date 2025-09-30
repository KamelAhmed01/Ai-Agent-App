import { motion } from 'motion/react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

interface TaskResultsProps {
  task: string;
  onNewTask: () => void;
}

export function TaskResults({ task, onNewTask }: TaskResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto px-4"
    >
      {/* Task completion card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-lg shadow-emerald-500/10 mb-6"
      >
        {/* Success header */}
        <div className="flex items-center justify-center mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full"
          >
            <CheckCircle2 className="text-emerald-600" size={24} strokeWidth={2.5} />
          </motion.div>
        </div>
        
        {/* Task details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-3"
        >
          <h3 className="text-emerald-700 font-semibold tracking-wide">TASK COMPLETED</h3>
          <div className="bg-emerald-50 rounded-xl p-3">
            <p className="text-slate-700 text-sm leading-relaxed">{task}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* New task button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={onNewTask}
        className="group w-full bg-slate-800 hover:bg-slate-700 text-white rounded-2xl p-4 
                   shadow-lg shadow-slate-800/25 border border-slate-600
                   transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]
                   flex items-center justify-center space-x-3"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="group-hover:rotate-[-15deg] transition-transform duration-200"
        >
          <RotateCcw size={18} strokeWidth={2.5} />
        </motion.div>
        <span className="font-semibold tracking-wide">NEW TASK</span>
      </motion.button>
    </motion.div>
  );
}