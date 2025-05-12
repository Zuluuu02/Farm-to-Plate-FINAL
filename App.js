import React from 'react';
import AppNavigator from './navigation/AppNavigator'; 
import { AuthProvider } from './providers/AuthProvider';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
