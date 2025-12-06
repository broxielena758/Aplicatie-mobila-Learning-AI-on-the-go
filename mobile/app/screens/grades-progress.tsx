import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuizResult {
    courseId: string;
    courseName: string;
    grade: number;
    percentage: number;
    feedback: string;
    completedAt: string;
}

export default function GradesProgressScreen() {
    const router = useRouter();
    const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProgress, setTotalProgress] = useState(0);
    const [averageGrade, setAverageGrade] = useState(0);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            const results = await AsyncStorage.getItem('quizResults');
            if (results) {
                const parsed = JSON.parse(results);
                setQuizResults(parsed);

                // Calculate average
                if (parsed.length > 0) {
                    const totalGrade = parsed.reduce((sum: number, r: QuizResult) => sum + r.grade, 0);
                    const avg = Math.round(totalGrade / parsed.length);
                    setAverageGrade(avg);
                    setTotalProgress(Math.round((parsed.length / 10) * 100)); // Assume 10 courses max
                }
            }
        } catch (error) {
            console.error('Error loading results:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearResults = async () => {
        await AsyncStorage.removeItem('quizResults');
        setQuizResults([]);
        setAverageGrade(0);
    };

    const deleteResult = async (index: number) => {
        try {
            const resultsRaw = await AsyncStorage.getItem('quizResults');
            if (!resultsRaw) return;
            const parsed = JSON.parse(resultsRaw);
            if (!Array.isArray(parsed)) return;
            parsed.splice(index, 1);
            await AsyncStorage.setItem('quizResults', JSON.stringify(parsed));
            setQuizResults(parsed);

            // Recalculate summary
            if (parsed.length === 0) {
                setAverageGrade(0);
                setTotalProgress(0);
            } else {
                const totalGrade = parsed.reduce((sum: number, r: QuizResult) => sum + r.grade, 0);
                const avg = Math.round(totalGrade / parsed.length);
                setAverageGrade(avg);
                setTotalProgress(Math.round((parsed.length / 10) * 100));
            }
        } catch (error) {
            console.error('Error deleting result:', error);
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Grades & Progress</Text>
            </View>

            <View style={styles.content}>
                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Average Grade</Text>
                        <View style={styles.gradeBadge}>
                            <Text style={styles.gradeNumber}>{averageGrade}</Text>
                            <Text style={styles.gradeMax}>/10</Text>
                        </View>
                        <Text style={styles.summaryText}>
                            {averageGrade >= 7 ? '⭐ Excellent!' : averageGrade >= 5 ? '👍 Good Progress' : '📚 Keep Learning'}
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Courses Completed</Text>
                        <View style={styles.completedBadge}>
                            <Text style={styles.completedNumber}>{quizResults.length}</Text>
                        </View>
                        <Text style={styles.summaryText}>Courses</Text>
                    </View>
                </View>

                {/* Overall Progress Bar */}
                <View style={styles.progressSection}>
                    <Text style={styles.progressTitle}>Overall Progress</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${totalProgress}%` }]} />
                    </View>
                    <Text style={styles.progressPercent}>{totalProgress}% Complete</Text>
                </View>

                {/* Quiz Results List */}
                <Text style={styles.resultsTitle}>Quiz Results</Text>

                {quizResults.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No quiz results yet</Text>
                        <Text style={styles.emptySubtext}>
                            Complete quizzes in "Learning on the Go" to see your grades and progress here.
                        </Text>
                    </View>
                ) : (
                    <>
                        {quizResults.map((result, index) => {
                            const date = new Date(result.completedAt);
                            const dateStr = date.toLocaleDateString();

                            return (
                                <View key={index} style={styles.resultCard}>
                                    <View style={styles.resultHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.resultCourse}>{result.courseName}</Text>
                                            <Text style={styles.resultDate}>{dateStr}</Text>
                                        </View>
                                        <View style={[styles.resultGradeBadge, { backgroundColor: result.grade >= 7 ? '#4caf50' : '#ff9800' }]}>
                                            <Text style={styles.resultGrade}>{result.grade}/10</Text>
                                        </View>
                                    </View>

                                    <View style={styles.percentageBar}>
                                        <View style={[styles.percentageFill, { width: `${result.percentage}%`, backgroundColor: result.percentage >= 80 ? '#4caf50' : result.percentage >= 60 ? '#ff9800' : '#f44336' }]} />
                                    </View>
                                    <Text style={styles.percentageText}>{result.percentage}% Correct</Text>

                                    <View style={styles.feedbackBox}>
                                        <Text style={styles.feedbackText}>{result.feedback}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteResult(index)}>
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}

                        <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
                            <Text style={styles.clearButtonText}>Clear All Results</Text>
                        </TouchableOpacity>
                    </>
                )}
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
    summaryContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
        fontWeight: '600',
    },
    gradeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    gradeNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#a092d3',
    },
    gradeMax: {
        fontSize: 14,
        color: '#999',
        marginLeft: 3,
    },
    completedBadge: {
        marginBottom: 8,
    },
    completedNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    summaryText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    progressSection: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 25,
        elevation: 2,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    progressPercent: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    resultCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    resultCourse: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },
    resultDate: {
        fontSize: 11,
        color: '#999',
    },
    resultGradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultGrade: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    percentageBar: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 5,
    },
    percentageFill: {
        height: '100%',
    },
    percentageText: {
        fontSize: 11,
        color: '#999',
        marginBottom: 10,
    },
    feedbackBox: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#a092d3',
    },
    feedbackText: {
        fontSize: 12,
        color: '#555',
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
    },
    clearButton: {
        backgroundColor: '#ff6b6b',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#e53935',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
