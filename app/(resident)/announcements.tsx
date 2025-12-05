import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { barangayColors } from '../../constants/Colors';
import { IconSymbol } from '../../components/IconSymbol';
import { router } from 'expo-router';
import { Announcement } from '../../types';
import { getActiveAnnouncements } from '../../data/mockData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: barangayColors.background,
  },
  header: {
    backgroundColor: barangayColors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: barangayColors.white,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 8,
    zIndex: 1, // Added for better clickability
  },
  contentContainer: { // Renamed from 'content' to avoid conflict
    flex: 1,
  },
  announcementCard: {
    backgroundColor: barangayColors.white,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: barangayColors.text,
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: barangayColors.white,
    textTransform: 'uppercase',
  },
  announcementContent: { // Renamed from 'content' to avoid conflict
    fontSize: 14,
    color: barangayColors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  announcementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: barangayColors.border,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: barangayColors.textLight,
  },
  publishDate: {
    fontSize: 11,
    color: barangayColors.textLight,
  },
  typeIcon: {
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: barangayColors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: barangayColors.lightGray,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: barangayColors.border,
    marginRight: 8,
    backgroundColor: barangayColors.white,
  },
  filterButtonActive: {
    backgroundColor: barangayColors.primary,
    borderColor: barangayColors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: barangayColors.text,
  },
  filterButtonTextActive: {
    color: barangayColors.white,
  },
});

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'general', label: 'General' },
    { id: 'event', label: 'Events' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'health', label: 'Health' },
    { id: 'safety', label: 'Safety' },
  ];

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, activeFilter]);

  const loadAnnouncements = () => {
    const activeAnnouncements = getActiveAnnouncements();
    // Sort by priority and date
    const sorted = activeAnnouncements.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
    
    setAnnouncements(sorted);
    console.log('Loaded announcements:', sorted.length);
  };

  const filterAnnouncements = () => {
    if (activeFilter === 'all') {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(announcements.filter(ann => ann.type === activeFilter));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadAnnouncements();
    setRefreshing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return barangayColors.danger;
      case 'high':
        return barangayColors.warning;
      case 'medium':
        return barangayColors.accent;
      case 'low':
        return barangayColors.success;
      default:
        return barangayColors.gray;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general':
        return 'info'; // or 'info.circle.fill' for SF Symbols
      case 'event':
        return 'event'; // or 'calendar.circle.fill'
      case 'emergency':
        return 'warning'; // or 'exclamationmark.triangle.fill'
      case 'maintenance':
        return 'build'; // or 'wrench.and.screwdriver.fill'
      case 'health':
        return 'local-hospital'; // or 'heart.circle.fill'
      case 'safety':
        return 'security'; // or 'shield.checkerboard'
      default:
        return 'info';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Changed from "arrow-back" to "chevron.left" to match other screens */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={barangayColors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Announcements</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAnnouncements.length === 0 ? (
          <View style={styles.emptyState}>
            {/* Optional: Update to SF Symbols style if needed */}
            <IconSymbol name="campaign" size={64} color={barangayColors.textLight} />
            <Text style={styles.emptyText}>
              {activeFilter === 'all' ? 'No announcements available' : `No ${activeFilter} announcements`}
            </Text>
          </View>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <View key={announcement.id} style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <Text style={styles.title}>{announcement.title}</Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: getPriorityColor(announcement.priority) }
                ]}>
                  <Text style={styles.priorityText}>{announcement.priority}</Text>
                </View>
              </View>

              <Text style={styles.announcementContent}>{announcement.content}</Text>

              <View style={styles.announcementFooter}>
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>By {announcement.authorName}</Text>
                  <Text style={styles.publishDate}>
                    {formatDate(announcement.publishDate)}
                  </Text>
                </View>
                <View style={styles.typeIcon}>
                  <IconSymbol 
                    name={getTypeIcon(announcement.type) as any} 
                    size={20} 
                    color={barangayColors.textLight} 
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}