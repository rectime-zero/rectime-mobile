import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import RNSplashScreen from 'react-native-splash-screen';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(24)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    try {
      if (RNSplashScreen && RNSplashScreen.hide) {
        RNSplashScreen.hide();
      }
    } catch (error) {
      console.warn('Failed to hide splash screen:', error);
    }

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onFinish());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* TODO: ロゴ - 正式画像が決まったら <Image> に差し替え */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        {/* TODO: 差し替え
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        */}
        <View style={styles.logoPlaceholder} />
      </Animated.View>

      {/* TODO: タイトル - 正式タイトルが決まったら文字列を差し替え */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        {/* TODO: 正式タイトルに差し替え */}
        AppTitle
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // TODO: ブランドカラーに変更
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#E0E0E0', // TODO: ロゴ差し替えと同時に削除
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333', // TODO: ブランドカラーに変更
    letterSpacing: 1,
  },
});
