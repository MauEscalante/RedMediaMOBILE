// LoggedInProfileStackScreen.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoggedInUserProfileScreen from "../screens/LoggedInUserProfileScreen";
import PostDetailScreen from "../screens/PostDetail"; // Pantalla de detalle de cada post
import EditProfileScreen from "../screens/EditProfileScreen"; // Nueva pantalla de edición de perfil
import FavoriteScreen from "../screens/FavoriteScreen"; // Agregada pantalla de favoritos
import { useToggleMode } from "../context/ThemeContext";

const Stack = createStackNavigator();

const LoggedInProfileStackScreen = () => {
  const { colors } = useToggleMode();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoggedInUserProfile"
        component={LoggedInUserProfileScreen}
        options={{ headerShown: false }} // Oculta el encabezado para la pantalla de perfil
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: {
            backgroundColor: colors.background, 
          },
          headerTintColor: colors.text,
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      {/* Nueva pantalla de Favoritos */}
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
};

export default LoggedInProfileStackScreen;