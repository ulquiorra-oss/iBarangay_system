import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '../../../components/IconSymbol';
import { barangayColors } from '../../../constants/Colors';

export default function SettingsHome() {
  const settingsItems = [
    {
      title: 'Account Settings',
      icon: 'person.crop.circle',
      route: '/(resident)/settings/account',
      color: barangayColors.primary,
    },
    {
      title: 'Notifications',
      icon: 'bell.badge.fill',
      route: '/(resident)/settings/notifications',
      color: barangayColors.accent,
    },
    {
      title: 'Privacy',
      icon: 'lock.circle.fill',
      route: '/(resident)/settings/privacy',
      color: barangayColors.secondary,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Settings</Text>

        {settingsItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => router.push(item.route as any)}
            style={styles.settingCard}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <IconSymbol name={item.icon as any} color={barangayColors.white} size={26} />
            </View>

            <Text style={styles.settingText}>{item.title}</Text>

            <IconSymbol
              name="chevron.right"
              color={barangayColors.gray}
              size={22}
              style={styles.chevron}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
    padding: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: barangayColors.text,
    marginBottom: 20,
  },

  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: barangayColors.white,
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  settingText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: barangayColors.text,
  },

  chevron: {
    opacity: 0.6,
  },
});
