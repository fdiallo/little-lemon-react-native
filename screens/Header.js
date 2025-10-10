import { View, Text, StyleSheet, Image } from 'react-native';
import CircleButton from './CircleButton';
import { useNavigation } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();

    const goBack = async () => {
        navigation.navigate("Onboarding");
    }
  return (
      <View style={styles.container}>
          <CircleButton onPress={ () => {}} />
          <Image
              resizeMode='contain'
              style={styles.imgLogo}
              source={require('../img/little_lemon_logo.png')} />
          <Image
              resizeMode='contain'
              style={styles.imgProfile}
              source={require('../img/profile.png')} />
          
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    imgLogo: {
        height: 60,
        width: 220,
        
    },
    imgProfile: {
        height: 60,
        width: 60,
        borderRadius: 30,
        
    }
});
