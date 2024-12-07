import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import { signUpValidationSchema } from '../context/validationSchemas';
import { FormikInputValue } from '../components/FormikInputValue';
import EyeIcon from '../assets/imgs/eyeIcon.svg';
import { Picker } from '@react-native-picker/picker';
import { signUp } from '../controller/miApp.controller';
import { useToggleMode } from '../context/ThemeContext';

const SignUpScreen = () => {
  const { colors } = useToggleMode();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async (values) => {
    try {
      const response = await signUp(values);
      if (response.message) {
        Alert.alert('Registration Successful', response.message, [{ text: 'OK' }]);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'There was a problem with the registration. Try again.');
    }
  };

  return (
    <Formik
      validationSchema={signUpValidationSchema}
      initialValues={{
        name: '',
        lastName: '',
        nick: '',
        email: '',
        password: '',
        gender: 'Not specified',
      }}
      onSubmit={handleSignUp}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <View style={[styles.container,{backgroundColor:colors.background}]}>
          {/* Logo */}
          <Image source={require('../assets/imgs/logo.png')} style={styles.logo} testID="logo" />

          {/* Title */}
          <Text style={styles.title}>Create Your Account</Text>

          {/* Name */}
          <FormikInputValue
            name="name"
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
            width="95%"
            testID="name"
          />

          {/* Last Name */}
          <FormikInputValue
            name="lastName"
            placeholder="Enter your last name"
            placeholderTextColor="#aaa"
            testID="lastName"
            width="95%"
          />

          {/* Nickname */}
          <FormikInputValue
            name="nick"
            placeholder="Enter your nickname"
            placeholderTextColor="#aaa"
            testID="nick"
            width="95%"
          />

          {/* Email */}
          <FormikInputValue
            name="email"
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            testID="email"
            width="95%"
          />

          {/* Password */}
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

          {/* Gender Dropdown */}
          <View style={styles.pickerContainer}>
            <Text style={[styles.pickerLabel,{color:colors.background}]}>Gender</Text>
            <Picker
              selectedValue={values.gender}
              onValueChange={(itemValue) => setFieldValue('gender', itemValue)}
              testID="gender"
            >
              <Picker.Item label="Not specified" value="Not specified" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit} testID="submit">
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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
  eyeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginBottom: 30,
  },
  pickerContainer: {
    width: '95%',
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  signUpButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
