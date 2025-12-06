import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course4() {
    return (
        <CoursePageTemplate
            courseId={4}
            title="Introduction to Mentimeter"
            subtitle="Interactive presentations and polls"
            sections={[
                { title: 'Overview', text: 'Mentimeter is an interactive presentation tool that allows you to engage your audience with live polls, quizzes, and Q&A sessions. This course teaches the basics of using Mentimeter for your projects.' },
                { title: "What You'll Learn", text: 'Setting up a Mentimeter account; Creating interactive presentations; Adding polls and quizzes to slides; Tips for engaging your audience.' },
                { title: 'Getting Started', text: '1) Sign Up — Create a free account on Mentimeter. 2) Choose a Template — Pick a pre-designed template or build your own. 3) Add Interactive Elements — Include polls, quizzes, or word clouds. 4) Present and Share — Share the link and watch responses in real time.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=fXENGE7-ehM' },
            ]}
        />
    );
}
