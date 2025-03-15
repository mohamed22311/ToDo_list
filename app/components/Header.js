import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const Header = ({ title, showThemeToggle = true, rightIcon, onRightIconPress }) => {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.card,
      borderBottomColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
    }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title}
      </Text>
      <View style={styles.rightContainer}>
        {showThemeToggle && (
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.themeToggle}
          >
            <Ionicons 
              name={themeMode === 'dark' ? 'sunny' : 'moon'} 
              size={24} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
            <Ionicons name={rightIcon} size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
  },
  iconButton: {
    marginLeft: 15,
    padding: 8,
    borderRadius: 20,
  }
});

export default Header; 