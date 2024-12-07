import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {updateUserProfile} from '../controller/miApp.controller';
import {useUserContext} from '../context/AuthProvider';
import { useToggleMode } from '../context/ThemeContext';
import FavoritesIcon from '../assets/imgs/Favorites.svg';

const {width: windowWidth} = Dimensions.get('window');

const MyProfileHeader = ({
  userData,
  userPostsCount,
  followersCount = 0,
  followingCount = 0,
  onFollowersPress,
  onFollowingPress,
  onRefresh,
}) => {
  const navigation = useNavigation();
  const {token} = useUserContext();
  const [loading, setLoading] = useState(false);
  const { colors } = useToggleMode()

  const handleEditPress = () => {
    navigation.navigate('EditProfile', {avatar: userData?.avatar});
  };

  const formatNumber = num => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'ios') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message:
            'This app needs access to your gallery to update your cover image.',
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

  const handleUpdateCover = async () => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        Alert.alert('Error', 'Permission to access gallery is required.');
        return;
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      });

      if (!result.didCancel && result.assets?.[0]) {
        setLoading(true);
        try {
          const coverImageData = {
            coverImage: result.assets[0].uri,
          };

          const response = await updateUserProfile(coverImageData, token);

          if (response.data?.coverImage) {
            Alert.alert('Success', 'Cover image updated successfully');
            if (onRefresh) {
              await onRefresh();
            }
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to update cover image');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Error selecting image');
      }
  };

  const handleViewFavorites = () => {
    navigation.navigate('FavoriteScreen');
  };
  return (
    <View style={[styles.container,{backgroundColor: colors.background}]}>
      <TouchableOpacity
        onPress={handleUpdateCover}
        style={styles.coverContainer}
        disabled={loading}>
        <Image
          source={
            userData?.coverImage
              ? {uri: userData.coverImage}
              : require('../assets/imgs/portadaDefault.png')
          }
          style={styles.coverImage}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <View style={styles.changeCoverButton}>
            <Text style={styles.changeCoverText}>Change Cover</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <Image
          source={
            userData?.avatar
              ? {uri: userData.avatar}
              : require('../assets/imgs/avatarDefault.jpg')
          }
          style={styles.avatar}
        />
      </View>

      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditPress}
          disabled={loading}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.userInfo}>
          <Text style={[styles.name,{color:colors.text}]}>
            {userData?.nombre} {userData?.apellido}
          </Text>
          <Text style={styles.username}>@{userData?.usernickname}</Text>
          <Text style={[styles.bio,{color:colors.text}]}>
            {userData?.bio ? userData.bio : 'No bio yet'}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
             <Text style={[styles.statNumber,{color:colors.text}]}>
              {formatNumber(userPostsCount)}
            </Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <TouchableOpacity style={styles.statItem} onPress={onFollowersPress}>
             <Text style={[styles.statNumber,{color:colors.text}]}>
              {formatNumber(followersCount)}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={onFollowingPress}>
             <Text style={[styles.statNumber,{color:colors.text}]}>
              {formatNumber(followingCount)}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.levelContainer}>
        <Text style={[styles.level,{color:colors.text}]}>Level: {userData?.level || 0}</Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleViewFavorites}>
        <FavoritesIcon width={30} height={30} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    width: windowWidth,
    height: 150,
    resizeMode: 'cover',
  },
  changeCoverButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  changeCoverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  avatarContainer: {
    position: 'absolute',
    top: 100,
    left: 15,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButtonContainer: {
    position: 'absolute',
    top: 160,
    right: 15,
  },
  editButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    width: 100,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  mainContent: {
    marginTop: 40,
    paddingHorizontal: 15,
  },
  userInfo: {
    flex: 1,
    marginBottom: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Roboto',
  },
  username: {
    fontSize: 14,
    color: '#657786',
    marginTop: 1,
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  bio: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -70,
    marginRight: 10,
    paddingBottom: 10,
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 15,
    paddingHorizontal: 5,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 1,
    fontFamily: 'Roboto',
  },
  statLabel: {
    color: '#657786',
    fontSize: 11,
    fontFamily: 'Roboto',
  },
  levelContainer: {
    paddingHorizontal: 15,
    marginTop: 8,
    marginBottom: 10,
  },
  level: {
    fontSize: 14,
    color: '#14171A',
    fontFamily: 'Roboto',
    marginTop: 15,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
  },
});

export default MyProfileHeader;
