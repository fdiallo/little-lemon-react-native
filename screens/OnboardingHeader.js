import { View, Text, StyleSheet, Image } from 'react-native';

export default function OnboardingHeader() {
  return (
      <View style={styles.container}>
          <Image
              resizeMode='contain'
              style={styles.img}
              source={require('../img/little_lemon_logo.png')} />
          
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 0.3,
        alignItems: 'center',
    },
    img: {
        height: 100,
        width: 200,
        
    },
});
