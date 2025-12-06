import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.56.1:5000/api';

export default function PhotographyScreen() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userAge, setUserAge] = useState<number | null>(null);

    useEffect(() => {
        fetchUserAgeAndCourses();
    }, []);

    const fetchUserAgeAndCourses = async () => {
        try {
            const age = await AsyncStorage.getItem('age');
            if (age) setUserAge(parseInt(age));

            const response = await fetch(`${BACKEND_URL}/courses`);
            if (response.ok) {
                const data = await response.json();
                // Filter photography courses only
                const photoCourses = data.filter((c: any) => c.category === 'photography');
                setCourses(photoCourses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            Alert.alert('Error', 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#a092d3" />
            </View>
        );
    }

    // Age-based filter: show courses appropriate for user's age
    // Simple age filter: under14 users cannot see over14 courses
    const filteredCourses = userAge && userAge <= 13
        ? courses.filter(c => c.age_group === 'under14')
        : courses;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Photography & Design</Text>
            </View>

            <View style={styles.content}>
                {userAge && (
                    <View style={styles.ageIndicator}>
                        <Text style={styles.ageText}>📷 {userAge <= 13 ? 'Beginner Courses' : 'Advanced Courses'}</Text>
                    </View>
                )}

                <Text style={styles.description}>
                    Master AI-powered photo editing, design tools, and creative techniques. Create stunning
                    visuals with professional tools and learn from industry best practices.
                </Text>

                <Text style={styles.sectionTitle}>Available Courses ({filteredCourses.length})</Text>

                {filteredCourses.length === 0 ? (
                    <Text style={styles.noCourses}>No courses available for your age group</Text>
                ) : (
                    filteredCourses.map((course) => (
                        <TouchableOpacity
                            key={course.id}
                            style={styles.tipCard}
                            onPress={() => router.push({
                                pathname: '/screens/course-detail',
                                params: { courseId: course.id.toString() }
                            })}
                        >
                            <Text style={styles.tipTitle}>{course.title}</Text>
                            <View style={styles.ageBadge}>
                                <Text style={styles.ageBadgeText}>
                                    {course.age_group === 'under14' ? 'Age 13 & under' : 'Age 14+'}
                                </Text>
                            </View>
                            <Text style={styles.learnButton}>→ View Course</Text>
                        </TouchableOpacity>
                    ))
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Popular AI Design Tools</Text>
                    <Text style={styles.toolText}>📱 Mobile: Snapseed, Lightroom, Adobe Express</Text>
                    <Text style={styles.toolText}>🖥️ Desktop: Photoshop, Capture One, GIMP</Text>
                    <Text style={styles.toolText}>🎨 Trending: Canva, Figma, Adobe Firefly</Text>
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
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    backButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    ageIndicator: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    ageText: {
        fontSize: 14,
        color: '#2e7d32',
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 25,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    tipCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    ageBadge: {
        backgroundColor: '#ab68e2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    ageBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    noCourses: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    restrictedContainer: {
        backgroundColor: '#fff3cd',
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    restrictedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff6f00',
        marginBottom: 10,
    },
    restrictedText: {
        fontSize: 14,
        color: '#e65100',
        marginBottom: 15,
        lineHeight: 20,
    },
    homeButton: {
        backgroundColor: '#ff9800',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    homeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    learnButton: {
        backgroundColor: '#a092d3',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    learnButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    toolText: {
        fontSize: 13,
        color: '#555',
        marginBottom: 10,
        lineHeight: 20,
    },
});
