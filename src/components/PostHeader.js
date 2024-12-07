import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useUserContext} from '../context/AuthProvider';
import {handleFollowUser} from '../controller/miApp.controller';
import { useToggleMode } from '../context/ThemeContext';

const PostHeader = ({
  userAvatar,
  user,
  isFollowing,
  setIsFollowing: parentSetIsFollowing,
  isOwnPost,
  userId,
  onFollowChange,
}) => {
  const {token} = useUserContext();
  const [loading, setLoading] = useState(false);
  const [followState, setFollowState] = useState(isFollowing);
  const { colors } = useToggleMode();

  useEffect(() => {
    if (isFollowing !== undefined) {
      setFollowState(isFollowing);
    }
  }, [isFollowing]);

  const handleFollowPress = async () => {
    if (loading || !userId) return;

    setLoading(true);
    const currentState = followState;

    try {
      const data = await handleFollowUser(userId, token, currentState);

      if (data.status === 200) {
        const newState = !currentState;
        setFollowState(newState);
        if (parentSetIsFollowing) parentSetIsFollowing(newState);
        if (onFollowChange) onFollowChange(newState);
      }
    } catch (error) {
      setFollowState(currentState);
      Alert.alert('Error', 'No se pudo completar la acción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Image
          source={
            typeof userAvatar === 'string'
              ? {uri: userAvatar}
              : require('../assets/imgs/avatarDefault.jpg')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.username,{color:colors.text}]}>{user}</Text>
        </View>
      </View>
      {!isOwnPost && (
        <TouchableOpacity
          style={[
            styles.followButton,
            followState && [styles.followingButton,{backgroundColor:"#1FA1FF"}],
            loading && styles.disabledButton,
          ]}
          onPress={handleFollowPress}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={followState ? '#1DA1F2' : '#ffffff'}
            />
          ) : (
            <Text
              style={[
                styles.followButtonText,
                followState && styles.followingButtonText,{color:""},
                !followState && { color: "#c6c2c2" }
              ]}>
              {followState ? 'Following' : 'Follow'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Roboto',
  },
  followButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  followingButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1DA1F2',
  },
  followButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  followingButtonText: {
    color: '#1DA1F2',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default PostHeader;