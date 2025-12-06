import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Buffer } from 'buffer';

export default function AgeSelectScreen() {
    const router = useRouter();
    const { category } = useLocalSearchParams();
    const [userAge, setUserAge] = useState<number | null>(null);

    useEffect(() => {
        checkUserAge();
    }, []);

    const checkUserAge = async () => {
        try {
            // Priority: read server-provided token (which includes calculated age)
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const payload = decodeJwtPayload(token);
                if (payload && (payload.age || payload.age === 0)) {
                    setUserAge(Number(payload.age));
                    return;
                }

                // If token doesn't include age, try to fetch profile (if backend route exists)
                try {
                    const resp = await fetch('http://192.168.56.1:5000/api/auth/profile', {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (resp.ok) {
                        const profile = await resp.json();
                        if (profile && profile.dob) {
                            const calculated = calculateAge(profile.dob);
                            setUserAge(calculated);
                            return;
                        }
                    }
                } catch (e) {
                    // ignore, we will fallback to stored age
                }
            }

            // Fallback: check stored simple age value (legacy flow)
            const age = await AsyncStorage.getItem('age');
            if (age) {
                setUserAge(parseInt(age));
            }
        } catch (error) {
            console.error('Error checking age:', error);
        }
    };

    // Decode JWT payload without verification (used only to read age claim set by server at login)
    const decodeJwtPayload = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1];
            // Base64 URL decode
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = Buffer.from(base64, 'base64').toString('utf8');
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    };

    const calculateAge = (dob: string) => {
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            if (
                today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }
            return age;
        } catch (e) {
            return null;
        }
    };

    const courseContent = {
        under14: {
            title: 'Courses for Under 14',
            description: 'Age-appropriate courses with engaging, fun content',
            courses: [
                {
                    id: 1,
                    title: 'AI for Kids',
                    description: 'Introduction to AI through fun games and activities',
                },
                {
                    id: 2,
                    title: 'Digital Art with AI',
                    description: 'Create amazing digital art using AI tools',
                },
                {
                    id: 3,
                    title: 'Robot Programming',
                    description: 'Learn programming basics with robots',
                },
            ],
        },
        over14: {
            title: 'Courses for Over 14',
            description: 'Advanced courses with professional-level content',
            courses: [
                {
                    id: 1,
                    title: 'Advanced Machine Learning',
                    description: 'Deep dive into ML algorithms and implementations',
                },
                {
                    id: 2,
                    title: 'AI Computer Vision',
                    description: 'Image processing and recognition with AI',
                },
                {
                    id: 3,
                    title: 'Professional Photography with AI',
                    description: 'Advanced photo editing and composition techniques',
                },
            ],
        },
    };

    const content = category === 'under14' ? courseContent.under14 : courseContent.over14;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{content.title}</Text>
            </View>

            <View style={styles.content}>
                {userAge !== null && (
                    <View style={styles.ageIndicator}>
                        <Text style={styles.ageText}>Age: {userAge}</Text>
                    </View>
                )}

                <Text style={styles.description}>{content.description}</Text>

                <Text style={styles.sectionTitle}>Featured Courses</Text>

                {content.courses.map((course) => (
                    <View key={course.id} style={styles.courseCard}>
                        <Text style={styles.courseTitle}>{course.title}</Text>
                        <Text style={styles.courseDescription}>{course.description}</Text>
                        <TouchableOpacity
                            style={styles.enrollButton}
                            onPress={() => {
                                // If this is the over14 category and user is under 14, block access
                                if (category === 'over14' && userAge !== null && userAge < 14) {
                                    Alert.alert(
                                        'Restricted',
                                        'This content is available only for users aged 14 and over.'
                                    );
                                    return;
                                }

                                // If user age unknown, allow them to continue after confirmation
                                const proceedToCourse = () => {
                                    const mapToMobileCourseId = (cat: string | undefined, localId: number) => {
                                        if (cat === 'under14') return localId; // 1..3 -> course1..3
                                        if (cat === 'over14') return 12 + localId; // 1->13,2->14,3->15
                                        return localId;
                                    };

                                    const mobileId = mapToMobileCourseId(category as string | undefined, course.id);
                                    (router as any).push(`/screens/course-pages/course${mobileId}`);
                                };

                                if (userAge === null) {
                                    Alert.alert(
                                        'Age Unknown',
                                        'We could not verify your age. Log in to verify your age, or continue to access content. Proceed?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Continue', onPress: proceedToCourse },
                                        ]
                                    );
                                    return;
                                }

                                // Known age and allowed: go to course
                                proceedToCourse();
                            }}
                        >
                            <Text style={styles.enrollButtonText}>Enroll Now</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>About These Courses</Text>
                    <Text style={styles.infoText}>
                        All courses include video tutorials, hands-on projects, and community support.
                        Start learning at your own pace!
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
    courseCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    courseDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    enrollButton: {
        backgroundColor: '#a092d3',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    enrollButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoBox: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#a092d3',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
});
