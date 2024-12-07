import React, {useState, useEffect} from 'react';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = React.createContext();

export function useToggleMode() {
  return useContext(ThemeContext);
}

export const ThemeProvider = ({children}) => {
  
  const [isDark, setIsDark] = useState(false);
  const [colors, setColors] = useState({
    //light mode
    background: '#ffffff',
    text: '#000000',
    post: '#e7e7e7',
    detailes: '#838181',
    separator: 'rgba(131, 129, 129, 0.01)',
  });

  const toggleTheme = async () => {
    let background = '#121212';
    let text = '#faefef';
    let post = '#323232';
    let details = '#beb9b9';
    await AsyncStorage.setItem('theme', 'dark');
  
    if (isDark) {
      await AsyncStorage.setItem('theme', 'light');
      //light mode
      background = '#ffffff';
      text = '#000000';
      post = '#e7e7e7';
      details = '#838181';
    }
    
    setColors({
      background: background,
      text: text,
      post: post,
      detailes: details,
      separator: 'rgba(131, 129, 129, 0.01)',
    });
    
    setIsDark(!isDark);

  };

  return (
    <ThemeContext.Provider value={{isDark, toggleTheme, colors}}>
      {children}
    </ThemeContext.Provider>
  );
};