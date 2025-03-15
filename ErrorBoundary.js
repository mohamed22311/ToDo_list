import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Something went wrong!</Text>
          <Text style={styles.error}>{this.state.error?.toString()}</Text>
          <Text style={styles.info}>
            {this.state.errorInfo?.componentStack || 'No component stack available'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8d7da',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: '#721c24',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#721c24',
    textAlign: 'center',
  },
});

export default ErrorBoundary; 