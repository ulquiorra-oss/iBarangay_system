import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../styles/commonStyles";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  // Animation refs
  const animationRefs = {
    logo: {
      opacity: useRef(new Animated.Value(0)).current,
      scale: useRef(new Animated.Value(0.8)).current,
    },
    content: {
      opacity: useRef(new Animated.Value(0)).current,
      translateY: useRef(new Animated.Value(20)).current,
    },
    tagline: {
      opacity: useRef(new Animated.Value(0)).current,
      translateY: useRef(new Animated.Value(10)).current,
    },
    values: {
      opacities: ["Efficiency", "Transparency", "Community"].map(() => 
        useRef(new Animated.Value(0)).current
      ),
      translateYs: ["Efficiency", "Transparency", "Community"].map(() => 
        useRef(new Animated.Value(10)).current
      ),
    },
  };

  // Configuration constants
  const CONFIG = {
    ANIMATION: {
      DURATION: {
        SHORT: 400,
        MEDIUM: 600,
        LONG: 800,
      },
      DELAY: {
        VALUES_STAGGER: 300,
        HOLD: 1800,
      },
    },
    CONTENT: {
      VALUES: ["Efficiency", "Transparency", "Community"],
      TAGLINE: "Barangay Management System",
      SUBTAGLINE: "Streamlining Community Services",
    },
  };

  useEffect(() => {
    const startAnimations = () => {
      Animated.sequence([
        // Phase 1: Logo entrance with gentle bounce
        Animated.parallel([
          Animated.timing(animationRefs.logo.opacity, {
            toValue: 1,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
          Animated.spring(animationRefs.logo.scale, {
            toValue: 1,
            tension: 130,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),

        // Phase 2: Tagline entrance
        Animated.parallel([
          Animated.timing(animationRefs.tagline.opacity, {
            toValue: 1,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
          Animated.timing(animationRefs.tagline.translateY, {
            toValue: 0,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
        ]),

        // Phase 3: Values sequence with fade up
        Animated.stagger(
          CONFIG.ANIMATION.DELAY.VALUES_STAGGER,
          animationRefs.values.opacities.map((opacity, index) =>
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 1,
                duration: CONFIG.ANIMATION.DURATION.MEDIUM,
                useNativeDriver: true,
              }),
              Animated.timing(animationRefs.values.translateYs[index], {
                toValue: 0,
                duration: CONFIG.ANIMATION.DURATION.MEDIUM,
                useNativeDriver: true,
              }),
            ])
          )
        ),

        // Phase 4: Content appears after values
        Animated.parallel([
          Animated.timing(animationRefs.content.opacity, {
            toValue: 1,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
          Animated.timing(animationRefs.content.translateY, {
            toValue: 0,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
        ]),

        // Phase 5: Hold display
        Animated.delay(CONFIG.ANIMATION.DELAY.HOLD),

        // Phase 6: Smooth fade out
        Animated.parallel([
          Animated.timing(animationRefs.logo.opacity, {
            toValue: 0,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
          Animated.timing(animationRefs.content.opacity, {
            toValue: 0,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
          Animated.timing(animationRefs.tagline.opacity, {
            toValue: 0,
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => router.replace("/(auth)/welcome"));
    };

    startAnimations();
  }, []);

  const renderLogo = () => (
    <Animated.View 
      style={[
        styles.logoContainer,
        { 
          opacity: animationRefs.logo.opacity,
          transform: [{ scale: animationRefs.logo.scale }] 
        }
      ]}
    >
      {/* Outer ring with subtle gradient */}
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
        style={styles.logoGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Inner circle with white background */}
      <View style={styles.innerCircle}>
        {/* Logo image */}
        <Image 
          source={require("../assets/images/logo.png")} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </View>
    </Animated.View>
  );

  const renderTagline = () => (
    <Animated.View 
      style={[
        styles.taglineContainer,
        { 
          opacity: animationRefs.tagline.opacity,
          transform: [{ translateY: animationRefs.tagline.translateY }] 
        }
      ]}
    >
      <Text style={styles.tagline}>{CONFIG.CONTENT.TAGLINE}</Text>
      <Text style={styles.subTagline}>{CONFIG.CONTENT.SUBTAGLINE}</Text>
    </Animated.View>
  );

  const renderValues = () => (
    <Animated.View 
      style={[
        styles.valuesContainer,
        { 
          opacity: animationRefs.content.opacity,
          transform: [{ translateY: animationRefs.content.translateY }] 
        }
      ]}
    >
      {CONFIG.CONTENT.VALUES.map((value, index) => (
        <Animated.View 
          key={value}
          style={[
            styles.valueItem,
            { 
              opacity: animationRefs.values.opacities[index],
              transform: [{ translateY: animationRefs.values.translateYs[index] }]
            }
          ]}
        >
          <View style={styles.valueDot} />
          <Text style={styles.valueText}>{value}</Text>
        </Animated.View>
      ))}
    </Animated.View>
  );

  return (
    <LinearGradient 
      colors={[colors.primary, colors.secondary]} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {renderLogo()}
        {renderTagline()}
        {renderValues()}
      </View>
      
      <Animated.View style={styles.footer}>
        <Text style={styles.footerText}>Barangay Official System</Text>
        <Text style={styles.copyrightText}>© {new Date().getFullYear()}</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 180, // Increased from 140
    height: 180, // Increased from 140
    borderRadius: 90, // Half of width/height for perfect circle
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    position: 'relative',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  logoGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 90,
  },
  innerCircle: {
    width: 130, // Increased from 80
    height: 130, // Increased from 80
    borderRadius: 65, // Half of width/height for perfect circle
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // Increased padding for larger image
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: "100%", // Fill the container
    height: "100%", // Fill the container
  },
  taglineContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  tagline: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    letterSpacing: 0.4,
    marginBottom: 6,
    lineHeight: 34,
  },
  subTagline: {
    fontSize: 15,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  valuesContainer: {
    alignItems: "center",
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  valueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginRight: 10,
  },
  valueText: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});