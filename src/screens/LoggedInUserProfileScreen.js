import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import MyProfileHeader from '../components/MyProfileHeader';
import Post from '../components/Post';
import {
  getUserPosts,
  getUserData,
  getUsers,
} from '../controller/miApp.controller';
import {useUserContext} from '../context/AuthProvider';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { useToggleMode } from '../context/ThemeContext';

const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 30) / 2;

const LoggedInUserProfileScreen = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const {token} = useUserContext();
  const navigation = useNavigation();
  const { colors } = useToggleMode();

  const fetchUserData = useCallback(async () => {
    try {
      const [userDataResponse, usersResponse] = await Promise.all([
        getUserData(token),
        getUsers(token),
      ]);

      const currentUser = usersResponse.data.find(
        u => u.usernickname === userDataResponse.data.usernickname,
      );

      if (currentUser) {
        setUserData({
          ...currentUser,
          level: userDataResponse.data.level, // Nivel calculado desde el backend
        });

        if (currentUser.followers?.length > 0) {
          const followers = currentUser.followers
            .map(followerId =>
              usersResponse.data.find(u => u._id === followerId),
            )
            .filter(Boolean);
          setFollowersData(followers);
        }

        if (currentUser.following?.length > 0) {
          const following = currentUser.following
            .map(followingId =>
              usersResponse.data.find(u => u._id === followingId),
            )
            .filter(Boolean);
          setFollowingData(following);
        }
      } else {
        setUserData(userDataResponse.data);
      }
    } catch (error) {
      }
  }, [token]);

  const fetchUserPosts = useCallback(async () => {
    // Verifica si el token es válido antes de realizar la solicitud
    if (!token) {
      setUserPosts([]); // Asigna un array vacío si no hay token
      return; // Si no hay token, no hacer la solicitud
    }

    try {
      const data = await getUserPosts(token); // Llama al nuevo endpoint
      if (data.data && data.data.length > 0) {
        setUserPosts(data.data); // Almacena directamente los posts
      } else {
        setUserPosts([]); // Si no hay posts, asigna un array vacío
      }
    } catch (error) {
      setUserPosts([]); // Si ocurre un error (por ejemplo 404), asigna un array vacío
    }
  }, [token]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUserData(), fetchUserPosts()]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchUserData, fetchUserPosts]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        setLoading(true);
        fetchUserData()
          .then(() => fetchUserPosts())
          .finally(() => setLoading(false));
      }
    }, [token, fetchUserData, fetchUserPosts]),
  );

  useEffect(() => {
    if (userData) {
      fetchUserPosts();
    }
  }, [userData, fetchUserPosts]);

  const renderPost = useCallback(
    ({item}) => (
      <View style={styles.postContainer}>
        <Post item={item} source="Profile" />
      </View>
    ),
    [],
  );

  const renderEmptyListMessage = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyMessage}>
        You don’t have any posts yet. Feel free to create one!
      </Text>
    </View>
  );

  const UserListModal = ({visible, onClose, users, title}) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.usersList}>
            {users.map(user => (
              <TouchableOpacity
                key={user._id}
                style={styles.userItem}
                onPress={() => {
                  onClose();
                  navigation.navigate('Profile', {
                    username: user.usernickname,
                    fromScreen: 'Profile',
                  });
                }}>
                <Image
                  source={{
                    uri: user.avatar || 'https://via.placeholder.com/40',
                  }}
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {user.nombre} {user.apellido}
                  </Text>
                  <Text style={styles.userUsername}>@{user.usernickname}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = useCallback(() => {
    return (
      <MyProfileHeader
        userData={userData}
        userPostsCount={userPosts.length}
        followersCount={followersData.length}
        followingCount={followingData.length}
        onFollowersPress={() => setShowFollowers(true)}
        onFollowingPress={() => setShowFollowing(true)}
        onRefresh={handleRefresh}
      />
    );
  }, [
    userData,
    userPosts.length,
    followersData.length,
    followingData.length,
    handleRefresh,
  ]);

  if (loading) {
    return (
      <View style={[styles.loaderContainer,{backgroundColor:colors.post}]}>
        <ActivityIndicator size="large" color="#1FA1FF" />
      </View>
    );
  }

  return (
    <View style={[styles.container,{backgroundColor: colors.background}]}>
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyListMessage} // Muestra el mensaje cuando no hay posts
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1FA1FF"
            colors={['#1FA1FF']}
          />
        }
      />
      <UserListModal
        visible={showFollowers}
        onClose={() => setShowFollowers(false)}
        users={followersData}
        title="Seguidores"
      />
      <UserListModal
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
        users={followingData}
        title="Siguiendo"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  postContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  closeButton: {
    fontSize: 24,
    color: '#657786',
    padding: 5,
  },
  usersList: {
    padding: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  userUsername: {
    fontSize: 14,
    color: '#657786',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default LoggedInUserProfileScreen;
