import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PatientsScreen } from './src/screens/PatientsScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { PatientDetailsScreen } from './src/screens/PatientDetailsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { FloatingAvatar } from './src/components/FloatingAvatar';
import { Patient, Report, AppState } from './src/types';

type Page = 'home' | 'patients' | 'reports' | 'settings';

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

const mockTasks = [
  'Retrieved comprehensive patient profile for John Smith including medical history, current medications, and recent lab results',
  'Generated detailed health assessment report with blood pressure trends, medication compliance analysis, and care recommendations',
  'Successfully scheduled follow-up cardiology appointment for next Tuesday at 2:30 PM with Dr. Martinez',
  'Completed medication adherence review - identified potential drug interactions and updated dosage recommendations',
  'Analyzed latest diagnostic imaging results and compiled differential diagnosis with treatment pathway options',
  'Prepared comprehensive discharge summary with post-care instructions and follow-up scheduling'
];

const mockEditTasks = [
  'Updated report with revised clinical findings and improved formatting',
  'Enhanced report with additional diagnostic details and corrected terminology',
  'Revised report to include updated patient status and treatment recommendations',
  'Modified report with improved clarity and added missing lab values',
  'Updated report with corrected dosages and enhanced care plan details'
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  const [state, setState] = useState<AppState>('idle');
  const [currentStatus, setCurrentStatus] = useState('');
  const [processedTask, setProcessedTask] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  
  // Sidebar animations - recreate on each toggle to ensure fresh animations
  const sidebarSlideAnim = useRef(new Animated.Value(-280)).current;
  const backdropFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sidebarOpen) {
      // Reset to start positions
      sidebarSlideAnim.setValue(-280);
      backdropFadeAnim.setValue(0);
      
      // Animate IN
      Animated.parallel([
        Animated.spring(sidebarSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(backdropFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate OUT
      Animated.parallel([
        Animated.spring(sidebarSlideAnim, {
          toValue: -280,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(backdropFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sidebarOpen]);

  const simulateProcessing = async (recordingTime: number) => {
    setState('processing');
    
    const steps = editingReport ? editingSteps : processingSteps;
    const minProcessingTime = editingReport ? 
      Math.max(recordingTime * 0.3, 3000) : 
      Math.max(recordingTime * 0.4, 4000);
    const stepDuration = minProcessingTime / steps.length;
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStatus(steps[i]);
      const duration = stepDuration + Math.random() * 600;
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    
    setCurrentStatus(editingReport ? 'Edit completed' : 'Task completed');
    
    const tasks = editingReport ? mockEditTasks : mockTasks;
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    setProcessedTask(randomTask);
    
    setTimeout(() => {
      setState('complete');
      
      setTimeout(() => {
        setState('showing-summary');
        
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

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedPatient(null);
    setSidebarOpen(false);
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handlePatientBack = () => {
    setSelectedPatient(null);
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

  const renderContent = () => {
    if (selectedPatient) {
      return (
        <PatientDetailsScreen 
          patient={selectedPatient} 
          onBack={handlePatientBack}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <DashboardScreen
            state={state}
            currentStatus={currentStatus}
            processedTask={processedTask}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onNewTask={handleNewTask}
          />
        );
      case 'patients':
        return <PatientsScreen onPatientSelect={handlePatientSelect} />;
      case 'reports':
        return <ReportsScreen onEditReport={handleEditReport} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header (shown on non-home pages) */}
      {(currentPage !== 'home' || selectedPatient) && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getPageTitle()}</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Home Header (only on home) */}
      {currentPage === 'home' && !selectedPatient && (
        <View style={styles.homeHeader}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            <View style={styles.hamburger}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Footer (only shown on home) */}
      {currentPage === 'home' && !selectedPatient && (
        <View style={styles.footer}>
          <View style={styles.badge}>
            <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.badgeText}>SECURE</Text>
          </View>
          <View style={styles.badge}>
            <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.badgeText}>HIPAA COMPLIANT</Text>
          </View>
          <View style={styles.badge}>
            <View style={[styles.dot, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.badgeText}>ENCRYPTED</Text>
          </View>
        </View>
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

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropFadeAnim }]}
            pointerEvents={sidebarOpen ? 'auto' : 'none'}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setSidebarOpen(false)}
              activeOpacity={1}
            />
          </Animated.View>
          <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarSlideAnim }] }]}>
            <View style={styles.sidebarHeader}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🏥</Text>
              </View>
              <Text style={styles.sidebarTitle}>MEDICAL AI</Text>
              <TouchableOpacity onPress={() => setSidebarOpen(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.nav}>
              {[
                { id: 'home', label: 'Home', icon: 'home' },
                { id: 'patients', label: 'Patients', icon: 'people' },
                { id: 'reports', label: 'Reports', icon: 'document-text' },
                { id: 'settings', label: 'Settings', icon: 'settings' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.navItem,
                    currentPage === item.id && styles.navItemActive
                  ]}
                  onPress={() => handleNavigate(item.id as Page)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={currentPage === item.id ? '#3b82f6' : '#64748b'}
                  />
                  <Text style={[
                    styles.navText,
                    currentPage === item.id && styles.navTextActive
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sidebarFooter}>
              <View style={styles.profileCard}>
                <View style={styles.profileAvatar}>
                  <View style={styles.profileDot} />
                </View>
                <View>
                  <Text style={styles.profileName}>Dr. Sarah Chen</Text>
                  <Text style={styles.profileRole}>Cardiologist</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>ONLINE</Text>
                <Text style={styles.statusId}>ID: 12345</Text>
              </View>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  homeHeader: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingLeft: 24,
  },
  menuButton: {
    padding: 8,
  },
  hamburger: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    gap: 4,
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: '#475569',
    borderRadius: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 50,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'white',
    zIndex: 51,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  sidebarTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    letterSpacing: 1,
  },
  nav: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  navText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
  },
  navTextActive: {
    color: '#3b82f6',
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  profileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  profileRole: {
    fontSize: 11,
    color: '#64748b',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  statusId: {
    fontSize: 11,
    color: '#94a3b8',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 24,
    gap: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 1,
  },
});