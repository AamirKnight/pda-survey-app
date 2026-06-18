import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  primary: '#1A3C6E',
  accent: '#E8A020',
  white: '#FFFFFF',
  bg: '#F4F6FA',
  textPrimary: '#1A1A2E',
  textSecond: '#5C6B8A',
  border: '#DDE3EE',
};

export default function SideDrawer({ navigation, currentUser }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home-outline', screen: 'MainTabs', params: { screen: 'Dashboard' } },
    { id: 'surveys', label: 'My Surveys', icon: 'clipboard-outline', screen: 'MainTabs', params: { screen: 'Surveys' } },
    { id: 'newSurvey', label: 'Start New Survey', icon: 'add-circle-outline', screen: 'NewSurvey' },
    { id: 'history', label: 'Survey History', icon: 'time-outline', screen: 'MainTabs', params: { screen: 'History' } },
    { id: 'profile', label: 'Profile', icon: 'person-outline', screen: 'MainTabs', params: { screen: 'Profile' } },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('pda_user');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'SR'}
          </Text>
        </View>
        <Text style={styles.name}>{currentUser?.name || 'Surveyor'}</Text>
        <Text style={styles.id}>{currentUser?.id || 'SRV-PDA-001'}</Text>
        <Text style={styles.zone}>{currentUser?.zone || 'Zone 3 — Civil Lines'}</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => {
              if (item.params) {
                navigation.navigate(item.screen, item.params);
              } else {
                navigation.navigate(item.screen);
              }
            }}
          >
            <Ionicons name={item.icon} size={20} color={COLORS.accent} style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.accent} style={styles.menuIcon} />
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0 | PDA Field App</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  id: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 4,
  },
  zone: {
    fontSize: 12,
    color: COLORS.accent,
  },
  menu: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    color: COLORS.accent,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecond,
    textAlign: 'center',
  },
});
