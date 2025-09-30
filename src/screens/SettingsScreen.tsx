import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Bell, 
  Shield, 
  Mic, 
  Database, 
  ChevronRight, 
  LogOut, 
  Moon, 
  Sun 
} from 'lucide-react-native';

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [micPermissions, setMicPermissions] = useState(true);

  const SettingItem = ({ 
    Icon, 
    label, 
    description, 
    isToggle, 
    value, 
    onValueChange 
  }: { 
    Icon: React.ComponentType<any>; 
    label: string; 
    description: string; 
    isToggle?: boolean; 
    value?: boolean; 
    onValueChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} disabled={isToggle}>
      <View style={styles.iconContainer}>
        <Icon size={18} color="#64748b" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {isToggle && onValueChange ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#cbd5e1', true: '#3b82f6' }}
          thumbColor="white"
        />
      ) : (
        <ChevronRight size={18} color="#94a3b8" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          style={styles.profileAvatar}
        >
          <User size={24} color="white" />
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Dr. Sarah Chen</Text>
          <Text style={styles.profileRole}>Cardiologist • ID: 12345</Text>
          <Text style={styles.profileStatus}>Active Session</Text>
        </View>
      </View>

      {/* Settings Content */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <SettingItem
            Icon={User}
            label="Profile Settings"
            description="Update your personal information"
          />
          <View style={styles.divider} />
          <SettingItem
            Icon={Shield}
            label="Privacy & Security"
            description="Manage your data and security settings"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.card}>
          <SettingItem
            Icon={Bell}
            label="Notifications"
            description="Manage notification preferences"
            isToggle
            value={notifications}
            onValueChange={setNotifications}
          />
          <View style={styles.divider} />
          <SettingItem
            Icon={darkMode ? Moon : Sun}
            label="Dark Mode"
            description="Switch between light and dark themes"
            isToggle
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <View style={styles.divider} />
          <SettingItem
            Icon={Mic}
            label="Microphone Access"
            description="Allow voice recording for AI assistant"
            isToggle
            value={micPermissions}
            onValueChange={setMicPermissions}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Integration</Text>
        <View style={styles.card}>
          <SettingItem
            Icon={Database}
            label="CRM Integration"
            description="Connect to external patient management systems"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2024.01.15</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Platform</Text>
            <Text style={styles.aboutValue}>Medical AI Assistant</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={18} color="#dc2626" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // slate-200
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b', // slate-800
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#64748b', // slate-500
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: '#16a34a', // green-600
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b', // slate-800
    marginBottom: 12,
    paddingLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#f1f5f9', // slate-100
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b', // slate-800
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748b', // slate-500
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9', // slate-100
    marginLeft: 72,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  aboutLabel: {
    fontSize: 14,
    color: '#64748b', // slate-600
  },
  aboutValue: {
    fontSize: 14,
    color: '#64748b', // slate-600
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2', // red-50
    borderWidth: 2,
    borderColor: '#fecaca', // red-200
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b91c1c', // red-700
  },
});