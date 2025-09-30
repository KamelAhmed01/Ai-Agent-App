import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface AudioWaveformProps {
  isRecording: boolean;
  size?: 'normal' | 'small';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  isRecording, 
  size = 'normal' 
}) => {
  const barHeights = useRef(
    new Array(20).fill(0).map(() => new Animated.Value(0))
  ).current;
  const opacityAnims = useRef(
    new Array(20).fill(0).map(() => new Animated.Value(0.7))
  ).current;
  const containerAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      Animated.timing(containerAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      startSimulation();
      startOpacityAnimations();
    } else {
      Animated.timing(containerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      stopSimulation();
    }

    return () => {
      stopSimulation();
    };
  }, [isRecording]);

  const startOpacityAnimations = () => {
    opacityAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  };

  const startSimulation = () => {
    const updateSimulated = () => {
      if (!isRecording) return;
      
      // Create realistic simulated audio data and animate heights
      const animations = new Array(20).fill(0).map((_, index) => {
        const baseHeight = 30 + Math.sin(Date.now() * 0.001 + index * 0.5) * 20;
        const randomVariation = Math.random() * 40 + 10;
        const newHeight = Math.max(baseHeight + randomVariation, 8);
        
        return Animated.timing(barHeights[index], {
          toValue: newHeight,
          duration: 100, // Fast animation for height changes
          useNativeDriver: false, // height is not supported by native driver
        });
      });
      
      Animated.parallel(animations).start();
      animationRef.current = requestAnimationFrame(updateSimulated) as unknown as number;
    };
    
    updateSimulated();
  };

  const stopSimulation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    // Reset heights to 0
    barHeights.forEach(anim => anim.setValue(0));
  };

  if (!isRecording) return null;

  const isSmall = size === 'small';
  const barCount = isSmall ? 8 : 20;
  const barWidth = isSmall ? 1.5 : 3;
  const heightMultiplier = isSmall ? 0.3 : 0.6;
  const minHeight = isSmall ? 2 : 4;
  const containerHeight = isSmall ? 24 : 64;
  const spacing = isSmall ? 2 : 4;

  const containerStyle = {
    opacity: containerAnim,
    transform: [{
      scale: containerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] })
    }]
  };

  return (
    <Animated.View style={[styles.container, { height: containerHeight, gap: spacing }, containerStyle]}>
      {barHeights.slice(0, barCount).map((_, index) => {
        const barHeight = barHeights[index].interpolate({
          inputRange: [0, 100],
          outputRange: [minHeight, containerHeight * 0.9],
          extrapolate: 'clamp',
        });
        
        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: barHeight,
                opacity: opacityAnims[index],
              }
            ]}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
});
