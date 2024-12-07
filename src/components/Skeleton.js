import React from "react";
import { View, StyleSheet } from "react-native";
import { useToggleMode } from "../context/ThemeContext";

const Skeleton = ({ style }) => {
  const { colors } = useToggleMode();
  return <View style={[styles.skeleton, style,{backgroundColor:colors.post}]} />;
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
});

export default Skeleton;
