import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { commonStyles, colors } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'resident' | 'admin'>('resident');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(email.trim(), password, selectedRole);
    setIsLoading(false);

    if (success) {
      console.log('Login successful, navigating to dashboard');
      if (selectedRole === 'resident') {
        router.replace('/(resident)/dashboard');
      } else {
        router.replace('/(admin)/dashboard');
      }
    } else {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const handleRegister = () => {
    console.log('Navigating to register screen');
    router.push('/(auth)/register' as any);

  };

  const handleBack = () => {
    console.log('Going back to welcome screen');
    router.back();
  };

  // Demo credentials helper
  const fillDemoCredentials = (role: 'resident' | 'admin') => {
    if (role === 'resident') {
      setEmail('juan.delacruz@email.com');
      setPassword('password123');
      setSelectedRole('resident');
    } else {
      setEmail('captain@barangay.gov.ph');
      setPassword('admin123');
      setSelectedRole('admin');
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <IconSymbol name="arrow.left" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Sign In</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your barangay services</Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleButtons}>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === 'resident' && styles.roleButtonActive,
                  { marginRight: 8 }
                ]}
                onPress={() => setSelectedRole('resident')}
              >
                <IconSymbol 
                  name="person" 
                  size={20} 
                  color={selectedRole === 'resident' ? colors.white : colors.primary} 
                />
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 'resident' && styles.roleButtonTextActive
                ]}>
                  Resident
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === 'admin' && styles.roleButtonActive
                ]}
                onPress={() => setSelectedRole('admin')}
              >
                <IconSymbol 
                  name="person.badge.key" 
                  size={20} 
                  color={selectedRole === 'admin' ? colors.white : colors.primary} 
                />
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 'admin' && styles.roleButtonTextActive
                ]}>
                  Official
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textLight}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoSection}>
              <Text style={styles.demoLabel}>Demo Accounts:</Text>
              <View style={styles.demoButtons}>
                <Pressable 
                  style={[styles.demoButton, { marginRight: 8 }]} 
                  onPress={() => fillDemoCredentials('resident')}
                >
                  <Text style={styles.demoButtonText}>Resident Demo</Text>
                </Pressable>
                <Pressable 
                  style={styles.demoButton} 
                  onPress={() => fillDemoCredentials('admin')}
                >
                  <Text style={styles.demoButtonText}>Admin Demo</Text>
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <IconSymbol name="arrow.right" size={20} color={colors.white} />
                </>
              )}
            </Pressable>

            {/* Register Link */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Don&apos;t have an account? </Text>
              <Pressable onPress={handleRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // round logo
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden', // keeps image inside circle
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  roleSection: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  roleButtonTextActive: {
    color: colors.white,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  demoSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  demoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  demoButtons: {
    flexDirection: 'row',
  },
  demoButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 6,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  registerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: colors.textLight,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
