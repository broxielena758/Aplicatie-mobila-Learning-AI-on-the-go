import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CoursePageTemplate({ title, subtitle, sections, courseId }: any) {
    const router = useRouter();
    const [progress, setProgress] = useState<number | null>(null);
    const [result, setResult] = useState<any>(null);
    const anim = useRef(new Animated.Value(0)).current;

    const loadProgress = async () => {
        if (!courseId) {
            setProgress(null);
            setResult(null);
            return;
        }
        try {
            const raw = await AsyncStorage.getItem('quizResults');
            if (!raw) {
                setProgress(null);
                setResult(null);
                return;
            }
            const results = JSON.parse(raw);
            const r = results[String(courseId)];
            if (r) {
                const pct = r.percentage ?? (r.total ? Math.round((r.score / r.total) * 100) : null);
                setProgress(pct ?? null);
                setResult(r);
                // animate
                Animated.timing(anim, { toValue: pct ?? 0, duration: 600, useNativeDriver: false }).start();
            } else {
                setProgress(null);
                setResult(null);
            }
        } catch (e) {
            setProgress(null);
            setResult(null);
        }
    };

    // load on mount and on courseId change
    useEffect(() => {
        loadProgress();
        const t = setTimeout(loadProgress, 800);
        return () => clearTimeout(t);
    }, [courseId]);

    // refresh when screen regains focus
    useFocusEffect(
        useCallback(() => {
            loadProgress();
        }, [courseId])
    );

    // if progress updates later, animate from current value to new value
    useEffect(() => {
        if (progress === null) {
            Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: false }).start();
            return;
        }
        Animated.timing(anim, { toValue: progress, duration: 600, useNativeDriver: false }).start();
    }, [progress]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>

            <View style={styles.content}>
                {/* Progress area */}
                {typeof courseId !== 'undefined' && (
                    <View style={styles.progressArea}>
                        <Text style={styles.progressLabel}>Quiz Progress</Text>
                        {progress === null ? (
                            <Text style={styles.progressText}>Not attempted yet</Text>
                        ) : (
                            <View style={styles.progressRow}>
                                <View style={styles.progressBarBackground}>
                                    <Animated.View
                                        style={[
                                            styles.progressBarFill,
                                            { width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressPercent}>{progress}%</Text>
                            </View>
                        )}
                        {result && (
                            <View style={styles.resultMeta}>
                                <Text style={styles.resultText}>Score: {result.score} / {result.total}</Text>
                                {result.date && (
                                    <Text style={styles.resultDate}>Completed: {new Date(result.date).toLocaleString()}</Text>
                                )}
                            </View>
                        )}
                    </View>
                )}

                {sections?.map((s: any, i: number) => (
                    <View key={i} style={styles.section}>
                        <Text style={styles.sectionTitle}>{s.title}</Text>
                        <Text style={styles.sectionText}>{s.text}</Text>
                    </View>
                ))}
                {courseId && (
                    <View style={styles.quizWrapper}>
                        <TouchableOpacity
                            style={styles.quizButton}
                            onPress={() => (router as any).push(`/screens/quiz?courseId=${courseId}`)}
                        >
                            <Text style={styles.quizButtonText}>Take Quiz</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#a092d3', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 },
    back: { color: '#fff', marginBottom: 8 },
    title: { color: '#fff', fontSize: 22, fontWeight: '700' },
    subtitle: { color: '#fff', opacity: 0.9, marginTop: 6 },
    content: { padding: 16 },
    section: { marginBottom: 14, backgroundColor: '#fff', padding: 12, borderRadius: 8 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    sectionText: { fontSize: 14, color: '#444', lineHeight: 20 },
    quizWrapper: { paddingTop: 12, alignItems: 'center' },
    quizButton: { backgroundColor: '#a092d3', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
    quizButtonText: { color: 'white', fontWeight: '700' },
    progressArea: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 8, margin: 16 },
    progressLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#333' },
    progressText: { fontSize: 13, color: '#666' },
    progressRow: { flexDirection: 'row', alignItems: 'center' },
    progressBarBackground: { flex: 1, height: 12, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden', marginRight: 10 },
    progressBarFill: { height: 12, backgroundColor: '#4caf50' },
    progressPercent: { width: 46, textAlign: 'right', fontWeight: '700', color: '#333' },
    resultMeta: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    resultText: { fontSize: 13, color: '#444', fontWeight: '600' },
    resultDate: { fontSize: 12, color: '#777', marginTop: 4 },
});
