import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Activity, Heart, Thermometer, Wind, Droplets, Weight, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Patient {
  id: string;
  name: string;
  room: string;
  avatar: string;
  isUrgent?: boolean;
  lastVisit: string;
  condition: string;
}

interface PatientDetailsProps {
  patient: Patient;
  onBack: () => void;
}

interface VitalStat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

const mockVitals: VitalStat[] = [
  { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500' },
  { label: 'Blood Pressure', value: '120/80 mmHg', icon: Activity, color: 'text-blue-500' },
  { label: 'Temperature', value: '98.6°F', icon: Thermometer, color: 'text-orange-500' },
  { label: 'Respiratory Rate', value: '16 breaths/min', icon: Wind, color: 'text-cyan-500' },
  { label: 'Oxygen Saturation', value: '98%', icon: Droplets, color: 'text-green-500' },
  { label: 'Weight', value: '180 lbs', icon: Weight, color: 'text-purple-500' },
];

const mockMedications = [
  { name: 'Lisinopril', dosage: '20mg, once daily', type: 'ACE Inhibitor' },
  { name: 'Metoprolol', dosage: '50mg, twice daily', type: 'Beta Blocker' },
  { name: 'Aspirin', dosage: '81mg, once daily', type: 'Antiplatelet' },
];

const mockReports = [
  { id: '1', title: 'Cardiology Assessment', date: '2024-01-15', type: 'Assessment' },
  { id: '2', title: 'Lab Results Summary', date: '2024-01-14', type: 'Lab Report' },
  { id: '3', title: 'Treatment Plan Update', date: '2024-01-12', type: 'Treatment' },
];

export function PatientDetails({ patient, onBack }: PatientDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'medications' | 'reports'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'medications', label: 'Medications' },
    { id: 'reports', label: 'Reports' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-semibold tracking-wide">Patient Details</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20">
            <ImageWithFallback 
              src={patient.avatar}
              alt={patient.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{patient.name}</h2>
            <p className="text-blue-100">{patient.condition}</p>
            <p className="text-blue-200 text-sm">ID: {patient.id}2345 • {patient.room}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4">
        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-6">
            {/* Vitals */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Vitals</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockVitals.map((vital, index) => {
                  const Icon = vital.icon;
                  return (
                    <motion.div
                      key={vital.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon size={16} className={vital.color} />
                        <p className="text-sm text-slate-600">{vital.label}</p>
                      </div>
                      <p className="font-semibold text-slate-800">{vital.value}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-left hover:bg-blue-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                      <p className="font-medium text-blue-800">Schedule Appointment</p>
                      <p className="text-sm text-blue-600">Next available: Tomorrow 2:30 PM</p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-left hover:bg-green-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Activity className="text-green-600" size={20} />
                    <div>
                      <p className="font-medium text-green-800">Generate Report</p>
                      <p className="text-sm text-green-600">Create new assessment report</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-slate-800">Current Medications</h3>
            {mockMedications.map((medication, index) => (
              <motion.div
                key={medication.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-slate-800">{medication.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{medication.dosage}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                      {medication.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Generated Reports</h3>
              <motion.button
                className="bg-blue-500 text-white px-4 py-2 rounded-2xl text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Report
              </motion.button>
            </div>
            {mockReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer"
              >
                <h4 className="font-medium text-slate-800">{report.title}</h4>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm text-slate-500">{report.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-block px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg">
                    {report.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Medical History</h3>
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <p className="text-slate-500">Medical history will be populated from CRM integration</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}