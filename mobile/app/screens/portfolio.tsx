import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.56.1:5000/api';

export default function PortfolioScreen() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        checkLoginAndFetchPortfolio();
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const resp = await fetch(`${BACKEND_URL}/courses`);
            if (resp.ok) {
                const data = await resp.json();
                setCourses(data || []);
                return;
            }
        } catch (e) {
            console.warn('Could not fetch courses', e);
        }

        // Fallback: reasonable defaults if backend not available
        setCourses([
            { id: 1, title: 'AI for Kids', description: 'Introductory AI exercises', category: 'learning' },
            { id: 2, title: 'Digital Art with AI', description: 'Create art using AI tools', category: 'learning' },
            { id: 3, title: 'Advanced Machine Learning', description: 'Algorithms and applications', category: 'learning' },
            { id: 4, title: 'Professional Photography with AI', description: 'AI-assisted photography workflows', category: 'photography' },
            { id: 5, title: 'Composition & Lighting', description: 'Fundamentals of composition', category: 'photography' },
        ]);
    };

    const checkLoginAndFetchPortfolio = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');

            if (!token || !userId) {
                setUserLoggedIn(false);
                setLoading(false);
                return;
            }

            setUserLoggedIn(true);

            // Fetch portfolio submissions (server-side stored project uploads)
            const response = await fetch(`${BACKEND_URL}/portfolio/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setSubmissions(data || []);
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            Alert.alert('Error', 'Failed to load portfolio');
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

    if (!userLoggedIn) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>My Portfolio</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.noLoginText}>Please login to view your portfolio</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/auth/login')}
                    >
                        <Text style={styles.loginButtonText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>My Portfolio</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionHeader}>Learning With AI</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Presentation</Text>
                    <Text style={styles.infoText}>
                        Our Learning With AI courses teach fundamentals and practical projects —
                        from introductory exercises to real-world applications. Each course includes
                        short video lessons, step-by-step projects and helpful resources for
                        continuing your journey.
                    </Text>

                    <Text style={styles.infoSubTitle}>Example course highlights</Text>
                    <View style={styles.bullets}>
                        <Text style={styles.bullet}>• AI for Kids — Fun interactive games to learn concepts</Text>
                        <Text style={styles.bullet}>• Digital Art with AI — Create art using simple tools</Text>
                        <Text style={styles.bullet}>• Advanced Machine Learning — Algorithms and applications</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://your-website.example.com/learning')}
                    >
                        <Text style={styles.websiteLink}>Find out more on our website</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionHeader, { marginTop: 12 }]}>Photography Insights</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Presentation</Text>
                    <Text style={styles.infoText}>
                        Photography Insights covers composition, lighting and post-processing using
                        both classical techniques and AI-assisted tools. The material is aimed at
                        improving creativity and building a strong portfolio.
                    </Text>

                    <Text style={styles.infoSubTitle}>Topics covered</Text>
                    <View style={styles.bullets}>
                        <Text style={styles.bullet}>• Composition & framing — make stronger images</Text>
                        <Text style={styles.bullet}>• AI-assisted editing — smart retouching workflows</Text>
                        <Text style={styles.bullet}>• Portfolio tips — present your best work</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://your-website.example.com/photography')}
                    >
                        <Text style={styles.websiteLink}>Find out more on our website</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.websiteNote}>For more submitted projects check the website.</Text>

                {submissions.map((submission: any, index: number) => (
                    <View key={index} style={styles.submissionCard}>
                        <View style={styles.submissionHeader}>
                            <View>
                                <Text style={styles.submissionTitle}>{submission.course_title || 'Project'}</Text>
                                <Text style={styles.submissionDate}>
                                    {submission.uploaded_at ? new Date(submission.uploaded_at).toLocaleDateString() : 'Date not available'}
                                </Text>
                            </View>
                        </View>

                        {submission.grade ? (
                            <View style={styles.gradeSection}>
                                <Text style={styles.gradeLabel}>Grade: </Text>
                                <Text style={[styles.gradeValue, { color: submission.grade >= 7 ? '#4caf50' : '#ff9800' }]}>
                                    {submission.grade}/10
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.gradeSection}>
                                <Text style={styles.gradeLabel}>⏳ Pending grade</Text>
                            </View>
                        )}

                        {submission.feedback && (
                            <View style={styles.feedbackSection}>
                                <Text style={styles.feedbackLabel}>📝 Feedback:</Text>
                                <Text style={styles.feedbackText}>{submission.feedback}</Text>
                            </View>
                        )}

                        <View style={styles.submissionMeta}>
                            <Text style={styles.metaLabel}>Type:</Text>
                            <Text style={styles.metaValue}>{submission.type === 'assignment' ? '📋 Assignment' : '🎯 Project'}</Text>
                        </View>
                    </View>
                ))}
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
    noLoginText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#a092d3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    submissionCount: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    submissionCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    submissionHeader: {
        marginBottom: 12,
    },
    submissionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    submissionDate: {
        fontSize: 12,
        color: '#999',
    },
    gradeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
    },
    gradeLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    gradeValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    feedbackSection: {
        backgroundColor: '#e8f5e9',
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    feedbackLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 5,
    },
    feedbackText: {
        fontSize: 13,
        color: '#1b5e20',
        lineHeight: 20,
    },
    submissionMeta: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 6,
        marginTop: 12,
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 12,
        color: '#666',
        marginRight: 8,
    },
    metaValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    viewButton: {
        backgroundColor: '#a092d3',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
    },
    quizOverview: {
        marginBottom: 12,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
    },
    sectionHeader: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#333' },
    quizCard: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    quizTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
    quizMeta: { fontSize: 13, color: '#666' },
    quizDate: { fontSize: 12, color: '#999', marginTop: 4 },
    websiteNote: { fontSize: 13, color: '#666', marginBottom: 10 },
    insightsArea: { marginBottom: 12 },
    insightCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
    insightText: { fontSize: 13, color: '#666' },
    insightStat: { fontSize: 13, color: '#333', fontWeight: '600', marginBottom: 4 },
    recommend: { marginTop: 8, fontSize: 13, color: '#2e7d32' },
    quizCardTouchable: { borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
    miniBarBackground: { height: 8, backgroundColor: '#eee', borderRadius: 6, marginTop: 8, overflow: 'hidden' },
    miniBarFill: { height: 8, backgroundColor: '#4caf50' },
    /* new informational styles */
    infoCard: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
    infoTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 6 },
    infoText: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 10 },
    infoSubTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
    bullets: { marginBottom: 10 },
    bullet: { fontSize: 13, color: '#444', marginBottom: 4 },
    websiteLink: { color: '#a092d3', fontWeight: '700', marginTop: 6 },
});
