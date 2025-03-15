import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../themes/themes';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState(deviceTheme === 'dark' ? darkTheme : lightTheme);
  const [themeMode, setThemeMode] = useState(deviceTheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem('@theme_mode');
      if (savedThemeMode) {
        setThemeMode(savedThemeMode);
        setTheme(savedThemeMode === 'dark' ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newThemeMode);
    setTheme(newThemeMode === 'dark' ? darkTheme : lightTheme);
    
    try {
      await AsyncStorage.setItem('@theme_mode', newThemeMode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 