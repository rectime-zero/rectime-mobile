import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import RNSplashScreen from 'react-native-splash-screen';
import {useTheme} from '../theme';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const {resolvedMode, theme} = useTheme();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(12)).current;
  const logoScale = useRef(new Animated.Value(0.96)).current;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        if (RNSplashScreen && RNSplashScreen.hide) {
          RNSplashScreen.hide();
        }
      } catch (error) {
        console.warn('Failed to hide splash screen:', error);
      }
    });

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(640),
    ]).start(() => onFinish());

    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.navigationSurface}
        hidden={false}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }, {scale: logoScale}],
          },
        ]}
      >
        <Image
          source={require('../assets/icons/app-icon.png')}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
};

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.navigationSurface,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      width: 136,
      height: 136,
      resizeMode: 'contain',
    },
  });
}
