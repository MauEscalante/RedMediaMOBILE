import React, { useState, useEffect, useContext } from 'react';
import { signIn as signInAPI } from '../controller/miApp.controller';
import { Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { googleAutenticacion } from '../controller/miApp.controller';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const AuthContext = React.createContext();
const toggleContext = React.createContext();

export function useUserContext() {
  return useContext(AuthContext);
}

export function useToggleContext() {
  return useContext(toggleContext);
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener token
        const tokenCredentials = await Keychain.getGenericPassword({ service: 'token' });
        const token = tokenCredentials ? tokenCredentials.password : null;

        // Obtener datos del usuario
        const userCredentials = await Keychain.getGenericPassword({ service: 'user' });
        const userString = userCredentials ? userCredentials.password : null;

        if (token && userString) {
          const user = JSON.parse(userString);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 

  const login = async (userData) => {
    try {
      const response = await signInAPI(userData);
      if (response.token) {
        const user = response.user || { email: userData.email };
        const userString = JSON.stringify(user);

        // Guardar token
        await Keychain.setGenericPassword('username', String(response.token), { service: 'token' });
        // Guardar datos del usuario
        await Keychain.setGenericPassword('username', userString, { service: 'user' });

        setAuthState({
          user,
          token: response.token,
          isAuthenticated: true,
        });
      } else {
        Alert.alert('Error',response.message || 'Inicio de sesión fallido. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const signOut = async () => {
    try {
      // Eliminar token y datos del usuario
      await Keychain.resetGenericPassword({ service: 'token' });
      await Keychain.resetGenericPassword({ service: 'user' });

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      }
  };

  return (
    <AuthContext.Provider value={{ ...authState, loading }}>
      <toggleContext.Provider value={{ login, signOut   }}>
        {children}
      </toggleContext.Provider>
    </AuthContext.Provider>
  );
};