import React from 'react';
import { StyleSheet, SafeAreaView} from 'react-native';

import FirstScreen from './screens/FirstScreen';


export default function App() {
  return (
  <SafeAreaView style={styles.screen}>
      <FirstScreen />
  </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  }
});
