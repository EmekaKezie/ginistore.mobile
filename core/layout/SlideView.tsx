import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";

type TProps = {
  children: ReactNode;
};

export default function SlideView({ children }: TProps) {
  const slide = useRef(
    new Animated.Value(Dimensions.get("window").width)
  ).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: slide }],
      }}>
      {children}
    </Animated.View>
  );
}
