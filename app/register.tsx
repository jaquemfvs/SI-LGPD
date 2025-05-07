import Checkbox from 'expo-checkbox';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'; // Import Linking

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [newsletterAccepted, setNewsletterAccepted] = useState(false);
  const [offersAccepted, setOffersAccepted] = useState(false);
  const colorScheme = useColorScheme();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (!privacyAccepted) {
      Alert.alert('Erro', 'Você deve aceitar a Política de Privacidade para se cadastrar.');
      return;
    }
    if (!newsletterAccepted) {
      Alert.alert('Erro', 'Você deve concordar em receber a newsletter para se cadastrar.');
      return;
    }
    console.log('Register:', { email, password, newsletterAccepted, offersAccepted });
  };

  const inputStyle = [
    styles.input,
    { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].icon },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Cadastro
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={inputStyle}
        placeholder="Confirmar Senha"
        placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={privacyAccepted}
          onValueChange={setPrivacyAccepted}
          color={privacyAccepted ? '#007BFF' : undefined}
        />
        <View style={styles.checkboxLabelContainer}> 
          <ThemedText style={styles.checkboxLabel}>Li e aceito a </ThemedText>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}> 
            <ThemedText style={[styles.checkboxLabel, styles.linkText]}>Política de Privacidade</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={newsletterAccepted}
          onValueChange={setNewsletterAccepted}
          color={newsletterAccepted ? '#007BFF' : undefined}
        />
        <ThemedText style={styles.checkboxLabel}>Concordo em receber a newsletter.</ThemedText>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          value={offersAccepted}
          onValueChange={setOffersAccepted}
          color={offersAccepted ? '#007BFF' : undefined}
        />
        <ThemedText style={styles.checkboxLabel}>Concordo em receber e-mails com novidades e ofertas.</ThemedText>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <ThemedText type="defaultSemiBold">Cadastrar</ThemedText>
      </TouchableOpacity>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.link}>
          <ThemedText type="link">Already have an account? Log in</ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    width: '80%',
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
    width: '80%',
  },
  link: {
    alignItems: 'center',
  },
  termsButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    width: '80%',
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
