import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.1.7:5000/api';

export default function HomeScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('userEmail');
      if (token && email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('userId');
          await AsyncStorage.removeItem('age');
          setUserEmail(null);
          Alert.alert('Success', 'You have been logged out');
        },
        style: 'destructive',
      },
    ]);
  };

  const selectAge = async (ageGroup: string) => {
    try {
      if (ageGroup === 'under14') {
        await AsyncStorage.setItem('age', '13');
        Alert.alert('Age Set', 'You selected: Age 13 and under. Opening courses...');
        router.push({ pathname: '/screens/age-select', params: { category: 'under14' } });
      } else {
        await AsyncStorage.setItem('age', '14');
        Alert.alert('Age Set', 'You selected: Age 14 and over. Opening courses...');
        router.push({ pathname: '/screens/age-select', params: { category: 'over14' } });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to set age');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#a092d3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Learning & Photography</Text>
        <Text style={styles.headerSubtitle}>Master AI with hands-on learning</Text>
      </View>

      {/* User Status */}
      <View style={styles.userSection}>
        {userEmail ? (
          <>
            <Text style={styles.userText}>Logged in as: {userEmail}</Text>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.userText}>Not logged in</Text>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Age Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Learning Path</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => selectAge('under14')}
          >
            <Text style={styles.buttonText}>Under 14</Text>
            <Text style={styles.buttonSubtext}>Beginner Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => selectAge('over14')}
          >
            <Text style={styles.buttonText}>Over 14</Text>
            <Text style={styles.buttonSubtext}>Advanced Courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore Features</Text>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => router.push('/screens/learning')}
        >
          <Text style={styles.cardIcon}>📚</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Learning with AI</Text>
            <Text style={styles.cardDescription}>Interactive courses and tutorials</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => router.push('/screens/photography')}
        >
          <Text style={styles.cardIcon}>📸</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Photography Insights</Text>
            <Text style={styles.cardDescription}>AI-powered photo techniques</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => router.push('/screens/portfolio')}
        >
          <Text style={styles.cardIcon}>🎯</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>My Portfolio</Text>
            <Text style={styles.cardDescription}>View your submissions</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => router.push('/screens/contests')}
        >
          <Text style={styles.cardIcon}>🏆</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Contests</Text>
            <Text style={styles.cardDescription}>Join competitions</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Platform</Text>
        <Text style={styles.aboutText}>
          Welcome to our AI Learning Platform! We provide interactive courses, photography
          insights, and portfolio management for learners of all ages. Join contests, showcase
          your work, and grow your skills with AI-powered tools.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 AI Learning & Photography</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#a092d3',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  section: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#a092d3',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 5,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 15,
    width: 50,
    textAlign: 'center',
    height: 50,
    lineHeight: 50,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 13,
    color: '#999',
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  footer: {
    backgroundColor: '#a092d3',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
});
