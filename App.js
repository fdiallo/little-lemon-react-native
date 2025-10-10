import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Onboarding from './screens/Onboarding';
import Header from './screens/Header';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import Profile from './screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/SplashScreen';
import OnboardingHeader from './screens/OnboardingHeader';

const Stack = createNativeStackNavigator();
const REGISTRATION_STATUS_KEY = 'isRegistered';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    retrievedRegistrationStatus();

  }, []);

  const retrievedRegistrationStatus = async () => {
    setLoading(true)
    try { 
      setTimeout(async () => {
        const value = await AsyncStorage.getItem(REGISTRATION_STATUS_KEY);
        if (value !== null) {
          setIsRegistered(JSON.parse(value));
        }
         setLoading(false);
      }, 1000);
    } catch (error) {
      console.log('Error retrieving registration status ', error);
    } 
  }



  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
     
        <Stack.Navigator>
          {isRegistered ? (
            <Stack.Screen name="Profile" component={Profile}
            options={{
              headerShown: false, headerBackVisible: true
            }} />
          ) : (
            <Stack.Screen name="Onboarding" component={Onboarding}
              options={{ headerShown: false }}
              /*initialParams={{ setIsRegistered }}*/ />
          )}
        </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#608c7dff',
  },
  text: {
    paddingLeft: 48,
    paddingTop: 48,
  }
});


