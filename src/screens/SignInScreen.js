import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import { signInValidationSchema } from '../context/validationSchemas';
import { FormikInputValue } from '../components/FormikInputValue';
import EyeIcon from '../assets/imgs/eyeIcon.svg';
import { useToggleContext } from '../context/AuthProvider';
import { useToggleMode } from '../context/ThemeContext';

const SignInScreen = ({ navigation }) => {
  const {colors } = useToggleMode();
  const { login } = useToggleContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (values) => {
    try {
      await login(values);
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Formik
      validationSchema={signInValidationSchema}
      initialValues={{ email: '', password: '' }}
      onSubmit={handleSignIn}
    >
      {({ handleSubmit }) => (
        <View style={[styles.container,{backgroundColor:colors.background}]}>
          <Image source={require('../assets/imgs/logo.png')} style={styles.logo} />
          <Text style={[styles.title,{color:colors.text}]}>Sign In</Text>
        <View style={[styles.passwordContainer,{color:colors.text}]}>
          <FormikInputValue
            name="email"
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            testID="email"
            />
        </View>

          {/* Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
            <FormikInputValue
              name="password"
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              testID="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButtonContainer}
            >
              <EyeIcon width={24} height={24} />
            </TouchableOpacity>
        </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleSubmit} testID="Login">
            <Text style={styles.signInButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '95%',
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10, // Añadido para dar espacio interno al texto
    color: '#000', // Asegura que el texto sea visible
  },
  eyeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  eyeButton: {
    padding: 5,
  },
  forgotPasswordText: {
    color: '#4285F4',
    marginTop: 10,
  },
  signInButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
