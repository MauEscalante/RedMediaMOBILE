import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useUserContext } from '../context/AuthProvider';
import { usePost } from '../context/PostContext';
import Post from '../components/Post';
import Skeleton from '../components/Skeleton';
import { getTimelinePosts, getAds } from '../controller/miApp.controller';
import { useToggleMode } from '../context/ThemeContext';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const { token } = useUserContext();
  const navigation = useNavigation();
  const postContext = usePost();
  const { colors } = useToggleMode();

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

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore && loadingMore) return;

      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else if (!refreshing) {
          setLoading(true);
        }

        const [postsResponse, adsResponse] = await Promise.all([
          getTimelinePosts(token),
          getAds(),
        ]);

        if (postsResponse?.data && Array.isArray(postsResponse.data)) {
          const sortedPosts = postsResponse.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );

          setPosts(prevPosts =>
            isLoadMore ? [...prevPosts, ...sortedPosts] : sortedPosts,
          );
        }

        if (adsResponse?.data && Array.isArray(adsResponse.data)) {
          setAds(adsResponse.data);
        }

        if (isLoadMore) {
          setPage(prevPage => prevPage + 1);
        }
      } catch (error) {
        } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [token, loadingMore, refreshing],
  );

  const refreshData = useCallback(async () => {
    if (refreshing) return;
    setPage(1);
    setRefreshing(true);
    await fetchData(false);
  }, [fetchData, refreshing]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!refreshing && !loading) {
        refreshData();
      }
    });
    return unsubscribe;
  }, [navigation, refreshing, loading, refreshData]);

  const adIndices = useMemo(() => {
    if (!ads.length) return [];
    return posts.map((_, index) =>
      (index + 1) % 4 === 0 ? Math.floor(Math.random() * ads.length) : null,
    );
  }, [posts, ads]);

  const renderPost = useCallback(
    ({ item, index }) => {
      const adIndex = adIndices[index];

      if (adIndex !== null && ads[adIndex]) {
        const randomAd = ads[adIndex];
        const adImageUri = randomAd?.imagePath?.[0]?.landscape;

        if (!adImageUri) return null;

        return (
          <TouchableOpacity
            key={`ad-${index}-${Date.now()}`}
            style={styles.adContainer}
            onPress={() => Linking.openURL(randomAd.Url)}>
            <Image
              source={{ uri: adImageUri }}
              style={styles.adImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      }

      if (!item?._id) return null;

      return (
        <View style={styles.postContainer}>
          <Post item={item} source="Home" />
        </View>
      );
    },
    [ads, adIndices],
  );

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
          You are not following anyone yet. Find your friends using the search
          icon or create a new post
        </Text>
      </View>
    );
  }, [loading]);

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#1DA1F2" />
        </View>
      );
    }
    return null;
  }, [loadingMore]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.headerContainer,{backgroundColor:colors.background}]}>
          <Image
            source={require('../assets/imgs/logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.header,{color:colors.text}]}>REDMEDIA</Text>
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
          onEndReached={() => !loadingMore && fetchData(true)}
          onEndReachedThreshold={0.5}
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    backgroundColor: '#fff',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  header: {
    fontSize: 20,
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
  adContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,  // Reduce el margen inferior de las publicidades
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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

export default HomeScreen;