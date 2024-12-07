import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BackIcon from '../assets/imgs/back.svg'; // Importa tu icono de retroceso
import { useToggleMode } from '../context/ThemeContext';

const Stack = createStackNavigator();

const SearchStackScreen = () => {
  const { colors } = useToggleMode(); 
  return (
    <Stack.Navigator>
      {/* Cambiamos el nombre a "SearchHome" para evitar conflictos */}
      <Stack.Screen 
        name="SearchHome" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        })}
      />
    </Stack.Navigator>
  );
};

export default SearchStackScreen;