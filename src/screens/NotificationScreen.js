import React,{useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Notification from '../components/Notification'; 
import BackIcon from '../assets/imgs/back.svg'; // Icono personalizado de regreso.
import BackDarkIcon from '../assets/imgs/backBlue.svg'
import { useNavigation } from '@react-navigation/native'; // React Navigation para CLI.
import { getNotifications } from '../controller/miApp.controller'; //NOTIFICACIONES
//context
import { useUserContext } from '../context/AuthProvider';
import { useToggleMode } from '../context/ThemeContext';

const NotificationScreen = () => {
  const {isDark,colors} = useToggleMode();
  const navigation = useNavigation(); // Hook de navegación.
  const [notificaciones, setNotificaciones] = React.useState([]); // Estado local para las notificaciones.
  const {token}=useUserContext()

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await getNotifications(token); // Llama a la función de notificaciones.
      setNotificaciones(notifications); // Actualiza el estado local con las notificaciones.
    }
    fetchNotifications(); 
    
  }, []);

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <View style={[styles.headerContainer,{backgroundColor:colors.background}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Volver a la pantalla anterior.
          style={styles.icon}
        >
          <BackDarkIcon/>
        </TouchableOpacity>
        <Text style={[styles.title,{color:colors.text}]}>Activity</Text>
      </View>
      <FlatList
        data={notificaciones} // Asegúrate de que este arreglo esté bien estructurado.
        renderItem={({ item }) => <Notification item={item} />}
        keyExtractor={(item) => item._id.toString()} // Convierte el ID a string si no lo es.
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    height: 45,
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 22, // Reducido para evitar desbordes
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default NotificationScreen;