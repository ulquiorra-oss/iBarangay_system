import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    console.log('Navigating to login screen');
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(30, 64, 175, 0.8)', 'rgba(5, 150, 105, 0.6)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            {/* Logo/Icon Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/logo.png')} // adjust path if needed
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appTitle}>Barangay Jupeta</Text>
              <Text style={styles.appSubtitle}>
                Centralized Management System
              </Text>
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                Welcome to Your Digital Barangay
              </Text>
              <Text style={styles.welcomeDescription}>
                Access barangay services, request documents, make payments, and
                stay connected with your community - all in one place.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              <View style={styles.featureItem}>
                <IconSymbol name="doc.text" size={24} color={colors.white} />
                <Text style={styles.featureText}>Request Documents</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="creditcard" size={24} color={colors.white} />
                <Text style={styles.featureText}>Online Payments</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="bell" size={24} color={colors.white} />
                <Text style={styles.featureText}>Announcements</Text>
              </View>
            </View>

            {/* Get Started Button */}
            <View style={styles.buttonSection}>
              <Pressable
                style={styles.getStartedButton}
                onPress={handleGetStarted}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <IconSymbol name="arrow.right" size={20} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // makes it round
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden', // ensures image stays inside the circle
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  buttonSection: {
    width: '100%',
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
  },
});
