// src/components/Notification.js
import React from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getTimeDifference,getPostDetails} from '../controller/miApp.controller';
import { useToggleMode } from '../context/ThemeContext';

const Notification = ({item}) => {
  const navigation = useNavigation();
  const {colors} = useToggleMode();

  const getImage = () => {
    switch (item.type) {
      case 'Trending':
        return require('../assets/imgs/like.png');
      case 'Comment':
        return require('../assets/imgs/comment.png');
      case 'Followed':
        return require('../assets/imgs/followed.png');
      default:
        return require('../assets/imgs/comment.png');
    }
  };

  const  getPost=async (postId)=>{
    const post= await getPostDetails(postId);
    navigation.navigate('PostDetail', {item: post})
  }

  return (
    <View style={styles.Notification}>
      <Image source={getImage()} style={styles.imagen} />
      <View style={styles.activityItem}>
        <Text style={[styles.activityType,{color:colors.text}]}>{item.type}</Text>
        <View style={styles.action}>
          {item.icon}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('profile', {username: item.user})
            } style={styles.action}>
            <Text style={[styles.activityUser,{color:colors.text}]}>{item.user}</Text>
            </TouchableOpacity>
            {
            item.type ==='Followed' ?
              <Text style={[styles.activityText,{color:colors.text}]}> {item.text}</Text>
              :
              <TouchableOpacity 
                onPress={() => 
                   getPost(item.post)}>
                <Text style={[styles.activityText,{color:colors.text}]}> {item.text}</Text>
              </TouchableOpacity> 
            }

        </View>
        <Text style={[styles.activityTime,{color:colors.text}]}>{ getTimeDifference(item.time)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Notification: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityItem: {
    marginLeft: 10,
    padding: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(242, 244, 245, 0.5)',
    flex: 1,
  },
  activityType: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    lineHeight: 22,
    fontSize: 17,
    color: 'black',
    marginRight: 5,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityUser: {
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Roboto',
    color: 'black',
  },
  activityText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
    fontFamily: 'Roboto',
  },
  activityTime: {
    marginTop: 5,
    alignSelf: 'flex-end',
    color: '#999',
    fontSize: 12,
  },
});

export default Notification;
