import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Home = () => {
    const handleProfileSettings = () => {
        console.log('Navigate to Profile Settings');
    };

    const handlePreferences = () => {
        console.log('Navigate to Preferences');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Button title="Configurações de Perfil" onPress={handleProfileSettings} />
            <Button title="Preferências" onPress={handlePreferences} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Home;