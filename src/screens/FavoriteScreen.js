import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useNavigation, useScrollToTop} from '@react-navigation/native';
import {useUserContext} from '../context/AuthProvider';
import {usePost} from '../context/PostContext';
import {getFavoritePosts} from '../controller/miApp.controller';
import Skeleton from '../components/Skeleton';
import Post from '../components/Post';

const FavoriteScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const {token} = useUserContext();
  const navigation = useNavigation();
  const postContext = usePost();

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const updatePost = useCallback(updatedPost => {
    if (!updatedPost?._id) return;
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    );
  }, []);

  useEffect(() => {
    postContext.updatePost = updatePost;
  }, [updatePost, postContext]);

  // Efecto para actualizar posts cuando cambian en el contexto
  useEffect(() => {
    const updatedPostsEntries = Object.entries(postContext.updatedPosts);
    if (updatedPostsEntries.length > 0) {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          const updatedPost = postContext.getUpdatedPost(post._id);
          return updatedPost || post;
        }),
      );
    }
  }, [postContext.updatedPosts]);

  const fetchFavoritePosts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getFavoritePosts(token);

      if (response?.data && Array.isArray(response.data)) {
        // Actualizar con los posts más recientes del contexto
        const updatedPostsData = response.data.map(post => {
          const updatedPost = postContext.getUpdatedPost(post._id);
          return updatedPost || post;
        });
        setPosts(updatedPostsData);
      } else {
        setPosts([]);
      }
    } catch (error) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token, postContext]);

  const refreshData = useCallback(async () => {
    if (refreshing || loading) return;

    setRefreshing(true);
    await fetchFavoritePosts();
    setRefreshing(false);
  }, [fetchFavoritePosts, refreshing, loading]);

  useEffect(() => {
    fetchFavoritePosts();
  }, [fetchFavoritePosts]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!refreshing && !loading) {
        refreshData();
      }
    });
    return unsubscribe;
  }, [navigation, refreshing, loading, refreshData]);

  const renderPost = useCallback(({item}) => {
    if (!item?._id) return null;

    return (
      <View style={styles.postContainer}>
        <Post item={item} source="Favorite" />
      </View>
    );
  }, []);

  const renderEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={`skeleton-${index}`} style={styles.skeleton} />
          ))}
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
        You haven’t added any posts to favorites yet.
        </Text>
      </View>
    );
  }, [loading]);

  const renderFooter = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      );
    }
    return null;
  }, [loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Favoritos</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item, index) => `post-${item._id}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContent,
            posts.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshData}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
        />
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5, // Reducir el espacio del header
    paddingHorizontal: 15,
    borderBottomWidth: 0, // Eliminar la línea inferior del header
    backgroundColor: '#fff',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  header: {
    fontSize: 18, // Reducir el tamaño del texto del header
    fontWeight: 'bold',
    color: 'black',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  emptyList: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  postContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
  },
  skeletonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  skeleton: {
    width: '48%',
    height: 200,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default FavoriteScreen;
