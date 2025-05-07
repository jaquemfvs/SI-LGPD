import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();

  const handleLogin = () => {
    console.log('Login:', { email, password });
  };

  const inputStyle = [
    styles.input,
    { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].icon }, // Use theme colors
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>
      <TextInput
        style={inputStyle}
        placeholder="Email"
        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={inputStyle}
        placeholder="Password"
        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText type="defaultSemiBold">Login</ThemedText>
      </TouchableOpacity>
      {/* Replace TouchableOpacity with Link */}
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.link}>
          <ThemedText type="link">Don't have an account? Sign Up</ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  link: {
    alignItems: 'center',
  },
});
