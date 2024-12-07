// SearchScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../assets/imgs/back.svg'; // Icono personalizado de retroceso
import BackDarkIcon from '../assets/imgs/backBlue.svg';
import SearchIcon from '../assets/imgs/search.svg'; // Icono de búsqueda personalizado
import { searchUsers } from '../controller/miApp.controller'; // Importa el método searchUsers
import { useUserContext } from '../context/AuthProvider'; // Asumiendo que usas un contexto para la autenticación
import { useToggleMode } from '../context/ThemeContext';

const DEFAULT_AVATAR = 'https://res.cloudinary.com/docrp6wwd/image/upload/v1731610184/default-avatar.jpg'; // URL de imagen predeterminada

const SearchScreen = () => {
  const navigation = useNavigation();
  const { token } = useUserContext(); // Obtén el token desde el contexto de autenticación
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { colors, isDark } = useToggleMode();

  // Función para buscar usuarios desde el backend
  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.trim().length === 0) {
      setFilteredUsers([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const users = await searchUsers(text, token); // Llama al método searchUsers con el query y el token
      setFilteredUsers(users);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al buscar usuarios');
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Renderiza cada usuario encontrado
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        navigation.navigate('UserProfile', { username: item.usernickname })
      }
    >
      <Image
        source={{ uri: item.avatar || DEFAULT_AVATAR }}
        style={styles.avatar}
        defaultSource={{ uri: DEFAULT_AVATAR }} // Para manejar carga inicial en iOS
      />
      <View style={styles.userInfo}>
        <Text style={[styles.name,{color:colors.text}]}>{item.nombre}</Text>
        <Text style={styles.username}>@{item.usernickname}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea,{backgroundColor: colors.background}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header con botón de retroceso */}
      <View style={[styles.header,{backgroundColor: colors.background}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton,{color:colors.text}]}>
        <BackDarkIcon/>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar,{backgroundColor:colors.post}]}>
          <SearchIcon width={20} height={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput,{color:colors.text}]}
            placeholder="Search users..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Indicador de carga */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1DA1F2" />
        </View>
      )}

      {/* Mensaje de error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista de usuarios filtrados */}
      {searchText.length > 0 && !loading && (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No users found</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    height: 45,
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '90%',
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc', // Color de fondo mientras se carga la imagen
  },
  userInfo: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  username: {
    fontSize: 14,
    color: 'gray',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default SearchScreen;
