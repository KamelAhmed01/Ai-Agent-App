import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { RotateCcw, CheckCircle2 } from 'lucide-react-native';

interface TaskResultsProps {
  task: string;
  onNewTask: () => void;
}

export const TaskResults: React.FC<TaskResultsProps> = ({ task, onNewTask }) => {
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const containerSlideAnim = useRef(new Animated.Value(20)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(-90)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(10)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(10)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const refreshIconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Container entry
    Animated.parallel([
      Animated.timing(containerFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(containerSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Card scale
    Animated.timing(cardScaleAnim, {
      toValue: 1,
      duration: 300,
      delay: 100,
      useNativeDriver: true,
    }).start();

    // Icon animation
    Animated.parallel([
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        delay: 300,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(iconRotateAnim, {
        toValue: 0,
        delay: 300,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Text animation
    Animated.parallel([
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 300,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 300,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Button animation
    Animated.parallel([
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 300,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlideAnim, {
        toValue: 0,
        duration: 300,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Refresh icon animation
    Animated.timing(refreshIconRotateAnim, {
      toValue: 1,
      duration: 300,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerFadeAnim,
          transform: [{ translateY: containerSlideAnim }],
        }
      ]}
    >
      {/* Task completion card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardScaleAnim,
            transform: [{ scale: cardScaleAnim }],
          }
        ]}
      >
        {/* Success header */}
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [
                  { scale: iconScaleAnim },
                  { 
                    rotate: iconRotateAnim.interpolate({
                      inputRange: [-90, 0],
                      outputRange: ['-90deg', '0deg'],
                    })
                  },
                ],
              }
            ]}
          >
            <CheckCircle2 size={24} color="#059669" strokeWidth={2.5} />
          </Animated.View>
        </View>
        
        {/* Task details */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textSlideAnim }],
            }
          ]}
        >
          <Text style={styles.title}>TASK COMPLETED</Text>
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{task}</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* New task button */}
      <Animated.View
        style={[
          {
            opacity: buttonFadeAnim,
            transform: [{ translateY: buttonSlideAnim }, { scale: buttonScaleAnim }],
          }
        ]}
      >
        <Pressable
          style={styles.button}
          onPress={onNewTask}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Animated.View style={{ 
            transform: [{ 
              rotate: refreshIconRotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-15deg']
              }) 
            }] 
          }}>
            <RotateCcw size={18} color="white" strokeWidth={2.5} />
          </Animated.View>
          <Text style={styles.buttonText}>NEW TASK</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
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
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#a7f3d0',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857', // Changed from emerald-600 to emerald-700
    letterSpacing: 1,
  },
  taskCard: {
    backgroundColor: '#ecfdf5', // Changed from f0fdf4 to ecfdf5
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  taskText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#475569',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
