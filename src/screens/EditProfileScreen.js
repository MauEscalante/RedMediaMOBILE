import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserContext, useToggleContext } from '../context/AuthProvider';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { updateUserProfile, getUserData, deleteUserAccount } from '../controller/miApp.controller';
import { useToggleMode } from '../context/ThemeContext';

const EditProfileScreen = ({ navigation, route }) => {
  const { avatar } = route.params;
  const { token } = useUserContext();
  const { signOut } = useToggleContext();
  const { toggleTheme, isDark,colors } = useToggleMode();

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('Not specified');
  const [profileImage, setProfileImage] = useState(avatar);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [token]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUserData(token);

      setNickname(userData.data.usernickname || '');
      setName(userData.data.nombre || '');
      setDescription(userData.data.bio || '');
      setProfileImage(userData.data.avatar || avatar);
      
      const backendGender = userData.data.genero;
      if (backendGender) {
        setGender(backendGender);
      }
    } catch (error) {
      showMessage('Error loading user data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, logout', onPress: () => signOut() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, delete',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteUserAccount(token);
              Alert.alert('Account Deleted', 'Your account has been deleted.');
              signOut();
            } catch (error) {
              showMessage('Error deleting account: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const updateData = {
        nombre: name,
        bio: description,
        genero: gender,
      };

      const result = await updateUserProfile(updateData, token);
      
      if (result?.data?.genero) {
        setGender(result.data.genero);
      }
      showMessage('Profile updated successfully');
      
      // Refresh user data after update
      await loadUserData();
    } catch (error) {
      showMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (imageUri) => {
    try {
      setLoading(true);

      if (!imageUri) {
        throw new Error('No image URI provided');
      }

      const result = await updateUserProfile(
        {
          avatar: imageUri,
        },
        token
      );

      if (result?.data?.avatar) {
        setProfileImage(result.data.avatar);
        showMessage('Profile picture updated successfully');
      } else {
        throw new Error('No avatar URL in response');
      }
    } catch (error) {
      showMessage('Error updating profile picture: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      const result = await launchImageLibrary(options);

      if (!result.didCancel && result.assets && result.assets[0]) {
        await handleImageUpdate(result.assets[0].uri);
      }
    } catch (error) {
      showMessage('Error selecting image: ' + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      const result = await launchCamera(options);

      if (!result.didCancel && result.assets && result.assets[0]) {
        await handleImageUpdate(result.assets[0].uri);
      }
    } catch (error) {
      showMessage('Error taking photo: ' + error.message);
    }
  };
  const handleChangeTheme =   () =>   toggleTheme

  return (
    <SafeAreaView style={[styles.safeArea,{backgroundColor:colors.background}]}>
      <ScrollView style={[styles.container,{backgroundColor:colors.background}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={[styles.closeButtonText,{color:colors.text}]}>×</Text>
        </TouchableOpacity>

        <Text style={[styles.title,{color:colors.text}]}>My Account</Text>

        <View style={styles.profileImageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../assets/imgs/avatarDefault.jpg')
            }
            style={styles.profileImage}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={pickImage} disabled={loading}>
            <Text style={[styles.changePhotoText, loading && styles.disabledText]}>
              Change photo from gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} disabled={loading}>
            <Text style={[styles.changePhotoText, loading && styles.disabledText]}>
              Take a photo
            </Text>
          </TouchableOpacity>
        </View>

        {message ? (
          <Text style={[styles.message, message.includes('Error') && styles.errorMessage]}>
            {message}
          </Text>
        ) : null}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>PROFILE</Text>
          <TextInput
            placeholder="Nickname"
            value={nickname}
            style={[styles.input,{color:colors.text}]}
            editable={false}
          />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={[styles.input,{color:colors.text}]}
            editable={!loading}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input,{color:colors.text}]}
            multiline
            editable={!loading}
          />
          <View style={styles.pickerContainer}>
            <Text style={[styles.label,{color:colors.text}]}>Gender:</Text>
            <Picker
              selectedValue={gender}
              style={[styles.picker,{color:colors.text}] }
              onValueChange={(itemValue) => {
                setGender(itemValue);
              }}
              enabled={!loading}
            >
              <Picker.Item label="Male" value="Masculino" />
              <Picker.Item label="Female" value="Femenino" />
              <Picker.Item label="Prefer not to say" value="Not specified" />
            </Picker>
          </View>
        </View>

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.appearanceRow}>
            <Text style={[styles.appearanceLabel,{color:colors.text}]}>Dark mode:</Text>
            <View style={styles.switchContainer}>
              <Switch
                value={isDark}
                onValueChange={handleChangeTheme()}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Text style={[styles.deleteText, loading && styles.disabledText]}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={[styles.logoutText, loading && styles.disabledText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 15,
    marginTop: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  profileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: 16,
    marginVertical: 5,
    padding: 5,
  },
  disabledText: {
    opacity: 0.5,
  },
  message: {
    textAlign: 'center',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    color: '#4CAF50',
    borderRadius: 5,
  },
  errorMessage: {
    color: '#FF3B30',
  },
  formSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingsSection: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 50,
  },
  logoutButton: {
    padding: 15,
    marginTop: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1FA1FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditProfileScreen;