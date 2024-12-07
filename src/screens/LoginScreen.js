import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useToggleMode } from '../context/ThemeContext';

const LoginScreen = ({navigation}) => {
  const {colors} = useToggleMode();

  const handleEmailSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <Image 

        source={require('../assets/imgs/logo.png')} // Asegúrate de tener la imagen del logo en tu carpeta assets

        style={styles.logo}
      />
      <Text style={[styles.title,{color:colors.text}]}>REDMEDIA</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleSignInPress}>
        <View style={styles.googleButtonContent}>
          
          <Text style={styles.googleButtonText}>Sign in with RedMedia</Text>
        </View>
      </TouchableOpacity>

      
      
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={[styles.orText,{color:colors.text}]}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.emailButton} onPress={handleEmailSignUp}>
        <Text style={[styles.emailButtonText,{color:colors.text}]}>Sign up with Email</Text>
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 240,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 15,
    fontSize: 14,
    color: '#333',
  },
  signInLink: {
    fontWeight: 'bold',
    color: '#4285F4',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: '#ccc',
  },
  emailButton: {
    marginTop: 10,
  },
  emailButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default LoginScreen;