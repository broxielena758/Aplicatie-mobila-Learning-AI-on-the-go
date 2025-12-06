import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course6() {
    return (
        <CoursePageTemplate
            courseId={6}
            title="Test-Quiz Presentations"
            subtitle="Create interactive quizzes with Mentimeter"
            sections={[
                { title: 'Overview', text: 'Turn your learning into a fun interactive journey with test-quiz presentations. Learn to create quizzes for studying or teaching.' },
                { title: "What You'll Learn", text: 'Designing test-quiz slides; Adding multiple-choice and open-ended questions; Tracking audience responses in real time; Customizing quizzes for different subjects.' },
                { title: 'Steps to Create Interactive Quizzes', text: '1) Define Your Quiz Topic — Choose a subject. 2) Set Up Quiz Slides — Use templates and add questions. 3) Customize the Look — Add colors and images. 4) Review and Test — Invite a friend to try it.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=CsasywVt6E8' },
            ]}
        />
    );
}
