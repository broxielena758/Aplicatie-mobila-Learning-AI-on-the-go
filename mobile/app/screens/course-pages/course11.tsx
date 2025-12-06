import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course11() {
    return (
        <CoursePageTemplate
            courseId={11}
            title="Prepare for an University Interview"
            subtitle="Techniques and mock practice"
            sections={[
                { title: 'Overview', text: 'Boost your confidence and ace your university interviews by practicing with AI tools and real-world tips.' },
                { title: "What You'll Learn", text: 'Answering common questions; Presenting achievements; Building confidence through mock interviews; Understanding what interviewers look for.' },
                { title: 'Steps to Success', text: '1) Research the University — Learn about the program. 2) Practice Your Answers — Use ChatGPT or peers to rehearse. 3) Highlight Your Strengths — Prepare examples and projects. 4) Mock Interviews — Practice with feedback.' },
                { title: 'Tips', text: 'Dress professionally; Maintain posture and eye contact; Stay calm and think before answering; Follow up after the interview.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=2YPLbIbtN74' },
            ]}
        />
    );
}
