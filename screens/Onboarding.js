import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Header from './Header';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ActivityIndicator } from 'react-native';
import Profile from './Profile';
import OnboardingHeader from './OnboardingHeader';

const REGISTRATION_STATUS_KEY = 'isRegistered';
const REGISTRATION_FIRST_NAME_KEY = 'firstName';
const REGISTRATION_LAST_NAME_KEY = 'lastName';
const REGISTRATION_EMAIL_KEY = 'email';

export default function Onboarding({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userRegistrationDetails, setUserRegistrationDetails] = useState([]);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [errors, setErrors] = useState({});
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const saveRegistrationStatus = async (status,
        firstName, lastName, email) => {
        try {
            const jsonStatusValue = JSON.stringify(status);
            const jsonFirstNameValue = JSON.stringify(firstName);
            const jsonLastNameValue = JSON.stringify(lastName);
            const jsonEmailValue = JSON.stringify(email);
            await AsyncStorage.setItem(REGISTRATION_STATUS_KEY, jsonStatusValue);
            await AsyncStorage.setItem(REGISTRATION_FIRST_NAME_KEY, jsonFirstNameValue);
            await AsyncStorage.setItem(REGISTRATION_LAST_NAME_KEY, jsonLastNameValue);
            await AsyncStorage.setItem(REGISTRATION_EMAIL_KEY, jsonEmailValue);
            setIsRegistered(status);
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            //Alert.alert('Success', `Registration status saved: ${status}`);
        } catch (error) {
            console.log('Error saving registration status: ', error);
            //Alert.alert('Error', 'Failed to save registration status.');
        }
    }

    const handleRegistration = async () => {
        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required.';
        }
        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required.';
        }
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email format.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Form is valid, proceed with submission
            setLoading(true);
            setTimeout(async () => {
                await saveRegistrationStatus(true, firstName, lastName, email);
                //await saveUserRegistrationDetails();
                setLoading(false);
            }, 500);

            console.log('Form submitted successfully!');

        };
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading registration status...</Text>
            </View>
        );
    }

    if (isRegistered) {
        return (
            <Profile />
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <OnboardingHeader />
            <ScrollView keyboardDismissMode='on-drag'  >
                <View style={styles.heading}>
                    <Text style={styles.headingText}>Let us get to know you</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.persoInfo}>Personal Information</Text>
                    <Text style={styles.text}>First Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={firstName}
                        onChangeText={setFirstName}
                        clearButtonMode='always'
                        placeholder='Enter your First Name'/>
                    {errors.firstName && <Text style={{ color: 'red' }}>{errors.firstName}</Text>}
                    <Text style={styles.text}>Last Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={lastName}
                        onChangeText={setLastName}
                        clearButtonMode='always'
                        placeholder='Enter your Last Name'/>
                    {errors.lastName && <Text style={{ color: 'red' }}>{errors.lastName}</Text>}
                    <Text style={styles.text}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        clearButtonMode='always'
                        placeholder='Enter you email'/>
                    {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                </View>
            </ScrollView>

            <Pressable
                style={styles.bottomContainer}
                onPress={handleRegistration}
                disabled={isButtonActive}>
                <Text style={styles.button}>Next</Text>
            </Pressable>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
        paddingBottom: 70,
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
        paddingTop: 64,
        paddingHorizontal: 16,
    },
    persoInfo: {
        fontSize: 24,
        paddingBottom: 32,
        paddingTop: 16,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        paddingBottom: 8,
        paddingTop: 16,
    },
    textInput: {
        borderWidth: 1,
        fontSize: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        height: 48,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 40,
        left: 16,
        right: 16,
    },
    button: {
        height: 48,
        textAlign: 'center',
        backgroundColor: '#F4CE14',
        fontSize: 16,
        borderRadius: 8,
        textAlignVertical: 'center',
        fontWeight: 'bold',
        borderWidth: 1,
        borderRadius: 8,
    }
});

