import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu, Users, FileText, BarChart3, Settings, Home } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function MobileSidebar({ isOpen, onClose, currentPage, onNavigate }: MobileSidebarProps) {
  const handleNavigate = (pageId: string) => {
    onNavigate(pageId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h2 className="font-semibold text-slate-800 tracking-wide">MEDICAL AI</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                          : 'hover:bg-slate-50 text-slate-700 border-2 border-transparent'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} strokeWidth={2.5} />
                      <span className="font-medium tracking-wide">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Dr. Sarah Chen</p>
                    <p className="text-xs text-slate-500">Cardiologist</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>ONLINE</span>
                  </span>
                  <span>ID: 12345</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile Header with Hamburger
interface MobileHeaderProps {
  onMenuClick: () => void;
  title: string;
  rightElement?: React.ReactNode;
}

export function MobileHeader({ onMenuClick, title, rightElement }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={20} className="text-slate-700" />
        </button>
        <h1 className="font-semibold text-slate-800 tracking-wide">{title}</h1>
      </div>
      {rightElement}
    </div>
  );
}