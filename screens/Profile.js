import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import {
    View, StyleSheet, Text, TextInput,
    Pressable, KeyboardAvoidingView,
    ScrollView, Platform, Image, ActivityIndicator, Button, Alert,
} from 'react-native';
import Header from './Header';
import { useState, useEffect, } from 'react';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './Onboarding';
import * as ImagePicker from 'expo-image-picker';
import CircleButton from './CircleButton';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from './Home';
import { useNavigation } from '@react-navigation/native';

const REGISTRATION_STATUS_KEY = 'isRegistered';
const REGISTRATION_FIRST_NAME_KEY = 'firstName';
const REGISTRATION_LAST_NAME_KEY = 'lastName';
const REGISTRATION_EMAIL_KEY = 'email';

const PROFILE_IMAGE_URI = 'profileImageURI';
const EMAIL = 'email';
const PHONE_NUMBER = 'phoneNumber';
const TOOGLE_CHECKBOX_ORDER = 'toggleCheckBoxOrder';
const TOOGLE_CHECKBOX_PASSWORD = 'toggleCheckBoxPassword';
const TOOGLE_CHECKBOX_SPECIAL = 'toggleCheckBoxSpecial';
const TOOGLE_CHECKBOX_NEWS = 'toggleCheckBoxNews';

export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [errors, setErrors] = useState({});
    const [toggleCheckBoxOrder, setToggleCheckBoxOrder] = useState(false);
    const [toggleCheckBoxPassword, setToggleCheckBoxPassword] = useState(false);
    const [toggleCheckBoxSpecial, setToggleCheckBoxSpecial] = useState(false);
    const [toggleCheckBoxNews, setToggleCheckBoxNews] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [isMoveToHome, setIsMoveToHome] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        retrievedRegistrationStatus();
        retrievedProfileImageURI();
        retrieveEmailNotificationsPreferences();
    }, []);

    const retrieveEmailNotificationsPreferences = async () => {
        
        try {
            setTimeout(async () => {
                const phoneNumberValue = await AsyncStorage.getItem(PHONE_NUMBER);
                const toggleCheckBoxOrderValue = await AsyncStorage.getItem(TOOGLE_CHECKBOX_ORDER);
                const toggleCheckBoxPasswordValue = await AsyncStorage.getItem(TOOGLE_CHECKBOX_PASSWORD);
                const toggleCheckBoxSpecialValue = await AsyncStorage.getItem(TOOGLE_CHECKBOX_SPECIAL);
                const toggleCheckBoxNewsValue = await AsyncStorage.getItem(TOOGLE_CHECKBOX_NEWS);
                
                if (phoneNumberValue !== null) {
                    setPhoneNumber(JSON.parse(phoneNumberValue));
                }
                if (toggleCheckBoxOrderValue !== null) {
                    setToggleCheckBoxOrder(JSON.parse(toggleCheckBoxOrderValue));
                }
                if (toggleCheckBoxPasswordValue !== null) {
                    setToggleCheckBoxPassword(JSON.parse(toggleCheckBoxPasswordValue));
                }
                if (toggleCheckBoxSpecialValue !== null) {
                    setToggleCheckBoxSpecial(JSON.parse(toggleCheckBoxSpecialValue));
                }
                if (toggleCheckBoxNewsValue !== null) {
                    setToggleCheckBoxNews(JSON.parse(toggleCheckBoxNewsValue));
                }
               
            }, 200);
        } catch (error) {
            console.log('Error retrieving profile image', error);
        }
    }

    const retrievedProfileImageURI = async () => {
        setLoading(true)
        try {
            setTimeout(async () => {
                const value = await AsyncStorage.getItem(PROFILE_IMAGE_URI);
                if (value !== null) {
                    setImage(JSON.parse(value));
                }
                setLoading(false);
            }, 200);
        } catch (error) {
            console.log('Error retrieving profile image', error);
        }
    }

    const retrievedRegistrationStatus = async () => {

        try {
            // setTimeout(async () => {
            const first_name = await AsyncStorage.getItem(REGISTRATION_FIRST_NAME_KEY);
            const last_name = await AsyncStorage.getItem(REGISTRATION_LAST_NAME_KEY);
            const _email = await AsyncStorage.getItem(REGISTRATION_EMAIL_KEY);
            if (first_name !== null) {
                //console.log('User First Name: ', first_name);
                setFirstName(JSON.parse(first_name));
            }
            if (last_name !== null) {
                setLastName(JSON.parse(last_name));
            }
            if (_email !== null) {
                setEmail(JSON.parse(_email));
            }

            //}, 1000);
        } catch (error) {
            console.log('Error retrieving registration status ', error);
        }
    }

    const logout = async () => {
        setLoading(true);
        try {
            setTimeout(async () => {
                await AsyncStorage.removeItem(REGISTRATION_STATUS_KEY);
                setIsRegistered(false);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.log('Error removing use registration status: ', error);
        }
    }

    if (!isRegistered) {
        return (
            <Onboarding />
        );
    }

    if (loading) {

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loagging out...</Text>
            </View>
        );
    }

    const moveToHome = async () => {
        setLoading(true);
        try {
            setTimeout(async () => {
                setIsMoveToHome(true);
                setLoading(false);
            }, 200);
        } catch (error) {
            console.log('Error moving to Home screen: ', error);
        }
    }

    if (isMoveToHome) {
        return (<Home />);
    }

    const saveProfileImageURI = async (profileImg) => {
        try {
            const jsonImageValue = JSON.stringify(profileImg);

            await AsyncStorage.setItem(PROFILE_IMAGE_URI, jsonImageValue);
            //setImage(profileImg);

            //Alert.alert('Success', `Profile Image: ${profileImg}`);
        } catch (error) {
            console.log('Error saving registration status: ', error);
            //Alert.alert('Error', 'Failed to save registration status.');
        }
    }

    const removeProfileImage = async () => {
        //setLoading(true);
        try {
            setTimeout(async () => {
                await AsyncStorage.removeItem(PROFILE_IMAGE_URI);
                setImage(null);
                //setLoading(false);
            }, 200);
        } catch (error) {
            console.log('Error removing profile image: ', error);
        }
    }


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log('Image Picker Result: ', result);

        if (!result.canceled) {
            console.log('Image Picker URI: ', result.assets[0].uri)
            setImage(result.assets[0].uri);
            saveProfileImageURI(result.assets[0].uri)
        }
        console.log('2Image Picker URI: ', image);
    };

    const discardCheckboxChanges = () => {
        setToggleCheckBoxOrder(false);
        setToggleCheckBoxNews(false);
        setToggleCheckBoxPassword(false);
        setToggleCheckBoxSpecial(false);
    }

    const saveChanges = async () => {
        try {
            const jsonPhoneValue = JSON.stringify(phoneNumber);
            const jsonOrderValue = JSON.stringify(toggleCheckBoxOrder);
            const jsonPasswordValue = JSON.stringify(toggleCheckBoxPassword);
            const jsonSpecialValue = JSON.stringify(toggleCheckBoxSpecial);
            const jsonNewsValue = JSON.stringify(toggleCheckBoxNews);

            await AsyncStorage.setItem(PHONE_NUMBER, jsonPhoneValue);
            await AsyncStorage.setItem(TOOGLE_CHECKBOX_ORDER, jsonOrderValue);
            await AsyncStorage.setItem(TOOGLE_CHECKBOX_PASSWORD, jsonPasswordValue);
            await AsyncStorage.setItem(TOOGLE_CHECKBOX_SPECIAL, jsonSpecialValue);
            await AsyncStorage.setItem(TOOGLE_CHECKBOX_NEWS, jsonNewsValue);

            Alert.alert('Success Preferences Saved!');
            
        } catch (error) {
            console.log('Error saving registration status: ', error);
            //Alert.alert('Error', 'Failed to save changes.');
        }
    }

    return (

        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.containerHeader}>
                <CircleButton onPress={moveToHome} />
                <Image
                    resizeMode='contain'
                    style={styles.imgLogo}
                    source={require('../img/little_lemon_logo.png')} />
                <Image
                    resizeMode='contain'
                    style={styles.imgProfile}
                    source={{ uri: image }} />
            </View>
            <ScrollView keyboardDismissMode='on-drag'  >
                <View style={styles.contentContainer}>
                    <Text style={styles.persoInfo}>Personal Information</Text>
                    <Text style={styles.avatar}>Avatar</Text>
                    <View style={styles.imageRow}>

                        <Pressable title="Pic" onPress={pickImage} >
                            {image !== null ? (<Image source={{ uri: image }} style={styles.img} />) :
                                (<TouchableOpacity style={styles.takeProfilePic} onPress={pickImage} >
                                    <Ionicons name='camera' size={48} color="#FFFFFF" />
                                </TouchableOpacity>)}
                        </Pressable>

                        <Pressable
                            style={styles.buttonChange}
                            onPress={pickImage}
                            disabled={isButtonActive}>
                            <Text style={styles.textButtonChange}>Change</Text>
                        </Pressable>
                        <Pressable
                            style={styles.buttonRemove}
                            onPress={removeProfileImage}
                            disabled={isButtonActive}>
                            <Text style={styles.textButtonRemove}>Remove</Text>
                        </Pressable>
                    </View>
                    <Text style={styles.text}>First Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={firstName}
                        editable={false}
                    />
                    <Text style={styles.text}>Last Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={lastName}
                        editable={false}
                    />
                    <Text style={styles.text}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        editable={true}
                    />

                    <Text style={styles.text}>Phone number</Text>
                    <TextInput
                        style={styles.textInput}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType='phone-pad'
                        clearButtonMode='always'
                        placeholder='Enter your phone number'
                    />
                    {errors.phoneNumber && <Text style={{ color: 'red' }}>{errors.email}</Text>}

                    <Text style={styles.emailNotification}>Email notifications</Text>
                    <View style={styles.checkBoxRow}>
                        <Checkbox
                            disabled={false}
                            value={toggleCheckBoxOrder}
                            onValueChange={(newValue) => setToggleCheckBoxOrder(newValue)}
                            tintColor={{ true: '#495E57', false: '#999' }}
                        />
                        <Text style={styles.checkBoxText}>Order statuses</Text>
                    </View>
                    <View style={styles.checkBoxRow}>
                        <Checkbox
                            disabled={false}
                            value={toggleCheckBoxPassword}
                            onValueChange={(newValue) => setToggleCheckBoxPassword(newValue)}
                            tintColor={{ true: '#495E57', false: '#999' }}
                        />
                        <Text style={styles.checkBoxText}>Password changes</Text>
                    </View>
                    <View style={styles.checkBoxRow}>
                        <Checkbox
                            disabled={false}
                            value={toggleCheckBoxSpecial}
                            onValueChange={(newValue) => setToggleCheckBoxSpecial(newValue)}
                            tintColor={{ true: '#495E57', false: '#999' }}
                        />
                        <Text style={styles.checkBoxText}>Special offers</Text>
                    </View>
                    <View style={styles.checkBoxRow}>
                        <Checkbox
                            disabled={false}
                            value={toggleCheckBoxNews}
                            onValueChange={(newValue) => setToggleCheckBoxNews(newValue)}
                            tintColor={{ true: '#495E57', false: '#999' }}
                        />
                        <Text style={styles.checkBoxText}>Newsletter</Text>
                    </View>

                </View>
                <View style={styles.buttonDiscardAndSaveRow}>
                    <Pressable
                        style={styles.buttonDiscardChanges}
                        onPress={discardCheckboxChanges}
                        disabled={isButtonActive}
                    >
                        <Text style={styles.discardChangesTxt}>Discard changes</Text>
                    </Pressable>
                    <Pressable
                        style={styles.buttonSaveChanges}
                        onPress={saveChanges}
                        disabled={isButtonActive}
                    >
                        <Text style={styles.saveChangesTxt}>Save changes</Text>
                    </Pressable>
                </View>


                <Pressable
                    style={styles.bottomContainer}
                    onPress={logout}>
                    <Text style={styles.button}>Log out</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView >

    );

}


const styles = StyleSheet.create({

    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,

    },
    imgLogo: {
        height: 100,
        width: 220,

    },
    imgProfile: {
        height: 60,
        width: 60,
        borderRadius: 30,

    },
    takeProfilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#495E57',
        marginRight: 24,

    },
    container: {
        flex: 1,
    },
    avatar: {
        paddingBottom: 4,
        fontSize: 14,
        color: 'grey'
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    img: {
        width: 60,
        height: 60,
        marginRight: 24,
        borderRadius: 30,
    },
    buttonChange: {
        marginRight: 24,
        borderWidth: 1,
        borderRadius: 8,


    },
    buttonRemove: {
        borderWidth: 1,
    },
    textButtonChange: {
        textAlign: 'center',
        color: '#FFFFFF',
        backgroundColor: '#495E57',
        fontSize: 12,
        borderRadius: 8,
        textAlignVertical: 'center',
        paddingHorizontal: 16,
        fontWeight: 'bold',
        height: 36,

    },
    textButtonRemove: {

        textAlign: 'center',
        color: '#495E57',
        backgroundColor: '#cdd4d3ff',
        fontSize: 12,
        paddingHorizontal: 16,
        textAlignVertical: 'center',
        fontWeight: 'bold',
        height: 36,
    },
    main: {
        flex: 1,
    },
    heading: {
        height: 100,
        backgroundColor: '#495E57',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headingText: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 2,
        paddingHorizontal: 16,
    },
    persoInfo: {
        fontSize: 24,
        paddingBottom: 8,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        paddingBottom: 2,
        paddingTop: 4,
    },
    textInput: {
        borderWidth: 1,
        fontSize: 11,
        paddingHorizontal: 16,
        borderRadius: 8,
        height: 40,

    },
    emailNotification: {
        fontSize: 16,
        paddingBottom: 4,
        paddingTop: 16,
        fontWeight: 'bold',
    },
    checkBoxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    checkBoxText: {
        fontSize: 12,
        paddingLeft: 8,
    },
    buttonDiscardAndSaveRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'

    },
    buttonDiscardChanges: {

    },
    buttonSaveChanges: {

    },
    discardChangesTxt: {
        height: 36,
        textAlign: 'center',
        backgroundColor: '#e2e1deff',
        fontSize: 12,
        borderRadius: 8,
        textAlignVertical: 'center',
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
    saveChangesTxt: {

        height: 36,
        textAlign: 'center',
        backgroundColor: '#495E57',
        fontSize: 12,
        color: '#FFFFFF',
        borderRadius: 8,
        textAlignVertical: 'center',
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
    bottomContainer: {

         bottom: 24,
        left: 0,
        right: 0,
        marginHorizontal: 16,
        marginTop: 72,

    },
    button: {

        textAlignVertical: 'center',
        textAlign: 'center',
        height: 40,
        backgroundColor: '#F4CE14',
        fontSize: 16,
        borderRadius: 8,

        fontWeight: 'bold',
        borderWidth: 1,
        borderRadius: 8,

    }

});

