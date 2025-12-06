import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.56.1:5000/api';

export default function CourseDetailScreen() {
    const router = useRouter();
    const { courseId } = useLocalSearchParams();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quizResult, setQuizResult] = useState<any>(null);

    useEffect(() => {
        fetchCourseAndQuizResult();
    }, [courseId]);

    // If we successfully fetched a course and there is a matching static page for it, redirect there.
    useEffect(() => {
        if (!course) return;
        try {
            const id = Number(course.id);
            if (id >= 1 && id <= 16) {
                // Replace this route with the static course page
                (router as any).replace(`/screens/course-pages/course${id}`);
            }
        } catch (e) {
            // ignore
        }
    }, [course]);

    const fetchCourseAndQuizResult = async () => {
        try {
            // Fetch course details
            const response = await fetch(`${BACKEND_URL}/courses`);
            if (response.ok) {
                const courses = await response.json();
                const selectedCourse = courses.find((c: any) => c.id === parseInt(courseId as string));
                setCourse(selectedCourse);
            }

            // Fetch quiz result if exists
            const results = await AsyncStorage.getItem('quizResults');
            if (results) {
                const quizResults = JSON.parse(results);
                if (quizResults[courseId as string]) {
                    setQuizResult(quizResults[courseId as string]);
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
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

    if (!course) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Course not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.courseHeaderCard}>
                <Text style={styles.categoryBadge}>
                    {course.category === 'learning' ? '📚 Learning' : '📷 Photography'}
                </Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <View style={styles.ageBadge}>
                    <Text style={styles.ageBadgeText}>
                        {course.age_group === 'under14' ? 'Age 13 & under' : 'Age 14+'}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Course Overview</Text>
                    <Text style={styles.description}>
                        This course covers practical skills and knowledge using {course.category === 'learning' ? 'AI-powered learning tools' : 'advanced photography techniques'}.
                        Engage with interactive content and test your knowledge with quizzes.
                    </Text>
                </View>

                {quizResult && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Quiz Results</Text>
                        <View style={styles.resultCard}>
                            <View style={styles.resultScore}>
                                <Text style={styles.resultScoreText}>{quizResult.percentage}%</Text>
                            </View>
                            <View style={styles.resultDetails}>
                                <Text style={styles.resultText}>
                                    Correct: {quizResult.score} of {quizResult.total} questions
                                </Text>
                                <Text style={styles.resultDate}>
                                    Completed: {new Date(quizResult.date).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Test Your Knowledge</Text>
                    <TouchableOpacity
                        style={styles.quizButton}
                        onPress={() => router.push(`/screens/quiz?courseId=${courseId}`)}
                    >
                        <Text style={styles.quizButtonText}>
                            {quizResult ? 'Retake Quiz' : 'Take Quiz'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.quizDescription}>
                        {quizResult
                            ? 'Review the material and retake the quiz to improve your score.'
                            : 'Complete a 4-question quiz to test your understanding of this course.'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How to Get Started</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <Text style={styles.stepText}>Review the course materials</Text>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <Text style={styles.stepText}>Take the quiz to test your knowledge</Text>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <Text style={styles.stepText}>Review your results and feedback</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.submitButtonText}>Continue Learning</Text>
                </TouchableOpacity>
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
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: '#a092d3',
    },
    backButton: {
        fontSize: 16,
        color: 'white',
    },
    courseHeaderCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryBadge: {
        fontSize: 14,
        marginBottom: 12,
        color: '#a092d3',
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    ageBadge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    ageBadgeText: {
        fontSize: 12,
        color: '#666',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    section: {
        marginBottom: 24,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
    },
    resultScore: {
        width: 80,
        height: 80,
        backgroundColor: '#4CAF50',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    resultScoreText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    resultDetails: {
        flex: 1,
    },
    resultText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontWeight: '500',
    },
    resultDate: {
        fontSize: 12,
        color: '#999',
    },
    quizButton: {
        backgroundColor: '#a092d3',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    quizButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    quizDescription: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    stepContainer: {
        gap: 12,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    stepNumber: {
        width: 32,
        height: 32,
        backgroundColor: '#a092d3',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingTop: 8,
    },
    submitButton: {
        backgroundColor: '#a092d3',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 16,
        color: '#f44336',
        textAlign: 'center',
    },
});
