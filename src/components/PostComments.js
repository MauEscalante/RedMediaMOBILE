import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useToggleMode } from '../context/ThemeContext';

const PostComments = ({ comments }) => {
  const { colors } = useToggleMode();
  if (!comments || comments.length === 0) {
    return <Text style={styles.noCommentsText}>No comments yet</Text>;
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.commentSection}>
      {comments.map((comment, index) => (
        <View key={index} style={[styles.commentContainer,{color:colors.text}]}>
          <View style={[styles.userCommentContainer,{color:colors.text}]}>
            <Text style={[styles.commentUsername,{color:colors.text}]}>{comment.username}</Text>
            <Text style={[styles.commentText,{color:colors.text}]}>{comment.comment}</Text>
          </View>
          <Text style={[styles.commentTime,{color:colors.text}]}>{formatDate(comment.createdAt)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  commentSection: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent:"space-between",
  },
  userCommentContainer: {
    flexDirection: 'row',
    justifyContent:"space-between",
  },
  commentUsername: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  noCommentsText: {
    paddingHorizontal: 15,
    color: '#aaa',
    fontStyle: 'italic',
  },
  commentTime: {
    fontSize: 14,
    textAlign: "left",
  },
});

export default PostComments;
