import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Pressable,
  FlatList,
  Image,
} from 'react-native';
import { Search, Plus, ChevronRight, AlertCircle } from 'lucide-react-native';
import { Patient } from '../types';
// We'll use a simple View as a placeholder for the image for now.
// In a real app, you'd use a component like React Native's Image.

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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastVisit: '4 hours ago',
    condition: 'General Medicine'
  },
  {
    id: '3',
    name: 'Noah Thompson',
    room: 'Room 203',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastVisit: '1 day ago',
    condition: 'Orthopedics'
  },
  {
    id: '4',
    name: 'Ava Martinez',
    room: 'Room 204',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isUrgent: true,
    lastVisit: '30 minutes ago',
    condition: 'Emergency'
  },
  {
    id: '5',
    name: 'Liam Harris',
    room: 'Room 205',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastVisit: '6 hours ago',
    condition: 'Pediatrics'
  },
  {
    id: '6',
    name: 'Isabella Clark',
    room: 'Room 206',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastVisit: '3 days ago',
    condition: 'Dermatology'
  }
];

interface PatientCardProps {
  patient: Patient;
  index: number;
  onPress: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, index, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 80,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Animated.View 
      style={[
        styles.patientCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.patientCard,
          pressed && styles.patientCardPressed
        ]}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image 
              source={{ uri: patient.avatar }}
              style={styles.avatarImage}
            />
          </View>
          {patient.isUrgent && (
            <View style={styles.urgentBadge}>
              <AlertCircle size={10} color="white" />
            </View>
          )}
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{patient.room}</Text>
            <Text style={styles.infoDot}>•</Text>
            <Text style={styles.infoText}>{patient.condition}</Text>
          </View>
          <Text style={styles.lastVisit}>{patient.lastVisit}</Text>
        </View>

        {/* Arrow */}
        <ChevronRight size={18} color="#94a3b8" />
      </Pressable>
    </Animated.View>
  );
};

export const PatientsScreen: React.FC<{ onPatientSelect: (patient: Patient) => void }> = ({ 
  onPatientSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent'>('all');
  
  // The filtering logic is good and doesn't need changes.
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonAllActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'urgent' && styles.filterButtonUrgentActive]}
          onPress={() => setActiveFilter('urgent')}
        >
          <AlertCircle size={16} color={activeFilter === 'urgent' ? 'white' : '#64748b'} />
          <Text style={[styles.filterText, activeFilter === 'urgent' && styles.filterTextActive]}>
            Urgent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Patient List */}
      <FlatList
        data={mockPatients.filter(patient => {
          const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               patient.room.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = activeFilter === 'all' || 
                               (activeFilter === 'urgent' && patient.isUrgent);
          
          return matchesSearch && matchesFilter;
        })}
        renderItem={({ item, index }) => (
          <PatientCard
            patient={item}
            index={index}
            onPress={() => onPatientSelect(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Search size={24} color="#94a3b8" />
            </View>
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInputContainer: {
    position: 'relative',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    marginTop: -9,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
    color: '#1e293b',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  filterButtonAll: {
    backgroundColor: '#f1f5f9', // slate-100
  },
  filterButtonAllActive: {
    backgroundColor: '#3b82f6', // blue-500
  },
  filterButtonUrgent: {
    backgroundColor: '#f1f5f9', // slate-100
  },
  filterButtonUrgentActive: {
    backgroundColor: '#ef4444', // red-500
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155', // slate-700
  },
  filterTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    gap: 12,
  },
  patientCardPressed: {
    borderColor: '#93c5fd', // blue-300
    backgroundColor: '#f8fafc'
  },
  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e2e8f0', // slate-200
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444', // red-500
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b', // slate-800
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#64748b', // slate-500
  },
  infoDot: {
    color: '#cbd5e1', // slate-300
  },
  lastVisit: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e2e8f0', // slate-200
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b', // slate-500
  },
});