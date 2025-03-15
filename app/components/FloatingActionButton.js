import React, { useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const FloatingActionButton = ({ onPress }) => {
  const { theme } = useTheme();
  const spin = new Animated.Value(0);
  const scale = new Animated.Value(1);

  // Create a pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true
        }),
      ])
    );
    
    pulseAnimation.start();
    
    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  const animateButton = () => {
    Animated.timing(spin, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      onPress();
      setTimeout(() => {
        Animated.timing(spin, {
          toValue: 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true
        }).start();
      }, 500);
    });
  };

  return (
    <Animated.View
      style={[
        styles.shadow,
        {
          transform: [{ scale }],
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.shadow
          }
        ]}
        onPress={animateButton}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="add" size={28} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default FloatingActionButton; 