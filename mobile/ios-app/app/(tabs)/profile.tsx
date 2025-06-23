import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(true);

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    totalAssets: 67998,
    accounts: 3,
    transactions: 145,
  };

  const menuItems = [
    {
      icon: 'person.circle' as const,
      title: 'Account Settings',
      subtitle: 'Update your personal information',
      color: '#3B82F6',
    },
    {
      icon: 'lock' as const,
      title: 'Privacy & Security',
      subtitle: 'Manage your security preferences',
      color: '#EF4444',
    },
    {
      icon: 'chart.bar' as const,
      title: 'Export Data',
      subtitle: 'Download your financial data',
      color: '#10B981',
    },
    {
      icon: 'questionmark.circle' as const,
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      color: '#F59E0B',
    },
    {
      icon: 'info.circle' as const,
      title: 'About',
      subtitle: 'App version and information',
      color: '#8B5CF6',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <IconSymbol name="pencil" size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          <Text style={styles.memberSince}>Member since {profileData.memberSince}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Financial Journey</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${profileData.totalAssets.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Assets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.accounts}</Text>
              <Text style={styles.statLabel}>Accounts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profileData.transactions}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="bell" size={24} color="#3B82F6" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingSubtitle}>Get alerts for transactions</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="touchid" size={24} color="#EF4444" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Biometric Authentication</Text>
                  <Text style={styles.settingSubtitle}>Use Face ID or Touch ID</Text>
                </View>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>More</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuCard}>
              <View style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <IconSymbol name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    marginLeft: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 12,
  },
});
