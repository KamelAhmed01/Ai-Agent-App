import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AIAvatar } from '../components/AIAvatar';
import { StatusDisplay } from '../components/StatusDisplay';
import { AppState } from '../types';

interface DashboardScreenProps {
  state: AppState;
  currentStatus: string;
  processedTask: string;
  onRecordingStart: () => void;
  onRecordingStop: (recordingTime: number) => void;
  onNewTask: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  state,
  currentStatus,
  processedTask,
  onRecordingStart,
  onRecordingStop,
  onNewTask,
}) => {
  const avatarY = React.useRef(new Animated.Value(0)).current;
  const avatarScale = React.useRef(new Animated.Value(1)).current;
  const statusOpacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Y animation for avatar
    Animated.timing(avatarY, {
      toValue: state === 'recording' ? -8 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scale animation for avatar
    Animated.timing(avatarScale, {
      toValue: (state === 'complete' || state === 'showing-summary') ? 1.1 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Opacity animation for status
    Animated.timing(statusOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

  }, [state, avatarY, avatarScale, statusOpacity]);

  return (
    <LinearGradient
      colors={['#f8fafc', '#eff6ff', '#f1f5f9']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* AI Avatar - Always visible and centered */}
        <Animated.View 
          style={[
            styles.avatarWrapper,
            {
              transform: [
                { translateY: avatarY },
                { scale: avatarScale }
              ]
            }
          ]}
        >
          <AIAvatar 
            isRecording={state === 'recording'} 
            isProcessing={state === 'processing'}
            isComplete={state === 'complete'}
            isShowingSummary={state === 'showing-summary'}
            onRecordingStart={onRecordingStart}
            onRecordingStop={onRecordingStop}
            isDisabled={state === 'processing'}
            processedTask={processedTask}
            currentStatus={currentStatus}
          />
        </Animated.View>

        {/* Status text - now only shown when idle */}
        <Animated.View style={[styles.statusContainer, { opacity: statusOpacity }]}>
          {state === 'idle' && (
            <View style={styles.centerText}>
              <Text style={styles.idleText}>Press & Hold</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    marginBottom: 48,
  },
  statusContainer: {
    width: '100%',
    maxWidth: 448,
  },
  centerText: {
    alignItems: 'center',
  },
  idleText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.35,
  },
});