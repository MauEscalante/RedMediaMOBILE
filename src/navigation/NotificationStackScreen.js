import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import PostDetail from '../screens/PostDetail';
import { useToggleMode } from '../context/ThemeContext';

const Stack = createStackNavigator();

const NotificationStackScreen = () => {
  const { colors } = useToggleMode();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Activity"
        component={NotificationScreen}
        options={{headerShown:false}}
      />
      <Stack.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        }}
      />
    </Stack.Navigator>
  );
};

export default NotificationStackScreen;
