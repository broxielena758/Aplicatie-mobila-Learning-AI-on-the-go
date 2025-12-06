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
import { Buffer } from 'buffer';
import { AppState } from 'react-native';

const BACKEND_URL = 'http://192.168.56.1:5000/api';

export default function ContestsScreen() {
    const router = useRouter();
    const [contests, setContests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizState, setQuizState] = useState<any>(null);
    const [userAge, setUserAge] = useState<number | null>(null);
    const [localResults, setLocalResults] = useState<any[]>([]);

    useEffect(() => {
        fetchContests();
        getCachedAge();
        loadLocalResults();
        const sub = AppState.addEventListener('change', handleAppStateChange);
        return () => sub.remove();
    }, []);

    const loadLocalResults = async () => {
        try {
            const raw = await AsyncStorage.getItem('contestQuizResults');
            if (raw) setLocalResults(JSON.parse(raw));
        } catch (e) {
            console.warn('Could not load local contest results', e);
        }
    };

    const handleAppStateChange = (nextState: string) => {
        if (nextState === 'active') {
            // attempt background sync when app becomes active
            syncUnsyncedResults();
        }
    };

    const syncUnsyncedResults = async () => {
        try {
            const raw = await AsyncStorage.getItem('contestQuizResults');
            if (!raw) return;
            const entries = JSON.parse(raw) as any[];
            const unsynced = entries.filter(e => !e.synced);
            if (unsynced.length === 0) return;

            const token = await AsyncStorage.getItem('token');
            for (const entry of unsynced) {
                try {
                    const resp = await fetch(`${BACKEND_URL}/contest/quiz-submit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ user_id: entry.user_id, contest_id: entry.contest_id, score: entry.score, total: entry.total, percentage: entry.percentage, prize: entry.prize }),
                    });

                    if (resp.ok) {
                        // mark this entry as synced in storage
                        entry.synced = true;
                    }
                } catch (e) {
                    console.warn('Sync failed for entry', entry.id, e);
                }
            }

            // persist updated list
            await AsyncStorage.setItem('contestQuizResults', JSON.stringify(entries));
            setLocalResults(entries);
        } catch (e) {
            console.warn('Error during syncUnsyncedResults', e);
        }
    };

    const getCachedAge = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const p = decodeJwtPayload(token);
                if (p && (p.age || p.age === 0)) {
                    setUserAge(Number(p.age));
                    return;
                }
                // try profile fallback
                try {
                    const resp = await fetch(`${BACKEND_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
                    if (resp.ok) {
                        const profile = await resp.json();
                        if (profile && profile.dob) {
                            setUserAge(calculateAge(profile.dob));
                            return;
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }

            const ageStr = await AsyncStorage.getItem('age');
            if (ageStr) setUserAge(parseInt(ageStr));
        } catch (e) {
            console.warn('Age detection failed', e);
        }
    };

    const calculateAge = (dob: string) => {
        try {
            const b = new Date(dob);
            const t = new Date();
            let age = t.getFullYear() - b.getFullYear();
            if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
            return age;
        } catch (e) {
            return null;
        }
    };

    const decodeJwtPayload = (token: string) => {
        try {
            const p = token.split('.')[1];
            const base64 = p.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = Buffer.from(base64, 'base64').toString('utf8');
            return JSON.parse(decoded);
        } catch (e) {
            return null;
        }
    };

    const fetchContests = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/contest/available/1`);
            if (response.ok) {
                const data = await response.json();
                setContests(data || []);
            }
        } catch (error) {
            console.error('Error fetching contests:', error);
            Alert.alert('Error', 'Failed to load contests');
        } finally {
            setLoading(false);
        }
    };

    const startQuizForContest = async (contest: any) => {
        // Ensure login
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) {
            Alert.alert('Login required', 'Please login to participate in contests', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/auth/login') },
            ]);
            return;
        }

        // Determine age group
        let age = userAge;
        if (age === null) {
            const p = decodeJwtPayload(token);
            if (p && (p.age || p.age === 0)) age = Number(p.age);
        }
        // fallback to under14 if unknown (conservative)
        const group = age != null && age < 14 ? 'under14' : 'over14';

        // Simple invented quizzes per age group
        const questionsUnder14 = [
            { q: 'Which of these is a camera part?', a: ['Lens', 'Keyboard', 'Battery pack'], correct: 0 },
            { q: 'AI helps with:', a: ['Making cookies', 'Suggesting edits to photos', 'Washing dishes'], correct: 1 },
            { q: 'A good photo has:', a: ['Blurred subject', 'Good lighting', 'No subject'], correct: 1 },
        ];

        const questionsOver14 = [
            { q: 'Which algorithm is commonly used for classification?', a: ['Linear Regression', 'K-Nearest Neighbors', 'PCA'], correct: 1 },
            { q: 'White balance affects:', a: ['Exposure time', 'Color tones', 'File size'], correct: 1 },
            { q: 'Which metric measures accuracy?', a: ['Precision', 'Resolution', 'ISO'], correct: 0 },
        ];

        const questions = group === 'under14' ? questionsUnder14 : questionsOver14;

        setQuizState({ contestId: contest.id, questions, index: 0, correct: 0, userId });
        setShowQuiz(true);
    };

    const answerCurrent = async (choiceIndex: number) => {
        if (!quizState) return;
        const { questions, index, correct } = quizState;
        const q = questions[index];
        const isCorrect = q.correct === choiceIndex;
        const next = index + 1;
        const newCorrect = correct + (isCorrect ? 1 : 0);

        if (next >= questions.length) {
            // finished
            const score = newCorrect;
            const total = questions.length;
            const percentage = Math.round((score / total) * 100);
            // simple prize logic
            let prize = 'Participation badge';
            if (percentage >= 90) prize = 'Gold voucher';
            else if (percentage >= 70) prize = 'Silver voucher';
            else if (percentage >= 50) prize = 'Bronze voucher';

            // Save locally first
            const attemptedAt = new Date().toISOString();
            const userId = await AsyncStorage.getItem('userId');
            const localEntry = {
                id: `${quizState.contestId}_${Date.now()}`,
                user_id: userId || null,
                contest_id: quizState.contestId,
                score,
                total,
                percentage,
                prize,
                attempted_at: attemptedAt,
                synced: false,
            };

            try {
                const existingRaw = await AsyncStorage.getItem('contestQuizResults');
                const existing = existingRaw ? JSON.parse(existingRaw) : [];
                existing.unshift(localEntry);
                await AsyncStorage.setItem('contestQuizResults', JSON.stringify(existing));
                setLocalResults(existing);
            } catch (e) {
                console.warn('Could not save local contest result', e);
            }

            // Attempt to persist to backend; if success, update local entry `synced` flag
            try {
                const token = await AsyncStorage.getItem('token');
                const resp = await fetch(`${BACKEND_URL}/contest/quiz-submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ user_id: localEntry.user_id, contest_id: localEntry.contest_id, score, total, percentage, prize }),
                });

                if (resp.ok) {
                    // mark synced
                    const updatedRaw = await AsyncStorage.getItem('contestQuizResults');
                    const updated = updatedRaw ? JSON.parse(updatedRaw) : [];
                    const idx = updated.findIndex((r: any) => r.id === localEntry.id || (r.contest_id === localEntry.contest_id && r.attempted_at === localEntry.attempted_at));
                    if (idx >= 0) {
                        updated[idx].synced = true;
                        await AsyncStorage.setItem('contestQuizResults', JSON.stringify(updated));
                        setLocalResults(updated);
                    }
                } else {
                    console.warn('Failed to sync contest quiz result to backend');
                }
            } catch (e) {
                console.warn('Could not persist quiz result to backend', e);
            }

            setShowQuiz(false);
            setQuizState(null);
            Alert.alert('Quiz complete', `Score: ${score}/${total} — Prize: ${prize}`);
            fetchContests();
            return;
        }

        setQuizState({ ...quizState, index: next, correct: newCorrect });
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
                <Text style={styles.title}>Contests</Text>
            </View>

            <View style={styles.content}>
                {contests.length === 0 ? (
                    <Text style={styles.noContestsText}>No contests available</Text>
                ) : (
                    <>
                        <Text style={styles.contestCount}>{contests.length} active contests</Text>
                        {contests.map((contest) => (
                            <View key={contest.id} style={styles.contestCard}>
                                <Text style={styles.contestTitle}>{contest.title}</Text>
                                <Text style={styles.contestDescription}>{contest.description}</Text>

                                <View style={styles.infoRow}>
                                    <View style={styles.infoPart}>
                                        <Text style={styles.infoLabel}>Prize</Text>
                                        <Text style={styles.infoPrize}>{contest.prize || 'Various'}</Text>
                                    </View>
                                    <View style={styles.infoPart}>
                                        <Text style={styles.infoLabel}>Deadline</Text>
                                        <Text style={styles.infoValue}>{contest.deadline || 'TBA'}</Text>
                                    </View>
                                </View>

                                <View style={styles.participantsRow}>
                                    <Text style={styles.participantsText}>
                                        👥 {contest.participants || 0} participants
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.joinButton}
                                    onPress={() => startQuizForContest(contest)}
                                >
                                    <Text style={styles.joinButtonText}>Take Contest Quiz</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}

                {/* Local attempts / sync area */}
                <View style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 8 }}>My Attempts</Text>
                    {localResults.length === 0 ? (
                        <Text style={{ color: '#666' }}>No attempts yet</Text>
                    ) : (
                        localResults.map((r) => (
                            <View key={r.id} style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                                <Text style={{ fontWeight: '700' }}>{r.contest_id ? `Contest ${r.contest_id}` : 'Contest'}</Text>
                                <Text style={{ color: '#666' }}>{new Date(r.attempted_at).toLocaleString()}</Text>
                                <Text style={{ marginTop: 6 }}>Score: {r.score}/{r.total} — {r.percentage}%</Text>
                                <Text style={{ marginTop: 6, color: r.synced ? '#2e7d32' : '#ff9800' }}>{r.synced ? 'Synced' : 'Pending sync'}</Text>
                            </View>
                        ))
                    )}

                    <TouchableOpacity style={[styles.joinButton, { marginTop: 8 }]} onPress={syncUnsyncedResults}>
                        <Text style={styles.joinButtonText}>Sync Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Quiz UI */}
                {showQuiz && quizState && (
                    <View style={styles.quizOverlay}>
                        <Text style={styles.quizQuestion}>{quizState.questions[quizState.index].q}</Text>
                        {quizState.questions[quizState.index].a.map((opt: string, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.quizOption}
                                onPress={() => answerCurrent(idx)}
                            >
                                <Text style={styles.quizOptionText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.cancelQuiz} onPress={() => { setShowQuiz(false); setQuizState(null); }}>
                            <Text style={{ color: '#a092d3' }}>Cancel Quiz</Text>
                        </TouchableOpacity>
                    </View>
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
    noContestsText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 30,
    },
    contestCount: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    contestCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    contestTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    contestDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    infoPart: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#999',
        marginBottom: 4,
    },
    infoPrize: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    infoValue: {
        fontSize: 13,
        color: '#333',
    },
    participantsRow: {
        marginBottom: 12,
    },
    participantsText: {
        fontSize: 12,
        color: '#666',
    },
    joinButton: {
        backgroundColor: '#a092d3',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    quizOverlay: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginTop: 12 },
    quizQuestion: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
    quizOption: { padding: 12, backgroundColor: '#f7f7f7', borderRadius: 8, marginBottom: 8 },
    quizOptionText: { fontSize: 14, color: '#333' },
    cancelQuiz: { marginTop: 10, alignItems: 'center' },
});
