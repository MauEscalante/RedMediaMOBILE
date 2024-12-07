import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import LikeIcon from '../assets/imgs/like.svg';
import FilledLikeIcon from '../assets/imgs/filled_like.svg';
import CommentIcon from '../assets/imgs/comentar.svg';
import FavoritesIcon from '../assets/imgs/Favorites.svg';
import {useUserContext} from '../context/AuthProvider';
import {markPostAsFavorite} from '../controller/miApp.controller';

const PostInteractionBar = ({
  postId,
  isLiked,
  initialIsFavorite = false,
  onLikePress,
  onCommentPress,
  onFavoriteChange,
}) => {
  const {token} = useUserContext();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleFavoritePress = async () => {
    if (!postId || !token || isLoading) {
      return;
    }

    setIsLoading(true);
    const newFavoriteState = !isFavorite;

    try {
      const response = await markPostAsFavorite(postId, token);

      if (response && response.message) {
        setIsFavorite(newFavoriteState);
        if (onFavoriteChange) {
          onFavoriteChange(newFavoriteState);
        }
      }
    } catch (error) {
      setIsFavorite(!newFavoriteState);
      Alert.alert(
        'Error',
        'No se pudo actualizar el estado de favorito. Por favor, intenta de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.interactionBar}>
      <View style={styles.leftIcons}>
        <TouchableOpacity
          onPress={onLikePress}
          style={styles.iconButton}
          activeOpacity={0.7}>
          {isLiked ? (
            <FilledLikeIcon width={24} height={24} fill="#E31B23" />
          ) : (
            <LikeIcon width={24} height={24} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCommentPress}
          style={styles.iconButton}
          activeOpacity={0.7}>
          <CommentIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleFavoritePress}
        style={styles.favoriteButton}
        disabled={isLoading}
        activeOpacity={0.7}>
        <FavoritesIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 10,
  },
  favoriteButton: {
    marginHorizontal: 10,
  },
});

export default PostInteractionBar;
