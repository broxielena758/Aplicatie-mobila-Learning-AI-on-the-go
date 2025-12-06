import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course10() {
    return (
        <CoursePageTemplate
            courseId={10}
            title="Introduction to ChatGPT"
            subtitle="Use AI to brainstorm, practice and prepare"
            sections={[
                { title: 'Overview', text: 'Explore how AI like ChatGPT can help you craft responses, generate ideas, and practice mock interviews.' },
                { title: "What You'll Learn", text: 'Using ChatGPT for brainstorming; Practicing interview questions; Generating content outlines; Understanding AI limitations and ethics.' },
                { title: 'How to Use ChatGPT', text: '1) Ask Open-Ended Questions — Provide detailed prompts. 2) Customize Outputs — Specify tone and examples. 3) Practice Interviews — Simulate interviewer roles with follow-ups.' },
                { title: 'Ethics & Best Practices', text: 'Use AI as a supplement; Verify information; Avoid sharing private data.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=Xw_RiX9QP0Q' },
            ]}
        />
    );
}
