import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, FileText, Download, Eye, Calendar, User, MoreVertical, CheckCircle, Edit3 } from 'lucide-react';

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

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Comprehensive Cardiology Assessment',
    patientName: 'Ethan Carter',
    patientId: '12345',
    type: 'Assessment',
    date: '2024-01-15',
    generatedBy: 'AI Assistant',
    status: 'Generated'
  },
  {
    id: '2',
    title: 'Blood Work Analysis Summary',
    patientName: 'Olivia Bennett',
    patientId: '12346',
    type: 'Lab Report',
    date: '2024-01-14',
    generatedBy: 'AI Assistant',
    status: 'Reviewed'
  },
  {
    id: '3',
    title: 'Post-Surgery Follow-up Report',
    patientName: 'Noah Thompson',
    patientId: '12347',
    type: 'Follow-up',
    date: '2024-01-13',
    generatedBy: 'AI Assistant',
    status: 'Approved'
  },
  {
    id: '4',
    title: 'Emergency Room Assessment',
    patientName: 'Ava Martinez',
    patientId: '12348',
    type: 'Assessment',
    date: '2024-01-12',
    generatedBy: 'AI Assistant',
    status: 'Generated'
  },
  {
    id: '5',
    title: 'Discharge Summary - Pediatric Care',
    patientName: 'Liam Harris',
    patientId: '12349',
    type: 'Discharge',
    date: '2024-01-11',
    generatedBy: 'AI Assistant',
    status: 'Approved'
  }
];

interface ReportsListProps {
  onEditReport?: (report: Report) => void;
}

export function ReportsList({ onEditReport }: ReportsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Report['status']>('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Generated': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Reviewed': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'Assessment': return FileText;
      case 'Lab Report': return FileText;
      case 'Treatment': return FileText;
      case 'Discharge': return FileText;
      case 'Follow-up': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Search and Filters */}
      <div className="bg-white border-b border-slate-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by report, patient, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          >
            <option value="all">All Status</option>
            <option value="Generated">Generated</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto">
        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-center">No reports found</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredReports.map((report, index) => {
              const TypeIcon = getTypeIcon(report.type);
              
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <TypeIcon size={18} className="text-blue-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{report.title}</h3>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>{report.patientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{report.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg border border-purple-200">
                          {report.generatedBy}
                        </span>
                      </div>
                    </div>

                    {/* Actions - 3 Dots Menu */}
                    <div className="relative">
                      <motion.button
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpenDropdown(openDropdown === report.id ? null : report.id)}
                      >
                        <MoreVertical size={16} className="text-slate-600" />
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {openDropdown === report.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-10"
                            onMouseLeave={() => setOpenDropdown(null)}
                          >
                            <div className="p-2">
                              {/* View */}
                              <motion.button
                                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors text-left"
                                whileHover={{ x: 2 }}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  // Handle view action
                                }}
                              >
                                <Eye size={16} className="text-blue-600" />
                                <span className="text-sm text-slate-700">View Report</span>
                              </motion.button>

                              {/* Download */}
                              <motion.button
                                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors text-left"
                                whileHover={{ x: 2 }}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  // Handle download action
                                }}
                              >
                                <Download size={16} className="text-green-600" />
                                <span className="text-sm text-slate-700">Download PDF</span>
                              </motion.button>

                              {/* Approve */}
                              <motion.button
                                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors text-left"
                                whileHover={{ x: 2 }}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  // Handle approve action
                                }}
                                disabled={report.status === 'Approved'}
                              >
                                <CheckCircle size={16} className={report.status === 'Approved' ? 'text-slate-400' : 'text-emerald-600'} />
                                <span className={`text-sm ${report.status === 'Approved' ? 'text-slate-400' : 'text-slate-700'}`}>
                                  {report.status === 'Approved' ? 'Already Approved' : 'Approve Report'}
                                </span>
                              </motion.button>

                              {/* Edit */}
                              <motion.button
                                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-colors text-left"
                                whileHover={{ x: 2 }}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  onEditReport?.(report);
                                }}
                              >
                                <Edit3 size={16} className="text-purple-600" />
                                <span className="text-sm text-slate-700">Edit Report</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}