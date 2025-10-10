import * as React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text
        style={styles.heading}>
        Let us get to know you
      </Text>
      <Text
        style={styles.text}>
        First Name
      </Text>
      <TextInput style={styles.textInput} />
      <Text
        style={styles.text}>
        Last Name
      </Text>
      <TextInput style={styles.textInput} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: 'rgba(107, 111, 119, 1)',
    alignItems: 'center',
  },
  heading: {
    padding: 40,
    fontSize: 32,
    color: '#EDEFEE',
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    padding: 20,
    marginVertical: 8,
    color: '#EDEFEE',
    textAlign: 'center',
  },
  textInput: {

    height: 40,
    borderWidth: 1,
    padding: 24,
    margin: 24,

  }

});