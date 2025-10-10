import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import {
    View, StyleSheet, Text, TextInput,
    Pressable, KeyboardAvoidingView,
    ScrollView, Platform, Image, ActivityIndicator, Button,
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

const REGISTRATION_STATUS_KEY = 'isRegistered';
const REGISTRATION_FIRST_NAME_KEY = 'firstName';
const REGISTRATION_LAST_NAME_KEY = 'lastName';
const REGISTRATION_EMAIL_KEY = 'email';

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
    const [toggleCheckBoxNews, setToggleCheckBoxOrderNews] = useState(false);
    const [isRegistered, setIsRegistered] = useState(true);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        retrievedRegistrationStatus();
    }, []);

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
            }, 1000);
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

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const discardCheckboxChanges = () => {
        setToggleCheckBoxOrder(false);
        setToggleCheckBoxOrderNews(false);
        setToggleCheckBoxPassword(false);
        setToggleCheckBoxSpecial(false);
    }

    return (

        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.containerHeader}>
                <CircleButton onPress={() => { }} />
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
                                    <Ionicons name='camera'  size={48} color="#FFFFFF" />
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
                            onPress={() => {setImage(null)}}
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
                            onValueChange={(newValue) => setToggleCheckBoxOrderNews(newValue)}
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
                        style={styles.buttomSaveChanges}
                        onPress={() => { }}
                        disabled={isButtonActive}
                    >
                        <Text style={styles.saveChangesTxt}>Save changes</Text>
                    </Pressable>
                </View>

            </ScrollView>
            <Pressable
                style={styles.bottomContainer}
                onPress={logout}>
                <Text style={styles.button}>Log out</Text>
            </Pressable>
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
        //marginRight: 24,
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
        position: 'absolute',
        bottom: 40,
        left: 16,
        right: 16,
        height: 36,
        
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

