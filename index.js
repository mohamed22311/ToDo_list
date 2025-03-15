import { registerRootComponent } from 'expo';
import React from 'react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
// import TestApp from './TestApp';

// Wrap the App in an ErrorBoundary to catch and display errors
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWithErrorBoundary);
