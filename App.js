import React, { useState, useContext, useEffect } from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StyleSheet } from 'react-native';
import NavigationScreen from './navigation/navigation';
import AppContext from './navigation/appContext';
// import useFonts hook  

export default function App() {
  return(
    <ActionSheetProvider>
      <AppContext>
        <NavigationScreen></NavigationScreen>
      </AppContext>
    </ActionSheetProvider>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
