import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course15() {
    return (
        <CoursePageTemplate
            courseId={15}
            title="Professional Photography with AI"
            subtitle="Compose, edit and enhance with intelligent tools"
            sections={[
                { title: 'Overview', text: 'Combine photographic composition principles with AI-assisted editing to produce professional images.' },
                { title: "What You'll Learn", text: 'Composition and lighting basics; Advanced retouching using AI tools; Batch workflows; Preparing images for web and print.' },
                { title: 'Editing Workflow', text: '1) Start with raw files. 2) Apply global corrections. 3) Use AI tools for retouch and object removal. 4) Final color grading and export.' },
                { title: 'Portfolio Tips', text: 'Select your strongest images, present consistent style, and write short captions explaining technique.' },
                { title: 'Tutorial', text: 'AI photography tips: https://www.youtube.com/watch?v=3XG0b7c0Yl8' },
            ]}
        />
    );
}
