import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostDetail from '../screens/PostDetail';
import ProfileScreen from '../screens/ProfileScreen';
import BackIcon from '../assets/imgs/back.svg';
import FullScreen from '../screens/FullScreen';
import { useToggleMode } from '../context/ThemeContext';

const Stack = createStackNavigator();

const HomeStackScreen = () => {
  const { colors } = useToggleMode();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        unmountOnBlur: true,
        detachInactiveScreens: true,
        ...defaultScreenOptions,
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation}) => ({
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen name="FullScreen" component={FullScreen} options={({navigation}) => ({
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        })} />
    </Stack.Navigator>
  );
};

const defaultScreenOptions = {
  headerBackTitleVisible: false,
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  headerTintColor: '#000',
  cardStyle: {
    backgroundColor: '#ffffff',
  },
};

export default HomeStackScreen;
