import React from 'react';
import { View, Text, Image, Video } from 'react-native';
import { Video as ReactNativeVideo } from 'react-native-video';

const FullScreen = ({ route }) => {
  const { mediaUrl, type } = route.params; // Obtiene los parámetros

  return (
    <View style={{ flex: 1 }}>
      {type === 'image' ? (
        <Image source={{ uri: mediaUrl }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <ReactNativeVideo source={{ uri: mediaUrl }} style={{ width: '100%', height: '100%' }} controls />
      )}
    </View>
  );
};

export default FullScreen;
