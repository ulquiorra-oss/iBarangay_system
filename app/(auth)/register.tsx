// RegisterScreen.tsx
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

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !phoneNumber.trim() || !address.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Pass all required fields according to RegisterData interface
      const success = await register({ 
        email, 
        password, 
        firstName, 
        lastName, 
        phoneNumber, 
        address 
      });
      
      if (success) {
        Alert.alert('Success', 'Account created successfully');
        router.replace('/(auth)/login');
      } else {
        Alert.alert('Error', 'Email already exists. Please use a different email.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <IconSymbol name="arrow.left" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Sign Up</Text>
            <View style={{ width: 40 }} />
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
            <Text style={styles.title}>Join Us</Text>
            <Text style={styles.subtitle}>Create your account to access barangay services</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name & Last Name */}
            <View style={styles.nameContainer}>
              <View style={styles.nameGroup}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor={colors.textLight}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.nameGroup}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor={colors.textLight}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
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
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textLight}
                keyboardType="phone-pad"
              />
            </View>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your complete address"
                placeholderTextColor={colors.textLight}
                autoCapitalize="words"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <IconSymbol
                    name={showPassword ? 'eye.slash' : 'eye'}
                    size={22}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <IconSymbol
                    name={showPassword ? 'eye.slash' : 'eye'}
                    size={22}
                    color={colors.text}
                  />
                </Pressable>
              </View>
            </View>

            {/* Sign Up Button */}
            <Pressable
              style={[
                styles.loginButton, 
                isLoading && styles.loginButtonDisabled,
                (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber || !address) && styles.loginButtonDisabled
              ]}
              onPress={handleRegister}
              disabled={isLoading || !firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber || !address}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>Sign Up</Text>
              )}
            </Pressable>

            {/* Back to Login */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.registerLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
  },
  backButton: { paddingHorizontal: 12, paddingVertical: 6 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text },

  logoSection: { alignItems: 'center', paddingHorizontal: 20, marginVertical: 30 },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoImage: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textLight, textAlign: 'center' },

  form: { paddingHorizontal: 20 },
  nameContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameGroup: { flex: 1, marginRight: 8 },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  passwordInput: { 
    flex: 1, 
    fontSize: 16, 
    color: colors.text, 
    paddingVertical: 12, 
    paddingHorizontal: 0 
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
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { fontSize: 16, fontWeight: '600', color: colors.white },

  registerSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 24 
  },
  registerText: { fontSize: 14, color: colors.textLight },
  registerLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});