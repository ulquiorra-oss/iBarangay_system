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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { commonStyles, colors } from '../../styles/commonStyles';
import { IconSymbol } from '../../components/IconSymbol';
import { mockResidents, setCurrentUser } from '../../data/mockData';

const { width } = Dimensions.get('window');

// Configuration constants
const CONFIG = {
  VALIDATION: {
    PASSWORD: 'password123',
    MESSAGES: {
      EMPTY_FIELDS: 'Please fill in all fields',
      INVALID_CREDENTIALS: 'The email or password you entered is incorrect.',
    },
  },
};

export default function LoginScreen() {
  // State management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [uiState, setUiState] = useState({
    showPassword: false,
    isLoading: false,
  });

  const { login } = useAuth();

  // Handler functions
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = () => {
    setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', CONFIG.VALIDATION.MESSAGES.EMPTY_FIELDS);
      return false;
    }
    return true;
  };

  const authenticateUser = () => {
    return mockResidents.find(
      resident => resident.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const user = authenticateUser();
    
    if (!user || formData.password !== CONFIG.VALIDATION.PASSWORD) {
      Alert.alert('Oops!', CONFIG.VALIDATION.MESSAGES.INVALID_CREDENTIALS);
      return;
    }

    setUiState(prev => ({ ...prev, isLoading: true }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentUser(user);
      await login(user.email, formData.password);
      
      router.replace('/(resident)/dashboard');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setUiState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleBack = () => {
    router.replace('/(auth)/welcome');
  };

  // Component render functions
  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable 
        style={styles.backButton} 
        onPress={handleBack}
        hitSlop={10}
      >
        <IconSymbol name="chevron.left" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>Sign In</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderLogoSection = () => (
    <View style={styles.logoSection}>
      <View style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>
      </View>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to access your barangay services and community resources
      </Text>
    </View>
  );

  const renderEmailInput = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Email Address</Text>
      <View style={styles.inputContainer}>
        <IconSymbol name="envelope" size={20} color={colors.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          placeholderTextColor={colors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!uiState.isLoading}
        />
      </View>
    </View>
  );

  const renderPasswordInput = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Password</Text>
      <View style={styles.inputContainer}>
        <IconSymbol name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
        <TextInput
          style={styles.passwordInput}
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          placeholder="Enter your password"
          placeholderTextColor={colors.textLight}
          secureTextEntry={!uiState.showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!uiState.isLoading}
        />
        <Pressable 
          onPress={togglePasswordVisibility}
          hitSlop={10}
        >
          <IconSymbol
            name={uiState.showPassword ? 'eye.slash' : 'eye'}
            size={20}
            color={colors.textLight}
          />
        </Pressable>
      </View>
    </View>
  );

  const renderLoginButton = () => (
    <Pressable
      style={[
        styles.loginButton,
        uiState.isLoading && styles.loginButtonDisabled,
        (!formData.email || !formData.password) && styles.loginButtonDisabled,
      ]}
      onPress={handleLogin}
      disabled={uiState.isLoading || !formData.email || !formData.password}
    >
      {uiState.isLoading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <View style={styles.loginButtonContent}>
          <Text style={styles.loginButtonText}>Sign In</Text>
          <IconSymbol name="arrow.right" size={20} color={colors.white} />
        </View>
      )}
    </Pressable>
  );

  const renderRegisterSection = () => (
    <View style={styles.registerSection}>
      <Text style={styles.registerText}>Don't have an account? </Text>
      <Pressable onPress={handleRegister} disabled={uiState.isLoading}>
        <Text style={[
          styles.registerLink,
          uiState.isLoading && styles.registerLinkDisabled
        ]}>
          Sign Up
        </Text>
      </Pressable>
    </View>
  );

  const renderForm = () => (
    <View style={styles.form}>
      {renderEmailInput()}
      {renderPasswordInput()}
      {renderLoginButton()}
      {renderRegisterSection()}
    </View>
  );

  return (
    <SafeAreaView style={[commonStyles.safeArea, styles.safeArea]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderHeader()}
          {renderLogoSection()}
          {renderForm()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  scrollContent: { 
    flexGrow: 1, 
  },

  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 24, 
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: { 
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSpacer: { 
    width: 40,
  },

  // Logo Section
  logoSection: { 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60, // Makes the container circular
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden', // This ensures the image stays within the circular bounds
  },
  logoImage: { 
    width: '100%', // Fill the circular container
    height: '100%',
    // If your logo has transparent background, this will work perfectly
    // If not, you might need to adjust the aspect ratio
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: colors.text, 
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: colors.textLight, 
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },

  // Form
  form: { 
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputGroup: { 
    marginBottom: 20,
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.text, 
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 16,
    paddingHorizontal: 0,
    marginRight: 12,
  },

  // Buttons
  loginButton: { 
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: { 
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.white, 
    marginRight: 8,
    letterSpacing: 0.5,
  },

  // Register Section
  registerSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 32,
    paddingVertical: 8,
  },
  registerText: { 
    fontSize: 15, 
    color: colors.textLight,
    opacity: 0.8,
  },
  registerLink: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: colors.primary,
    letterSpacing: -0.2,
  },
  registerLinkDisabled: {
    opacity: 0.5,
  },
});