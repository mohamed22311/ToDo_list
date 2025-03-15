const colors = {
  light: {
    primary: '#007AFF',       // Bright blue
    secondary: '#5856D6',    // Rich purple
    background: '#F9F9FB',    // Slightly off-white
    card: '#FFFFFF',          // Pure white cards
    text: '#1C1C1E',          // Near black
    textLight: '#8A8A8E',     // Medium gray
    border: '#E5E5EA',        // Light gray
    notification: '#FF9500',  // Bright orange
    error: '#FF3B30',         // Vivid red
    success: '#34C759',       // Vibrant green
    warning: '#FFCC00',       // Bright yellow
    info: '#5AC8FA',          // Sky blue
    high: '#FF3B30',          // Vivid red for high priority
    medium: '#FF9500',        // Bright orange for medium priority
    low: '#34C759',          // Vibrant green for low priority
    completed: '#A3AED0',     // Muted blue gray
    icon: '#637381',          // Medium gray for icons
    shadow: '#000000',        // Black for shadows
  },
  dark: {
    primary: '#0A84FF',       // Brighter blue for dark mode
    secondary: '#BF5AF2',    // Bright purple
    background: '#121212',    // Deep black
    card: '#1E1E1E',          // Dark gray card
    text: '#FFFFFF',          // White text
    textLight: '#8E8E93',     // Medium gray
    border: '#2C2C2E',         // Dark gray border
    notification: '#FF9F0A',   // Bright orange
    error: '#FF453A',         // Bright red
    success: '#30D158',       // Bright green
    warning: '#FFD60A',        // Bright yellow
    info: '#64D2FF',          // Bright blue
    high: '#FF453A',           // Bright red for high priority
    medium: '#FF9F0A',         // Bright orange for medium priority
    low: '#30D158',            // Bright green for low priority
    completed: '#6B7280',       // Medium gray
    icon: '#9CA3AF',           // Medium gray for icons
    shadow: '#000000',          // Black for shadows
  },
};

const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

const fontSizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

const fontWeights = {
  regular: '400',
  medium: '500',
  bold: '700',
};

const borderRadius = {
  s: 4,
  m: 8,
  l: 12,
  xl: 20,
  round: 50,
};

export const lightTheme = {
  colors: colors.light,
  spacing,
  fontSizes,
  fontWeights,
  borderRadius,
};

export const darkTheme = {
  colors: colors.dark,
  spacing,
  fontSizes,
  fontWeights,
  borderRadius,
}; 