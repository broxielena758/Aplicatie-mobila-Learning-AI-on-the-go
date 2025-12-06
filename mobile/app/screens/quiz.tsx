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

interface Quiz {
    id: string;
    questions: Question[];
}

interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
}

// Quiz content for all 12 courses
const QUIZZES: { [key: number]: Quiz } = {
    // Under14 Courses
    1: {
        id: '1',
        questions: [
            {
                id: '1-1',
                text: 'What is Microsoft Designer used for?',
                options: [
                    'Creating graphics and design templates',
                    'Writing documents',
                    'Making spreadsheets',
                    'Editing videos',
                ],
                correctAnswer: 0,
            },
            {
                id: '1-2',
                text: 'Which AI feature helps you create designs quickly?',
                options: ['Spell check', 'Designer templates', 'Auto-save', 'Cloud sync'],
                correctAnswer: 1,
            },
            {
                id: '1-3',
                text: 'Can you customize Microsoft Designer templates?',
                options: ['No, templates are fixed', 'Yes, fully customizable', 'Only colors', 'Only text'],
                correctAnswer: 1,
            },
            {
                id: '1-4',
                text: 'What file format can you export from Microsoft Designer?',
                options: ['Only PDF', 'PNG, JPG, PDF', 'Only PNG', 'Only SVG'],
                correctAnswer: 1,
            },
        ],
    },
    2: {
        id: '2',
        questions: [
            {
                id: '2-1',
                text: 'What are the key elements of graphic design?',
                options: [
                    'Color, typography, composition',
                    'Only colors',
                    'Only fonts',
                    'Only images',
                ],
                correctAnswer: 0,
            },
            {
                id: '2-2',
                text: 'Why is color theory important in graphic design?',
                options: [
                    'It makes designs more expensive',
                    'It creates visual harmony and emotional impact',
                    'It reduces file size',
                    'It speeds up loading',
                ],
                correctAnswer: 1,
            },
            {
                id: '2-3',
                text: 'What is the rule of thirds in design composition?',
                options: [
                    'Divide the design into 3 equal parts',
                    'Use 3 colors maximum',
                    'Divide into 9 parts to place key elements',
                    'Place content in 3 rows',
                ],
                correctAnswer: 2,
            },
            {
                id: '2-4',
                text: 'Which font style is best for body text?',
                options: ['Decorative fonts', 'Sans-serif fonts', 'Handwriting fonts', 'Emoji'],
                correctAnswer: 1,
            },
        ],
    },
    3: {
        id: '3',
        questions: [
            {
                id: '3-1',
                text: 'What defines an advanced graphic design project?',
                options: [
                    'Uses more colors',
                    'Complex layouts, multiple elements, brand consistency',
                    'Larger file size',
                    'Takes longer to open',
                ],
                correctAnswer: 1,
            },
            {
                id: '3-2',
                text: 'What is a design system?',
                options: [
                    'A software program',
                    'A set of rules for consistent visual design',
                    'A cloud storage service',
                    'A payment method',
                ],
                correctAnswer: 1,
            },
            {
                id: '3-3',
                text: 'How do you maintain brand consistency across designs?',
                options: [
                    'Use random colors each time',
                    'Follow brand guidelines for colors, fonts, and style',
                    'Copy-paste everything',
                    'Use the default settings',
                ],
                correctAnswer: 1,
            },
            {
                id: '3-4',
                text: 'What is white space in design?',
                options: [
                    'Empty areas without content',
                    'Intentional spacing that creates visual balance',
                    'Wasted space',
                    'A light gray color',
                ],
                correctAnswer: 1,
            },
        ],
    },
    4: {
        id: '4',
        questions: [
            {
                id: '4-1',
                text: 'What is Mentimeter?',
                options: [
                    'A video editing tool',
                    'An interactive presentation tool for live polls',
                    'A photo storage service',
                    'A social media platform',
                ],
                correctAnswer: 1,
            },
            {
                id: '4-2',
                text: 'What are the benefits of using polls in presentations?',
                options: [
                    'Increase audience engagement',
                    'Waste time',
                    'Make presentations boring',
                    'Reduce attendance',
                ],
                correctAnswer: 0,
            },
            {
                id: '4-3',
                text: 'How can Mentimeter help with real-time feedback?',
                options: [
                    'It cannot provide feedback',
                    'Displays live responses from audience during presentation',
                    'Only works offline',
                    'Requires email setup',
                ],
                correctAnswer: 1,
            },
            {
                id: '4-4',
                text: 'What types of questions can you create in Mentimeter?',
                options: [
                    'Only multiple choice',
                    'Multiple choice, word clouds, rankings, scales',
                    'Only open-ended',
                    'Only yes/no questions',
                ],
                correctAnswer: 1,
            },
        ],
    },
    5: {
        id: '5',
        questions: [
            {
                id: '5-1',
                text: 'What is the purpose of a school project presentation?',
                options: [
                    'To read from a paper',
                    'To communicate your findings and ideas clearly',
                    'To make the presentation as long as possible',
                    'To use as many colors as possible',
                ],
                correctAnswer: 1,
            },
            {
                id: '5-2',
                text: 'What makes a good presentation structure?',
                options: [
                    'Introduction, body, conclusion with clear flow',
                    'Random order of slides',
                    'No introduction needed',
                    'All content on one slide',
                ],
                correctAnswer: 0,
            },
            {
                id: '5-3',
                text: 'How should you handle presentation anxiety?',
                options: [
                    'Practice beforehand, maintain eye contact, speak clearly',
                    'Memorize everything word-for-word',
                    'Avoid looking at the audience',
                    'Speak as fast as possible',
                ],
                correctAnswer: 0,
            },
            {
                id: '5-4',
                text: 'What is the ideal slide design for presentations?',
                options: [
                    'Text-heavy with small fonts',
                    'Simple, clean, with key points and visuals',
                    'Animations on every slide',
                    'Bright neon colors',
                ],
                correctAnswer: 1,
            },
        ],
    },
    6: {
        id: '6',
        questions: [
            {
                id: '6-1',
                text: 'What is the purpose of a test-quiz presentation?',
                options: [
                    'Entertainment only',
                    'To assess knowledge and engagement through quizzes',
                    'To confuse the audience',
                    'To sell products',
                ],
                correctAnswer: 1,
            },
            {
                id: '6-2',
                text: 'How can interactive quizzes improve learning?',
                options: [
                    'They make it harder',
                    'Active participation increases retention and interest',
                    'They waste time',
                    'They have no effect',
                ],
                correctAnswer: 1,
            },
            {
                id: '6-3',
                text: 'What makes a good quiz question?',
                options: [
                    'Ambiguous and confusing',
                    'Clear, relevant, with single correct answer',
                    'Too easy to be useful',
                    'Tricky and misleading',
                ],
                correctAnswer: 1,
            },
            {
                id: '6-4',
                text: 'How should quiz results be presented to audience?',
                options: [
                    'Privately to each person',
                    'Aggregated results shown on screen with feedback',
                    'Results should be hidden',
                    'Shared only with teacher',
                ],
                correctAnswer: 1,
            },
        ],
    },
    // Over14 Courses
    7: {
        id: '7',
        questions: [
            {
                id: '7-1',
                text: 'What is CapCut primarily used for?',
                options: [
                    'Photo editing',
                    'Video editing with AI features',
                    'Audio recording',
                    'Website design',
                ],
                correctAnswer: 1,
            },
            {
                id: '7-2',
                text: 'What AI features does CapCut offer?',
                options: [
                    'Auto-captions, background removal, effects',
                    'Only basic cuts',
                    'Only color correction',
                    'No AI features',
                ],
                correctAnswer: 0,
            },
            {
                id: '7-3',
                text: 'Can you add music and sound effects in CapCut?',
                options: ['No music allowed', 'Yes, with built-in library', 'Only voice-over', 'Limited to 10 sounds'],
                correctAnswer: 1,
            },
            {
                id: '7-4',
                text: 'What video formats can CapCut export?',
                options: [
                    'Only MP4',
                    'MP4, MOV, WebM, and other formats',
                    'Only AVI',
                    'Only MOV',
                ],
                correctAnswer: 1,
            },
        ],
    },
    8: {
        id: '8',
        questions: [
            {
                id: '8-1',
                text: 'What are the key aspects of photo editing?',
                options: [
                    'Random changes',
                    'Exposure, color, contrast, composition',
                    'Making photos dark',
                    'Adding heavy filters only',
                ],
                correctAnswer: 1,
            },
            {
                id: '8-2',
                text: 'What does adjusting white balance do?',
                options: [
                    'Removes all colors',
                    'Corrects temperature tones for natural colors',
                    'Makes images grayscale',
                    'Adds blue tint',
                ],
                correctAnswer: 1,
            },
            {
                id: '8-3',
                text: 'When should you use the dodge and burn technique?',
                options: [
                    'Never',
                    'To lighten and darken specific areas for emphasis',
                    'Only on black photos',
                    'To delete the image',
                ],
                correctAnswer: 1,
            },
            {
                id: '8-4',
                text: 'What is the importance of non-destructive editing?',
                options: [
                    'It damages files',
                    'Preserves original image while allowing changes',
                    'Makes editing impossible',
                    'Increases file size permanently',
                ],
                correctAnswer: 1,
            },
        ],
    },
    9: {
        id: '9',
        questions: [
            {
                id: '9-1',
                text: 'What is the main difference between video and photo editing?',
                options: [
                    'No difference',
                    'Video editing involves timing, transitions, audio sync',
                    'Video editing is simpler',
                    'Only photos need editing',
                ],
                correctAnswer: 1,
            },
            {
                id: '9-2',
                text: 'What is a video transition?',
                options: [
                    'A type of camera',
                    'Visual effect between clips',
                    'An audio setting',
                    'A file format',
                ],
                correctAnswer: 1,
            },
            {
                id: '9-3',
                text: 'Why is audio important in video editing?',
                options: [
                    'It is not important',
                    'Creates atmosphere, guides emotions, enhances story',
                    'Only for music videos',
                    'Video works without audio',
                ],
                correctAnswer: 1,
            },
            {
                id: '9-4',
                text: 'What is color grading in video editing?',
                options: [
                    'Removing all color',
                    'Giving video a consistent, stylized color look',
                    'Random color changes',
                    'Applying one filter to all clips',
                ],
                correctAnswer: 1,
            },
        ],
    },
    10: {
        id: '10',
        questions: [
            {
                id: '10-1',
                text: 'What is ChatGPT?',
                options: [
                    'A photo editor',
                    'An AI language model for conversations',
                    'A video platform',
                    'A social network',
                ],
                correctAnswer: 1,
            },
            {
                id: '10-2',
                text: 'How can ChatGPT help prepare for job interviews?',
                options: [
                    'It cannot help',
                    'Generate questions, provide answers, explain concepts',
                    'Only tell jokes',
                    'Schedule interviews',
                ],
                correctAnswer: 1,
            },
            {
                id: '10-3',
                text: 'What is a good prompt structure for interview practice?',
                options: [
                    'Vague and unclear',
                    'Specific, detailed, with context and role',
                    'One-word prompts',
                    'Copy-paste the job description',
                ],
                correctAnswer: 1,
            },
            {
                id: '10-4',
                text: 'How should you use AI feedback from ChatGPT?',
                options: [
                    'Ignore it',
                    'As guidance to improve your answers',
                    'Memorize responses word-for-word',
                    'Never practice with it',
                ],
                correctAnswer: 1,
            },
        ],
    },
    11: {
        id: '11',
        questions: [
            {
                id: '11-1',
                text: 'What makes university interviews different from job interviews?',
                options: [
                    'They are the same',
                    'Focus on motivation, interests, academic potential',
                    'No preparation needed',
                    'Only technical questions',
                ],
                correctAnswer: 1,
            },
            {
                id: '11-2',
                text: 'What should you research before a university interview?',
                options: [
                    'Nothing, be spontaneous',
                    'University programs, campus, specific courses',
                    'Only the building location',
                    'The interviewer\'s salary',
                ],
                correctAnswer: 1,
            },
            {
                id: '11-3',
                text: 'How should you answer "Why our university?" question?',
                options: [
                    'Give generic answer',
                    'Specific reasons related to programs and values',
                    'Mention cheaper tuition',
                    'Talk about location only',
                ],
                correctAnswer: 1,
            },
            {
                id: '11-4',
                text: 'What qualities do universities value in candidates?',
                options: [
                    'Only high grades',
                    'Curiosity, critical thinking, passion, leadership',
                    'Being quiet',
                    'Having money',
                ],
                correctAnswer: 1,
            },
        ],
    },
    12: {
        id: '12',
        questions: [
            {
                id: '12-1',
                text: 'What is the first step in job interview preparation?',
                options: [
                    'Wear something fancy',
                    'Research company, role, and requirements',
                    'Arrive early without preparation',
                    'Practice nothing',
                ],
                correctAnswer: 1,
            },
            {
                id: '12-2',
                text: 'What is the STAR method in interviews?',
                options: [
                    'Start, Talk, Ask, Respond',
                    'Situation, Task, Action, Result',
                    'Stay, Think, Answer, Rest',
                    'Super, Talk, Answer, Run',
                ],
                correctAnswer: 1,
            },
            {
                id: '12-3',
                text: 'How should you handle difficult interview questions?',
                options: [
                    'Leave immediately',
                    'Take time, answer honestly, provide examples',
                    'Make up stories',
                    'Refuse to answer',
                ],
                correctAnswer: 1,
            },
            {
                id: '12-4',
                text: 'What should you do at the end of interview?',
                options: [
                    'Ask when you\'ll hear back and thank them',
                    'Just leave',
                    'Ask about salary immediately',
                    'Don\'t say anything',
                ],
                correctAnswer: 0,
            },
        ],
    },
};

export default function QuizScreen() {
    const router = useRouter();
    const { courseId } = useLocalSearchParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    const courseIdNum = parseInt(courseId as string);
    const quiz = QUIZZES[courseIdNum];

    if (!quiz) {
        return (
            <View style={styles.container}>
                <Text>Quiz not found for this course</Text>
            </View>
        );
    }

    const question = quiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.questions.length - 1;

    const handleAnswerSelect = (index: number) => {
        setSelectedAnswer(index);
        setShowResult(true);
        if (index === question.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            saveQuizResult();
            setQuizFinished(true);
        } else {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    const saveQuizResult = async () => {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        const results = await AsyncStorage.getItem('quizResults');
        const quizResults = results ? JSON.parse(results) : {};
        quizResults[courseIdNum] = {
            score: score,
            total: quiz.questions.length,
            percentage,
            date: new Date().toISOString(),
        };
        await AsyncStorage.setItem('quizResults', JSON.stringify(quizResults));
    };

    if (quizFinished) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        return (
            <ScrollView style={styles.container}>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>
                        {percentage >= 70 ? '🎉 Great Job!' : percentage >= 50 ? '👍 Good Effort' : '📚 Keep Learning'}
                    </Text>
                    <Text style={styles.scoreText}>
                        You scored {score} out of {quiz.questions.length}
                    </Text>
                    <Text style={styles.percentageText}>{percentage}%</Text>

                    <View style={styles.feedbackContainer}>
                        {percentage >= 70 && (
                            <Text style={styles.feedback}>Excellent work! You have a strong understanding of this topic.</Text>
                        )}
                        {percentage >= 50 && percentage < 70 && (
                            <Text style={styles.feedback}>Good effort! Review the material and try again to improve.</Text>
                        )}
                        {percentage < 50 && (
                            <Text style={styles.feedback}>Keep learning! Review the course material and retake the quiz.</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.retakeButton}
                        onPress={() => {
                            setCurrentQuestion(0);
                            setScore(0);
                            setSelectedAnswer(null);
                            setShowResult(false);
                            setQuizFinished(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Retake Quiz</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.exitButton} onPress={() => router.back()}>
                        <Text style={styles.buttonText}>Back to Course</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Course Quiz</Text>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    Question {currentQuestion + 1} of {quiz.questions.length}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.questionText}>{question.text}</Text>

                <View style={styles.optionsContainer}>
                    {question.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                selectedAnswer === index && styles.selectedOption,
                                showResult && index === question.correctAnswer && styles.correctOption,
                                showResult && selectedAnswer === index && index !== question.correctAnswer && styles.wrongOption,
                            ]}
                            onPress={() => !showResult && handleAnswerSelect(index)}
                            disabled={showResult}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selectedAnswer === index && styles.selectedText,
                                    showResult && index === question.correctAnswer && styles.correctText,
                                    showResult && selectedAnswer === index && index !== question.correctAnswer && styles.wrongText,
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {showResult && (
                    <View style={styles.feedbackBox}>
                        {selectedAnswer === question.correctAnswer ? (
                            <>
                                <Text style={styles.feedbackCorrect}>✓ Correct!</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.feedbackWrong}>✗ Incorrect</Text>
                                <Text style={styles.feedbackText}>
                                    The correct answer is: {question.options[question.correctAnswer]}
                                </Text>
                            </>
                        )}
                    </View>
                )}

                {showResult && (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>{isLastQuestion ? 'Finish Quiz' : 'Next Question'}</Text>
                    </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: '#a092d3',
    },
    backButton: {
        fontSize: 16,
        color: 'white',
        marginRight: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    progressContainer: {
        padding: 16,
        backgroundColor: 'white',
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
        backgroundColor: '#4CAF50',
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    content: {
        padding: 16,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 24,
        lineHeight: 26,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    selectedOption: {
        borderColor: '#a092d3',
        backgroundColor: '#f3f0ff',
    },
    correctOption: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4CAF50',
    },
    wrongOption: {
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedText: {
        color: '#a092d3',
        fontWeight: '500',
    },
    correctText: {
        color: '#2e7d32',
        fontWeight: '500',
    },
    wrongText: {
        color: '#c62828',
        fontWeight: '500',
    },
    feedbackBox: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#a092d3',
    },
    feedbackCorrect: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2e7d32',
    },
    feedbackWrong: {
        fontSize: 16,
        fontWeight: '600',
        color: '#c62828',
        marginBottom: 8,
    },
    feedbackText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    nextButton: {
        marginTop: 20,
        paddingVertical: 14,
        backgroundColor: '#a092d3',
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    resultContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#a092d3',
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 20,
    },
    feedbackContainer: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    feedback: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24,
    },
    retakeButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: '#a092d3',
        borderRadius: 8,
        marginBottom: 12,
        width: '80%',
        alignItems: 'center',
    },
    exitButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        backgroundColor: '#999',
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
