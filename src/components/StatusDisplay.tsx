import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Activity, Database, FileText, Search, Zap } from 'lucide-react-native';

interface StatusDisplayProps {
  currentStatus: string;
  isComplete: boolean;
}

const statusConfig = {
  'Listening...': { icon: Activity, color: '#ef4444', bgColor: '#fef2f2', borderColor: '#fecaca' },
  'Processing request...': { icon: Zap, color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  'Getting patient profile...': { icon: Search, color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fcd34d' },
  'Accessing medical records...': { icon: Database, color: '#8b5cf6', bgColor: '#faf5ff', borderColor: '#d8b4fe' },
  'Generating report...': { icon: FileText, color: '#06b6d4', bgColor: '#ecfeff', borderColor: '#a5f3fc' },
  'Finalizing results...': { icon: Zap, color: '#10b981', bgColor: '#f0fdf4', borderColor: '#bbf7d0' },
  'Task completed': { icon: Activity, color: '#059669', bgColor: '#ecfdf5', borderColor: '#a7f3d0' },
  // Adding edit-related statuses from the mobile file, mapping to lucide icons
  'Processing edit request...': { icon: Zap, color: '#8b5cf6', bgColor: '#faf5ff', borderColor: '#d8b4fe' },
  'Analyzing current report...': { icon: Search, color: '#3b82f6', bgColor: '#eff6ff', borderColor: '#bfdbfe' },
  'Applying modifications...': { icon: FileText, color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#fcd34d' },
  'Validating changes...': { icon: Activity, color: '#10b981', bgColor: '#f0fdf4', borderColor: '#bbf7d0' },
  'Updating report...': { icon: Database, color: '#06b6d4', bgColor: '#ecfeff', borderColor: '#a5f3fc' },
  'Edit completed': { icon: Activity, color: '#059669', bgColor: '#ecfdf5', borderColor: '#a7f3d0' },
};

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ 
  currentStatus, 
  isComplete 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;
  const textOpacityAnim = useRef(new Animated.Value(0.7)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const isLoading = !isComplete && currentStatus !== 'Task completed' && currentStatus !== 'Edit completed';
  const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig['Processing request...'];
  const IconComponent = config.icon;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Reset animations before starting loops
    textOpacityAnim.stopAnimation();
    progressAnim.stopAnimation();

    // Text pulse animation
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(textOpacityAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacityAnim, {
            toValue: 0.7,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress bar animation
      progressAnim.setValue(0); // Reset before starting
      Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false, // width is not supported by native driver
        })
      ).start();
    } else {
      textOpacityAnim.setValue(1);
      progressAnim.setValue(0);
    }
  }, [currentStatus, isLoading]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.content}>
          <IconComponent size={20} color={config.color} strokeWidth={2.5} />
          <Animated.Text 
            style={[
              styles.statusText,
              { color: config.color, opacity: textOpacityAnim }
            ]}
          >
            {currentStatus}
          </Animated.Text>
        </View>
        
        {/* Progress bar */}
        {isLoading && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: config.color,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  transform: [{
                    translateX: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-100%', '0%']
                    })
                  }]
                }
              ]}
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 384,
    paddingHorizontal: 16,
    marginHorizontal: 'auto',
  },
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
