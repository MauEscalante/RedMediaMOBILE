import React, { useState } from 'react';
import { FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PostMedia = ({ media }) => {
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleSelectItem = (item) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item) ? prevSelected.filter((i) => i !== item) : [...prevSelected, item]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FullScreen', { mediaUrl: item.url, type: item.type })}
        onLongPress={() => toggleSelectItem(item)}
        style={[styles.mediaContainer, isSelected && styles.selected]}
      >
        {item.type === 'image' ? (
          <Image source={{ uri: item.url }} style={styles.media} resizeMode="cover" />
        ) : item.type === 'video' ? (
          <Video source={{ uri: item.url }} style={styles.media} resizeMode="cover" controls />
        ) : null}
      </TouchableOpacity>
    );
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  if (Array.isArray(media) && media.length > 0) {
    return (
      <View style={styles.container}>
        <FlatList
          data={media}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          style={styles.carousel}
        />
        {media.length > 1 && (
          <View style={styles.pagination}>
            {media.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  }

  return <Text style={styles.noContentText}>No hay contenido multimedia</Text>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    width: width - 30,
    height: 354,
    borderRadius: 12,
    marginHorizontal: 15,
  },
  mediaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: 'blue',
    borderRadius: 12,
  },
  carousel: {
    marginTop: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'black',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  noContentText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#777',
    fontSize: 16,
  },
});

export default PostMedia;
