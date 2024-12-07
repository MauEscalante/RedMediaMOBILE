import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  Switch,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import Video from 'react-native-video'; // Importar el componente Video
import {publishPost, getUserData} from '../controller/miApp.controller';
import {useUserContext} from '../context/AuthProvider';
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BackIcon from '../assets/imgs/back.svg';
import BackDarkIcon from '../assets/imgs/backBlue.svg';
import { useToggleMode } from '../context/ThemeContext';

Geocoder.init('AIzaSyAWjptknqVfMwmLDOiN5sBOoP5Rx2sxiSc');

const ImagePickerScreen = ({navigation}) => {

  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Loading current location...');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('');
  const { colors, isDark } = useToggleMode();

  const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
      deleteLocation();

      if (!isEnabled) {
        setSelectedLocation(currentLocation);
      }

  };

  const deleteLocation = () => setSelectedLocation('');

  const {token} = useUserContext();

  const fetchUserData = async () => {
    try {
      const response = await getUserData(token);
      setUserData(response.data);
    } catch (error) {
      }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchUserData();
      }
    }, [token]),
  );

  const openCamera = (isVideo) => {
    const hasPermission = requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Permission to access gallery is required!',
        );
        return;
      }

      if (selectedImages.length >= 10) {
        Alert.alert('Limit Reached', 'You can only add up to 10 items.');
        return;
      }

    launchCamera(
      {
        mediaType: isVideo ? 'video' : 'photo', // Cambia entre foto y video
        videoQuality: 'high', // Opcional: calidad del video
        saveToPhotos: true, // Si deseas guardar en la galería
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else if (response.assets) {
          const newMedia = response.assets.map(asset => ({
            id: asset.uri, // Usar URI como identificador único
            uri: asset.uri,
            type: asset.type, // Guardar el tipo de archivo (foto/video)
          }));
          // Agregar la nueva imagen/video a selectedImages
          setSelectedImages(prev => [...prev, ...newMedia].slice(0, 10));
        }
      },
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') return true; // iOS no requiere estos permisos explícitos

    try {
      // Solicitar permiso para la cámara
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
        },
      );

      // Si usas Android 13 o superior, también puedes necesitar este permiso:
      if (Platform.Version >= 33) {
        const mediaImagesGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Media Permission',
            message: 'This app needs access to your media to select images.',
          },
        );
        return (
          cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
          mediaImagesGranted === PermissionsAndroid.RESULTS.GRANTED
        );
      }

      return cameraGranted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          setLocation('Location permission denied');
          return;
        }

        Geolocation.getCurrentPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            try {
              const response = await Geocoder.from(latitude, longitude);

              // Filtrar los componentes que queremos (locality, administrative_area_level_1, country)
              const addressComponents = response.results[0].address_components;
              let city = '';
              let state = '';
              let country = '';

              // Buscar los componentes de la dirección que nos interesan
              addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                  state = component.long_name;
                }
                if (component.types.includes('country')) {
                  country = component.long_name;
                }
              });

              // Crear la dirección formateada: "City, State, Country"
              const formattedAddress = `${city}, ${state}, ${country}`;
              setLocation(formattedAddress);
              setSelectedLocation(formattedAddress);
              setCurrentLocation(formattedAddress)
            } catch (error) {
              setLocation('Error getting location details');
            }
          },
          error => {
            setLocation('Error getting location');
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } catch (error) {
        setLocation('Error requesting location permission');
      }
    };

    getCurrentLocation();
  }, []);

  const openGallery = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Permission to access gallery is required!',
        );
        return;
      }

      if (selectedImages.length >= 10) {
        Alert.alert('Limit Reached', 'You can only add up to 10 items.');
        return;
      }

      const options = {
        mediaType: 'mixed', // Permitir imágenes y videos
        selectionLimit: 10 - selectedImages.length,
      };

      const result = await launchImageLibrary(options);

      if (!result.didCancel && result.assets) {
        const newMedia = result.assets.map(asset => ({
          id: asset.uri,
          uri: asset.uri,
          type: asset.type, // Guardar el tipo de archivo (photo/video)
        }));
        setSelectedImages(prev => [...prev, ...newMedia].slice(0, 10));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const removeImage = id => {
    setSelectedImages(selectedImages.filter(image => image.id !== id));
  };

  const handlePush = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image or video');
      return;
    }

    if (!userData) {
      Alert.alert('Error', 'User data not available');
      return;
    }

    setLoading(true);

    try {
      // Preparamos el objeto de datos del post
      const postData = {
        title: title.trim(),
        description: description.trim(),
        location: selectedLocation,
        // Aquí, estamos pasando tanto imágenes como videos en el array
        media: selectedImages.map(item => item.uri), // Solo enviamos las URIs de las imágenes y videos
        user: userData.usernickname,
        userAvatar: userData.avatar,
      };

      // Llamamos a la función publishPost pasándole los datos
      const result = await publishPost(postData, token);

      if (result.success) {
        Alert.alert('Success', 'Post published successfully', [
          {
            text: 'OK',
            onPress: () => {
              // Limpiamos los campos después de la publicación exitosa
              setTitle('');
              setDescription('');
              setSelectedImages([]);
              setSelectedLocation('');
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to publish post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const isPublishDisabled =
    !title.trim() || selectedImages.length === 0 || loading;

  return (
    <ScrollView contentContainerStyle={[styles.mainContainer,{backgroundColor:colors.background}]}>
      {loading ? (
        // Pantalla de carga
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={175} color="#007bff" />
          <Text style={styles.loadingText}>Publishing your post.....</Text>
        </View>
      ) : (
      <ScrollView contentContainerStyle={[styles.container,{backgroundColor:colors.background}]}>
      <View style={[styles.header,{color:colors.background}]}>
        <View style={styles.goBack}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackDarkIcon/>
          </TouchableOpacity>
        </View>
        <Text></Text>
      </View>
      <View style={styles.containerPublish}>
      <TouchableOpacity onPress={handlePush} style={styles.buttonPublish} disabled={isPublishDisabled}>
          <Text
            style={[
              styles.publishText,
              isPublishDisabled && styles.publishTextDisabled,
            ]}>
            Publish
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              userData?.avatar ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
          }}
          style={styles.profileImage}
        />
        <Text  style={[styles.username,{color:colors.text}]}>
          @{userData?.usernickname || 'Loading...'}
        </Text>
      </View>

      {selectedImages.length >= 10 ? <Text style={styles.maximum}>Maximum items selected!</Text>
            : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={openGallery}
              style={[
                styles.selectButton,
                selectedImages.length >= 10 && styles.selectButtonDisabled,
              ]}
              disabled={selectedImages.length >= 10}>
                <MaterialIcons name="photo-library" size={24} color="white" />
              <Text style={styles.selectButtonText}>
                {selectedImages.length >= 10
                  ? 'Maximum items selected'
                  : 'Open Gallery'}
              </Text>
            </TouchableOpacity>

            {/* Botón para tomar foto */}
            <TouchableOpacity
              onPress={() => openCamera(false)}
              style={[
                styles.selectButton,
                selectedImages.length >= 10 && styles.selectButtonDisabled,
              ]}
              disabled={selectedImages.length >= 10}>
              <MaterialIcons name="photo-camera" size={24} color="white" />
              <Text style={styles.selectButtonText}>
                {selectedImages.length >= 10
                  ? 'Maximum items selected'
                  : 'Take Photo'}
              </Text>
            </TouchableOpacity>

            {/* Botón para grabar video */}
            <TouchableOpacity
              onPress={() => openCamera(true)}
              style={[
                styles.selectButton,
                selectedImages.length >= 10 && styles.selectButtonDisabled,
              ]}
              disabled={selectedImages.length >= 10}>
              {selectedImages.length >= 10 ? null
                : (<MaterialIcons name="videocam" size={24} color="white" />)
              }
              <Text style={styles.selectButtonText}>
                {selectedImages.length >= 10
                  ? 'Maximum items selected'
                  : 'Take Video'}
              </Text>
            </TouchableOpacity>
          </View>
              )
            }

      {selectedImages.length > 0 && (
        <FlatList
          data={selectedImages}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({item}) => (
            <View style={styles.imageContainer}>
              {item.type.startsWith('video') ? (
                <Video
                  source={{uri: item.uri}}
                  style={styles.selectedImage}
                  controls // Controles para reproducir video
                  resizeMode="cover"
                />
              ) : (
                <Image source={{uri: item.uri}} style={styles.selectedImage} />
              )}
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(item.id)}>
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={[styles.textTitles,{color:colors.text}]}>Title</Text>
        <TextInput
          style={[styles.input,{color:colors.text}]}
          placeholder="Write something..."
           placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          maxLength={60}
          editable={!loading}
        />
        <Text style={styles.characterCount}>{60 - title.length}</Text>

        <Text style={[styles.textTitles,{color:colors.text}]}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput,{color:colors.text}] }
          placeholder="Write something..."
           placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          maxLength={300}
          multiline
          editable={!loading}
        />
        <Text style={styles.characterCount}>{300 - description.length}</Text>

        <Text style={[styles.textTitles,{color:colors.text}]}>Location</Text>
        <View style={styles.switchContainer}>
          <Text style={{color:colors.text}}>Use Actual Location</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              toggleSwitch();
            }}
            value={isEnabled}
          />
        </View>
        {isEnabled ? (
          <Text style={[styles.locationText,{color:"#999"}]}>{location}</Text>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#999"
            onChangeText={setSelectedLocation}
            editable={!loading}
          />
        )}
      </View>
      </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:16,
    flexGrow: 1,
  },
  mainContainer: {
    flexGrow: 1,
  },
  header: {
     flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: "space-between",
    height: 45,
  },
  goBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  containerPublish: {
    height:20,
    alignItems:"flex-end",
  },
  publishText: {
    color: '#FFF',
    fontSize: 16,
    textAlign:"center",
  },
  buttonPublish: {
    color: '#007AFF',
    fontSize: 16,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    alignItems:"center",
    justifyContent: 'center',
    height: 35,
    width: 100,
    marginTop: 30,
  },
  publishTextDisabled: {
    color: '#999',
  },
  textTitles: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: 125,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  selectButtonDisabled: {
    backgroundColor: '#999',
  },
  selectButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  flatListContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    color: '#999',
    marginBottom: 15,
    fontSize: 12,
  },
  locationPicker: {
    width: '100%',
    height: 40,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  maximum: {
    color: 'white',
    fontSize: 20,
    margin: 20,
    alignContent: "center",
    textAlign: "center",
    backgroundColor: '#007AFF',
  },
  loadingContainer: {
    fontSize: 20,
    textAlign: "center",
    height: 777,
    width:375,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 25,
    margin: 20,
    alignContent: "center",
    textAlign: "center",
    backgroundColor: '#007AFF',
  },
});

export default ImagePickerScreen;
