import React from 'react';
import { FlatList, Image, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const PostImage = ({ images }) => {
  const renderImage = ({ item }) => {
    return <Image source={{ uri: item }} style={styles.image} />;
  };

  if (Array.isArray(images)) {
    return (
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(image, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
      />
    );
  } else {
    return images ? <Image source={{ uri: images }} style={styles.image} /> : null;
  }
};

const styles = StyleSheet.create({
  image: {
    width: width - 40,
    height: 354,
    borderRadius: 44,
    marginHorizontal: 15,
  },
  imageCarousel: {
    marginTop: 10,
  },
});

export default PostImage;