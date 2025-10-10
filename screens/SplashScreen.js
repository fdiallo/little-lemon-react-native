import * as React from 'react';
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native';


export default function SplashScreen() {
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading registration status...</Text>
      </View>
    );
}
