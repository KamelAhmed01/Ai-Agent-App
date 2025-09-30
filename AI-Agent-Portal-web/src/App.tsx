import { useState } from 'react';
import { motion } from 'motion/react';
import { MobileSidebar, MobileHeader } from './components/MobileSidebar';
import { Dashboard } from './components/Dashboard';
import { PatientsList } from './components/PatientsList';
import { PatientDetails } from './components/PatientDetails';
import { ReportsList } from './components/ReportsList';
import { Settings } from './components/Settings';
import { FloatingAvatar } from './components/FloatingAvatar';
import { Plus } from 'lucide-react';

type AppState = 'idle' | 'recording' | 'processing' | 'complete' | 'showing-summary' | 'editing';
type Page = 'home' | 'patients' | 'reports' | 'settings';

interface Patient {
  id: string;
  name: string;
  room: string;
  avatar: string;
  isUrgent?: boolean;
  lastVisit: string;
  condition: string;
}

interface Report {
  id: string;
  title: string;
  patientName: string;
  patientId: string;
  type: 'Assessment' | 'Lab Report' | 'Treatment' | 'Discharge' | 'Follow-up';
  date: string;
  generatedBy: 'AI Assistant' | 'Manual Entry';
  status: 'Generated' | 'Reviewed' | 'Approved';
}

const processingSteps = [
  'Processing request...',
  'Getting patient profile...',
  'Accessing medical records...',
  'Generating report...',
  'Finalizing results...'
];

const editingSteps = [
  'Processing edit request...',
  'Analyzing current report...',
  'Applying modifications...',
  'Validating changes...',
  'Updating report...'
];

export default function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // AI Assistant state
  const [state, setState] = useState<AppState>('idle');
  const [currentStatus, setCurrentStatus] = useState('');
  const [processedTask, setProcessedTask] = useState('');
  
  // Edit mode state
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  // Simulate AI processing workflow
  const simulateProcessing = async (recordingTime: number) => {
    setState('processing');
    
    // Use different steps based on whether we're editing or not
    const steps = editingReport ? editingSteps : processingSteps;
    const minProcessingTime = editingReport ? 
      Math.max(recordingTime * 0.3, 3000) : // Slightly faster for edits
      Math.max(recordingTime * 0.4, 4000);
    const stepDuration = minProcessingTime / steps.length;
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStatus(steps[i]);
      const duration = stepDuration + Math.random() * 600;
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    
    setCurrentStatus(editingReport ? 'Edit completed' : 'Task completed');
    
    let mockTasks;
    
    if (editingReport) {
      mockTasks = [
        `Updated report "${editingReport.title}" with revised clinical findings and improved formatting`,
        `Enhanced report "${editingReport.title}" with additional diagnostic details and corrected terminology`,
        `Revised report "${editingReport.title}" to include updated patient status and treatment recommendations`,
        `Modified report "${editingReport.title}" with improved clarity and added missing lab values`,
        `Updated report "${editingReport.title}" with corrected dosages and enhanced care plan details`
      ];
    } else {
      mockTasks = [
        'Retrieved comprehensive patient profile for John Smith including medical history, current medications, and recent lab results',
        'Generated detailed health assessment report with blood pressure trends, medication compliance analysis, and care recommendations',
        'Successfully scheduled follow-up cardiology appointment for next Tuesday at 2:30 PM with Dr. Martinez',
        'Completed medication adherence review - identified potential drug interactions and updated dosage recommendations',
        'Analyzed latest diagnostic imaging results and compiled differential diagnosis with treatment pathway options',
        'Prepared comprehensive discharge summary with post-care instructions and follow-up scheduling'
      ];
    }
    
    const randomTask = mockTasks[Math.floor(Math.random() * mockTasks.length)];
    setProcessedTask(randomTask);
    
    setTimeout(() => {
      setState('complete');
      
      // After 2 seconds, show the summary, then return to idle
      setTimeout(() => {
        setState('showing-summary');
        
        // After 3 more seconds, return to previous state
        setTimeout(() => {
          setState(editingReport ? 'editing' : 'idle');
          setCurrentStatus('');
          setProcessedTask('');
        }, 3000);
      }, 2000);
    }, 1200);
  };

  const handleRecordingStart = () => {
    setState('recording');
    setCurrentStatus('Listening...');
  };

  const handleRecordingStop = (recordingTime: number) => {
    if (recordingTime >= 800) {
      simulateProcessing(recordingTime);
    } else {
      setState(editingReport ? 'editing' : 'idle');
      setCurrentStatus('');
    }
  };

  const handleNewTask = () => {
    setState(editingReport ? 'editing' : 'idle');
    setCurrentStatus('');
    setProcessedTask('');
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setState('editing');
  };

  const handleEditComplete = () => {
    setEditingReport(null);
    setState('idle');
    setCurrentStatus('');
    setProcessedTask('');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedPatient(null); // Reset patient selection when navigating
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handlePatientBack = () => {
    setSelectedPatient(null);
  };

  const getPageTitle = () => {
    if (selectedPatient) return 'Patient Details';
    switch (currentPage) {
      case 'home': return 'Home';
      case 'patients': return 'Patients';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Home';
    }
  };

  const getRightElement = () => {
    return null; // Removed add patient button
  };

  const renderContent = () => {
    if (selectedPatient) {
      return (
        <PatientDetails 
          patient={selectedPatient} 
          onBack={handlePatientBack}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <Dashboard
            state={state}
            currentStatus={currentStatus}
            processedTask={processedTask}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onNewTask={handleNewTask}
          />
        );
      case 'patients':
        return <PatientsList onPatientSelect={handlePatientSelect} />;
      case 'reports':
        return <ReportsList onEditReport={handleEditReport} />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Header */}
      {(currentPage !== 'home' || selectedPatient) && (
        <MobileHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
          rightElement={getRightElement()}
        />
      )}

      {/* Home Header (only shown on home) */}
      {currentPage === 'home' && !selectedPatient && (
        <div className="flex items-center justify-start pt-8 pb-4 px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-6 h-0.5 bg-slate-600 rounded"></div>
              <div className="w-6 h-0.5 bg-slate-600 rounded"></div>
              <div className="w-6 h-0.5 bg-slate-600 rounded"></div>
            </div>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>

      {/* Footer (only shown on home) */}
      {currentPage === 'home' && !selectedPatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pb-6 pt-2 text-center"
        >
          <div className="inline-flex items-center space-x-4 text-xs text-slate-500 font-medium tracking-wider">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>SECURE</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>HIPAA COMPLIANT</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>ENCRYPTED</span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Floating Avatar (visible on all pages except home and settings) */}
      <FloatingAvatar
        isVisible={currentPage !== 'home' && currentPage !== 'settings' && !selectedPatient}
        onRecordingStart={handleRecordingStart}
        onRecordingStop={handleRecordingStop}
        state={state}
        editingItem={editingReport?.title}
        onEditComplete={handleEditComplete}
        processedTask={processedTask}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </div>
  );
}