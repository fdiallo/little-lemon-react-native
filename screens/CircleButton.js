import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
//import Ionicons from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';

const CircleButton = ({ onPress }) => {
    
    return (
        <TouchableOpacity style = {styles.button} onPress = {onPress} >
            <Ionicons name = 'arrow-back' size={24} color ="#FFFFFF" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25, // Half of the width/height to make it a perfect circle
    backgroundColor: '#495E57',
    elevation: 3, // Adds a shadow on Android
    shadowColor: '#000', // Adds a shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CircleButton;