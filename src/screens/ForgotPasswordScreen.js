import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { sendPasswordResetEmail } from '../controller/miApp.controller';
import { useToggleMode } from '../context/ThemeContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { colors } = useToggleMode();
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInstructions = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('E-mail invalid', 'Please enter a valid address e-mail.');
      return;
    }

    try {
      const response = await sendPasswordResetEmail(email);

      Alert.alert('Password reset', 'Instructions for your password recovery have been sent',[{text: "OK", onPress: () => navigation.navigate("SignIn")}]);
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <Text style={[styles.title,{color:colors.detailes}]}>Forgot your password?</Text>
      <Text style={[styles.subtitle,{color:colors.detailes}]}>Don't worry, we will send you instructions</Text>
      <Text style={[styles.instructionText,{color:colors.text}]}>
          Please enter your email address. You will receive a link to create a new password via email.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSendInstructions}>
        <Text style={styles.sendButtonText}>Send Instructions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
  },
  sendButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;