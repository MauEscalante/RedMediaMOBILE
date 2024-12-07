import React, { createContext, useContext, useCallback, useState } from 'react';

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [updatedPosts, setUpdatedPosts] = useState({});

  const updatePost = useCallback((updatedPost) => {
    if (!updatedPost?._id) return;
    setUpdatedPosts(prev => ({
      ...prev,
      [updatedPost._id]: updatedPost
    }));
  }, []);

  const getUpdatedPost = useCallback((postId) => {
    return updatedPosts[postId];
  }, [updatedPosts]);

  return (
    <PostContext.Provider value={{ updatePost, getUpdatedPost, updatedPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};