import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function Footer() {
    return (
        <View style={styles.container}>
            <Pressable >
                <Text style={styles.button}>Next</Text>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 0.4,
        backgroundColor: '#d9d9d5ff',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    button: {
        width: 128,
        height: 48,
        backgroundColor: '#858582ff',
        fontSize: 32,
        color: 'black',
        textAlign: 'center',
        margin: 64,
    }

});
