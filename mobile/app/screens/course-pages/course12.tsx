import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course12() {
    return (
        <CoursePageTemplate
            courseId={12}
            title="Prepare for a Job Interview"
            subtitle="Interview skills and the STAR method"
            sections={[
                { title: 'Overview', text: 'Learn how to excel in job interviews by using AI tools to practice, refine your answers, and impress employers.' },
                { title: "What You'll Learn", text: 'Understanding the job interview process; Answering behavioral and situational questions; Building a personal narrative; Using ChatGPT for mock interviews and feedback.' },
                { title: 'Steps to Ace Your Interview', text: '1) Research the Company — Tailor your answers. 2) Practice Common Questions — Rehearse answers for popular prompts. 3) Build Confidence — Use mock interviews and the STAR method. 4) Follow Up — Send a thank-you note.' },
                { title: 'Mastering Behavioral Questions', text: 'Use STAR: Situation, Task, Action, Result to structure clear answers.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=Xw_RiX9QP0Q' },
            ]}
        />
    );
}
