import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.56.1:5000/api';
const SCREEN_WIDTH = Dimensions.get('window').width;

// Quiz questions based on courses
const COURSE_LESSONS: Record<string, any> = {
    1: {
        title: 'AI Fundamentals',
        description: 'Master the basics of AI',
        lessons: [
            {
                id: 'lesson1',
                title: 'What is AI?',
                content: 'Artificial Intelligence is the simulation of human intelligence by machines, especially computer systems. AI can learn from experience, identify patterns, and perform tasks without explicit programming.',
                duration: '5 min read',
            },
            {
                id: 'lesson2',
                title: 'Types of AI',
                content: 'There are 3 types: Narrow AI (designed for specific tasks), General AI (can understand multiple domains), and Super AI (theoretical). Most AI today is Narrow AI.',
                duration: '6 min read',
            },
            {
                id: 'lesson3',
                title: 'AI in Daily Life',
                content: 'AI powers: voice assistants, image recognition, recommendation systems, autonomous vehicles, and much more. You interact with AI every day!',
                duration: '5 min read',
            },
        ],
        quiz: [
            {
                id: 'q1',
                question: 'What does AI stand for?',
                options: ['Automated Internet', 'Artificial Intelligence', 'Advanced Integration', 'Artificial Integration'],
                correct: 1,
                explanation: 'AI stands for Artificial Intelligence - the simulation of human intelligence by machines.',
            },
            {
                id: 'q2',
                question: 'Which is a type of AI?',
                options: ['Super Internet', 'Narrow AI', 'Social AI', 'Network AI'],
                correct: 1,
                explanation: 'Narrow AI is designed for specific tasks and is what we use today.',
            },
            {
                id: 'q3',
                question: 'What can AI learn from?',
                options: ['Only humans', 'Experience and data', 'Code only', 'Nothing'],
                correct: 1,
                explanation: 'AI can learn from experience and data through machine learning algorithms.',
            },
        ],
    },
    4: {
        title: 'Mentimeter & Presentations',
        description: 'Create engaging presentations',
        lessons: [
            {
                id: 'lesson1',
                title: 'What is Mentimeter?',
                content: 'Mentimeter is a presentation software that lets you create interactive slideshows with live polls, quizzes, and word clouds. Engage your audience in real time!',
                duration: '5 min read',
            },
            {
                id: 'lesson2',
                title: 'Creating Polls',
                content: 'Mentimeter allows you to add interactive polls to your presentations. Your audience responds from their devices and results show live, making presentations more engaging.',
                duration: '6 min read',
            },
            {
                id: 'lesson3',
                title: 'School Project Presentations',
                content: 'Use Mentimeter for school projects to make them interactive. Quiz your classmates, collect feedback, and make learning fun with live polling.',
                duration: '5 min read',
            },
        ],
        quiz: [
            {
                id: 'q1',
                question: 'What does Mentimeter do?',
                options: ['Social media', 'Interactive presentations with polls', 'Video editing', 'Document writing'],
                correct: 1,
                explanation: 'Mentimeter creates interactive presentations with live polls, quizzes, and word clouds.',
            },
            {
                id: 'q2',
                question: 'How do audience members respond?',
                options: ['Shouting', 'From their devices', 'Sending emails', 'Writing on paper'],
                correct: 1,
                explanation: 'Audience members respond to polls and quizzes using their own devices.',
            },
            {
                id: 'q3',
                question: 'What makes presentations more engaging?',
                options: ['Longer slides', 'More text', 'Interactive polls and quizzes', 'No visuals'],
                correct: 2,
                explanation: 'Interactive polls and quizzes keep audiences engaged and participating.',
            },
        ],
    },
};

export default function LearningJourneyScreen() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userAge, setUserAge] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const age = await AsyncStorage.getItem('age');
            if (age) setUserAge(parseInt(age));

            const response = await fetch(`${BACKEND_URL}/courses`);
            if (response.ok) {
                const data = await response.json();
                const learningCourses = data.filter((c: any) => c.category === 'learning');
                setCourses(learningCourses);
            }

            // Load saved progress
            const savedProgress = await AsyncStorage.getItem('lessonProgress');
            if (savedProgress) setLessonProgress(JSON.parse(savedProgress));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveProgress = async (courseId: string, progress: number) => {
        const newProgress = { ...lessonProgress, [courseId]: progress };
        setLessonProgress(newProgress);
        await AsyncStorage.setItem('lessonProgress', JSON.stringify(newProgress));
    };

    const handleAnswerQuestion = (questionId: string, optionIndex: number) => {
        setQuizAnswers({ ...quizAnswers, [questionId]: optionIndex });
    };

    const calculateQuizScore = () => {
        if (!selectedCourse) return { percentage: 0, correct: 0, total: 0, grade: 0 };
        const courseLesson = COURSE_LESSONS[selectedCourse];
        let correct = 0;

        courseLesson.quiz.forEach((q: any) => {
            if (quizAnswers[q.id] === q.correct) {
                correct++;
            }
        });

        const percentage = Math.round((correct / courseLesson.quiz.length) * 100);
        const grade = Math.round((percentage / 10)); // Convert to 1-10 scale
        return { percentage, correct, total: courseLesson.quiz.length, grade };
    };

    const handleCompleteQuiz = async () => {
        if (!selectedCourse) return;
        const { percentage, grade } = calculateQuizScore();
        setQuizCompleted(true);

        // Generate automatic feedback
        let feedback = '';
        if (percentage === 100) {
            feedback = '🎉 Perfect score! You have mastered this topic completely!';
        } else if (percentage >= 80) {
            feedback = '⭐ Excellent! You have a strong understanding of this material.';
        } else if (percentage >= 60) {
            feedback = '👍 Good job! Review the topics you missed to improve further.';
        } else {
            feedback = '📚 Keep practicing! Review all lessons again for better understanding.';
        }

        // Save grade and feedback to AsyncStorage
        const quizResults = {
            courseId: selectedCourse,
            courseName: courses.find(c => c.id.toString() === selectedCourse)?.title || 'Course',
            grade,
            percentage,
            feedback,
            completedAt: new Date().toISOString(),
        };

        const existing = await AsyncStorage.getItem('quizResults');
        const results = existing ? JSON.parse(existing) : [];
        results.push(quizResults);
        await AsyncStorage.setItem('quizResults', JSON.stringify(results));

        // Update progress to 100%
        await saveProgress(selectedCourse, 100);

        Alert.alert('Quiz Complete!', `Score: ${percentage}%\n\n${feedback}`);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#a092d3" />
            </View>
        );
    }

    // Filter courses based on age
    const userAgeGroup = userAge && userAge <= 13 ? 'under14' : (userAge ? 'over14' : null);
    const filteredCourses = !userAge
        ? courses
        : userAgeGroup === 'under14'
            ? courses.filter(c => c.age_group === 'under14')
            : courses;

    // If course is selected
    if (selectedCourse && COURSE_LESSONS[selectedCourse]) {
        const lesson = COURSE_LESSONS[selectedCourse];
        const progress = lessonProgress[selectedCourse] || 0;

        if (quizStarted && !quizCompleted) {
            const quiz = lesson.quiz;
            const currentQ = quiz[Object.keys(quizAnswers).length];

            if (Object.keys(quizAnswers).length === quiz.length) {
                return (
                    <ScrollView style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => setSelectedCourse(null)}>
                                <Text style={styles.backButton}>← Back</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Quiz Results</Text>
                        </View>
                        <View style={styles.content}>
                            {(() => {
                                const { percentage, correct, total, grade } = calculateQuizScore();
                                const feedback = quizAnswers ? percentage === 100 ? '🎉 Perfect!' : percentage >= 80 ? '⭐ Excellent!' : percentage >= 60 ? '👍 Good!' : '📚 Keep trying!' : '';

                                return (
                                    <View style={styles.resultsContainer}>
                                        <Text style={styles.resultsTitle}>{feedback}</Text>
                                        <View style={styles.scoreCircle}>
                                            <Text style={styles.scoreText}>{percentage}%</Text>
                                        </View>
                                        <Text style={styles.scoreDetail}>
                                            You got {correct} out of {total} questions correct
                                        </Text>
                                        <Text style={styles.gradeText}>
                                            Grade: <Text style={{ fontWeight: 'bold', color: grade >= 7 ? '#4caf50' : '#ff9800' }}>{grade}/10</Text>
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.completeButton}
                                            onPress={handleCompleteQuiz}
                                        >
                                            <Text style={styles.completeButtonText}>Save Results</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.retryButton}
                                            onPress={() => {
                                                setQuizAnswers({});
                                                setCurrentLessonIndex(0);
                                            }}
                                        >
                                            <Text style={styles.retryButtonText}>Retry Quiz</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })()}
                        </View>
                    </ScrollView>
                );
            }

            return (
                <ScrollView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setSelectedCourse(null)}>
                            <Text style={styles.backButton}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Quiz: {lesson.title}</Text>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${((Object.keys(quizAnswers).length + 1) / (quiz.length + 1)) * 100}%` },
                                ]}
                            />
                        </View>
                        <Text style={styles.questionCount}>
                            Question {Object.keys(quizAnswers).length + 1} of {quiz.length}
                        </Text>

                        {currentQ && (
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>{currentQ.question}</Text>
                                {currentQ.options.map((option: string, idx: number) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[
                                            styles.optionButton,
                                            quizAnswers[currentQ.id] === idx && styles.optionButtonSelected,
                                        ]}
                                        onPress={() => handleAnswerQuestion(currentQ.id, idx)}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.nextButton, !quizAnswers[currentQ?.id] && styles.buttonDisabled]}
                            onPress={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                            disabled={!quizAnswers[currentQ?.id]}
                        >
                            <Text style={styles.nextButtonText}>
                                {Object.keys(quizAnswers).length === quiz.length - 1 ? 'Submit' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        }

        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedCourse(null)}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{lesson.title}</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>Progress: {progress}% Complete</Text>

                    {currentLessonIndex < lesson.lessons.length ? (
                        <>
                            <View style={styles.lessonCard}>
                                <Text style={styles.lessonTitle}>{lesson.lessons[currentLessonIndex].title}</Text>
                                <Text style={styles.lessonDuration}>{lesson.lessons[currentLessonIndex].duration}</Text>
                                <Text style={styles.lessonContent}>{lesson.lessons[currentLessonIndex].content}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => {
                                    const newProgress = Math.round(((currentLessonIndex + 1) / lesson.lessons.length) * 100);
                                    saveProgress(selectedCourse, newProgress);
                                    setCurrentLessonIndex(currentLessonIndex + 1);
                                }}
                            >
                                <Text style={styles.nextButtonText}>Next Lesson</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.completionCard}>
                                <Text style={styles.completionTitle}>📚 All lessons completed!</Text>
                                <Text style={styles.completionText}>
                                    You've finished all {lesson.lessons.length} lessons. Now take the quiz to test your knowledge!
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.quizButton}
                                onPress={() => {
                                    setQuizStarted(true);
                                    setCurrentLessonIndex(0);
                                }}
                            >
                                <Text style={styles.quizButtonText}>Start Quiz ({lesson.quiz.length} questions)</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        );
    }

    // Show course selection
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Learning on the Go</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Interactive lessons & quizzes with auto-grading</Text>

                {filteredCourses.map((course) => {
                    const progress = lessonProgress[course.id.toString()] || 0;
                    const hasLesson = COURSE_LESSONS[course.id];

                    if (!hasLesson) return null;

                    return (
                        <TouchableOpacity
                            key={course.id}
                            style={styles.courseCard}
                            onPress={() => {
                                setSelectedCourse(course.id.toString());
                                setCurrentLessonIndex(0);
                                setQuizStarted(false);
                                setQuizAnswers({});
                                setQuizCompleted(false);
                            }}
                        >
                            <View style={styles.courseHeader}>
                                <View>
                                    <Text style={styles.courseTitleCard}>{course.title}</Text>
                                    <Text style={styles.courseSubtitle}>{COURSE_LESSONS[course.id].description}</Text>
                                </View>
                                {progress === 100 && <Text style={styles.completedBadge}>✅</Text>}
                            </View>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${progress}%` }]} />
                            </View>
                            <Text style={styles.progressLabel}>{progress}% Complete</Text>
                        </TouchableOpacity>
                    );
                })}
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
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    courseCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    courseTitleCard: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        flex: 1,
    },
    courseSubtitle: {
        fontSize: 12,
        color: '#999',
    },
    completedBadge: {
        fontSize: 20,
        marginLeft: 10,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    progressLabel: {
        fontSize: 12,
        color: '#999',
    },
    lessonCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    lessonTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    lessonDuration: {
        fontSize: 12,
        color: '#a092d3',
        fontWeight: '600',
        marginBottom: 15,
    },
    lessonContent: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    completionCard: {
        backgroundColor: '#e8f5e9',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    completionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 10,
    },
    completionText: {
        fontSize: 14,
        color: '#1b5e20',
        lineHeight: 20,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
    questionContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    optionButton: {
        padding: 15,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    optionButtonSelected: {
        borderColor: '#a092d3',
        backgroundColor: '#f3e5f5',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    questionCount: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#a092d3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizButton: {
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    quizButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    scoreCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#a092d3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
    },
    scoreDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    gradeText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    completeButton: {
        backgroundColor: '#4caf50',
        padding: 12,
        borderRadius: 8,
        width: 200,
        alignItems: 'center',
        marginBottom: 10,
    },
    completeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    retryButton: {
        backgroundColor: '#ff9800',
        padding: 12,
        borderRadius: 8,
        width: 200,
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});
