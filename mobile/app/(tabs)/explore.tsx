import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ExploreScreen() {
  const router = useRouter();

  const resources = [
    {
      id: 1,
      title: '🎬 Video Tutorials',
      description: 'Watch step-by-step video guides on AI and photography',
      onPress: () => {
        Alert.alert('Video Tutorials', 'Access to video content coming soon! Check back with your instructor for links.');
      },
    },
    {
      id: 2,
      title: '📚 Learning Materials',
      description: 'Download course materials and reference guides',
      onPress: () => {
        Alert.alert('Learning Materials', 'Course materials are shared by your instructors. Check your email or course page.');
      },
    },
    {
      id: 3,
      title: '💬 Community Forum',
      description: 'Connect with other learners and ask questions',
      onPress: () => {
        Alert.alert('Community Forum', 'Join our online community to discuss with other learners!');
      },
    },
    {
      id: 4,
      title: '🏅 Certificates',
      description: 'Earn and share your course completion certificates',
      onPress: () => {
        Alert.alert('Certificates', 'Certificates are awarded upon course completion. Keep learning!');
      },
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Resources</Text>
        <Text style={styles.subtitle}>Enhance your learning journey</Text>
      </View>

      <View style={styles.content}>
        {resources.map((resource) => (
          <TouchableOpacity key={resource.id} style={styles.resourceCard} onPress={resource.onPress}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceDescription}>{resource.description}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <Text style={styles.tipText}>
            ✓ Join study groups to collaborate with other learners
          </Text>
          <Text style={styles.tipText}>
            ✓ Complete quizzes to reinforce your knowledge
          </Text>
          <Text style={styles.tipText}>
            ✓ Participate in contests to win prizes
          </Text>
          <Text style={styles.tipText}>
            ✓ Share your projects in the portfolio
          </Text>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  resourceCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
});
