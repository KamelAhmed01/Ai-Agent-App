import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Bell, Shield, Mic, Database, ChevronRight, LogOut, Moon, Sun } from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [micPermissions, setMicPermissions] = useState(true);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Settings',
          description: 'Update your personal information',
          action: 'navigate'
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your data and security settings',
          action: 'navigate'
        }
      ]
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification preferences',
          action: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          action: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          icon: Mic,
          label: 'Microphone Access',
          description: 'Allow voice recording for AI assistant',
          action: 'toggle',
          value: micPermissions,
          onChange: setMicPermissions
        }
      ]
    },
    {
      title: 'Data & Integration',
      items: [
        {
          icon: Database,
          label: 'CRM Integration',
          description: 'Connect to external patient management systems',
          action: 'navigate'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Dr. Sarah Chen</h2>
            <p className="text-slate-500">Cardiologist • ID: 12345</p>
            <p className="text-sm text-green-600 mt-1">Active Session</p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="font-semibold text-slate-800 mb-3 px-2">{group.title}</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div key={item.label}>
                  <motion.div
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <item.icon size={18} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.description}</p>
                      </div>
                    </div>

                    {item.action === 'toggle' && item.onChange && (
                      <motion.button
                        onClick={() => item.onChange?.(!item.value)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          item.value ? 'bg-blue-500' : 'bg-slate-300'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-sm"
                          animate={{ x: item.value ? 26 : 2 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        />
                      </motion.button>
                    )}

                    {item.action === 'navigate' && (
                      <ChevronRight size={18} className="text-slate-400" />
                    )}
                  </motion.div>
                  {itemIndex < group.items.length - 1 && (
                    <div className="border-b border-slate-100 ml-14" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-4"
        >
          <h3 className="font-semibold text-slate-800 mb-3">About</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>2024.01.15</span>
            </div>
            <div className="flex justify-between">
              <span>Platform</span>
              <span>Medical AI Assistant</span>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center justify-center space-x-3 hover:bg-red-100 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} className="text-red-600" />
          <span className="font-medium text-red-700">Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
}