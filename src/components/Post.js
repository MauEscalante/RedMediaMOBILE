import React, {memo, useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {usePost} from '../context/PostContext';
import Video from 'react-native-video';
import { useToggleMode } from '../context/ThemeContext';

const Post = ({item, source}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {updatePost} = usePost();
  const { colors } = useToggleMode();

  const hasVideo = item.videos && item.videos.length > 0;
  const hasImage = item.image && item.image.length > 0;

  const navigateToDetail = useCallback(() => {
    const params = {
      item: {...item},
      previousScreen: source || route.name,
      fromScreen: source || route.name,
      username: item.user,
    };
    navigation.navigate('PostDetail', params);
  }, [navigation, route.name, item, source]);

  return (
    <TouchableOpacity 
      onPress={navigateToDetail} 
      style={[styles.container,{backgroundColor: colors.background}]}
      key={`post-${item._id}-${item.user}`}
    >
      <View style={styles.mediaContainer}>
        {hasVideo ? (
          <>
            <Video
              source={{uri: item.videos[0]}}
              style={styles.videoThumbnail}
              paused={true}
              muted={true}
              resizeMode="cover"
              poster={item.image?.[0]}
              posterResizeMode="cover"
              playWhenInactive={false}
              ignoreSilentSwitch="ignore"
              bufferConfig={{
                minBufferMs: 0,
                maxBufferMs: 0,
                bufferForPlaybackMs: 0,
                bufferForPlaybackAfterRebufferMs: 0
              }}
            />
            <View style={styles.videoOverlay} />
            <View style={styles.playIconContainer}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </>
        ) : hasImage ? (
          <Image 
            source={{uri: item.image[0]}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No media available</Text>
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title,{color:colors.text}]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.username}>@{item.user}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: 24,
  },
  textContainer: {
    paddingTop: 6,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  username: {
    fontSize: 12,
    color: '#657786',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default memo(Post);