import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../lib/constants';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bgPrimary, '#0F0705', COLORS.bgPrimary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoAccent}>G</Text>
            <Text style={styles.logoText}>ROW</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SELF</Text>
          </View>
          <View style={styles.accentLine} />
        </Animated.View>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          The gym tracker that gets{'\n'}smarter with every rep.
        </Animated.Text>
      </View>

      <Animated.View style={[styles.cta, { opacity: ctaOpacity }]}>
        <Text
          style={styles.ctaButton}
          onPress={() => router.push('/(auth)/signup')}
        >
          GET STARTED
        </Text>
        <Text
          style={styles.loginLink}
          onPress={() => router.push('/(auth)/login')}
        >
          Already have an account? <Text style={styles.loginLinkAccent}>Sign in</Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoAccent: {
    fontSize: 72,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: -2,
    lineHeight: 78,
  },
  logoText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 78,
  },
  accentLine: {
    height: 4,
    width: 60,
    backgroundColor: COLORS.accent,
    marginTop: 12,
    marginBottom: 32,
    borderRadius: 2,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '400',
  },
  cta: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 16,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    paddingVertical: 18,
    width: width - 64,
    textAlign: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginLink: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  loginLinkAccent: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});
