import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, ChevronRight, AlertCircle } from 'lucide-react';
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

interface PatientsListProps {
  onPatientSelect: (patient: Patient) => void;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Ethan Carter',
    room: 'Room 201',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isUrgent: true,
    lastVisit: '2 hours ago',
    condition: 'Cardiology'
  },
  {
    id: '2',
    name: 'Olivia Bennett',
    room: 'Room 202',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    lastVisit: '4 hours ago',
    condition: 'General Medicine'
  },
  {
    id: '3',
    name: 'Noah Thompson',
    room: 'Room 203',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    lastVisit: '1 day ago',
    condition: 'Orthopedics'
  },
  {
    id: '4',
    name: 'Ava Martinez',
    room: 'Room 204',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isUrgent: true,
    lastVisit: '30 minutes ago',
    condition: 'Emergency'
  },
  {
    id: '5',
    name: 'Liam Harris',
    room: 'Room 205',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    lastVisit: '6 hours ago',
    condition: 'Pediatrics'
  },
  {
    id: '6',
    name: 'Isabella Clark',
    room: 'Room 206',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    lastVisit: '3 days ago',
    condition: 'Dermatology'
  }
];

export function PatientsList({ onPatientSelect }: PatientsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent'>('all');

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'urgent' && patient.isUrgent);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-2xl transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-4 py-2 rounded-2xl transition-all duration-200 flex items-center space-x-2 ${
              activeFilter === 'urgent'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <AlertCircle size={16} />
            <span>Urgent</span>
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-center">No patients found</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredPatients.map((patient) => (
              <motion.button
                key={patient.id}
                onClick={() => onPatientSelect(patient)}
                className="w-full bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                    <ImageWithFallback 
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {patient.isUrgent && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <AlertCircle size={10} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Patient Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-slate-800 tracking-wide">{patient.name}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className="text-sm text-slate-500">{patient.room}</p>
                    <span className="text-slate-300">•</span>
                    <p className="text-sm text-slate-500">{patient.condition}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{patient.lastVisit}</p>
                </div>

                {/* Arrow */}
                <ChevronRight size={18} className="text-slate-400" />
              </motion.button>
            ))}
          </div>
        )}
      </div>


    </div>
  );
}