import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Animated, Text} from 'react-native';
import logo from '../assets/imgs/logo.png';

export default function SplashScreen() {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity: fadeAnimation, alignItems: 'center'}}>
        <Image style={styles.image} source={logo} />
        <Text style={styles.title}>REDMEDIA</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    height: 150,
    width: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});