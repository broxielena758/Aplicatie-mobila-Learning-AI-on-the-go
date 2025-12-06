import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course16() {
    return (
        <CoursePageTemplate
            courseId={16}
            title="Building a Creative Portfolio"
            subtitle="Showcase projects and prepare submissions"
            sections={[
                { title: 'Overview', text: 'Learn how to assemble a strong creative portfolio that highlights your best work and communicates your process.' },
                { title: "What You'll Learn", text: 'Selecting projects, writing clear project descriptions, preparing images and video, and publishing online.' },
                { title: 'Submission Checklist', text: '1) Choose 6–10 best pieces. 2) Write short descriptions with your role and tools. 3) Prepare web-ready exports. 4) Share links and collect feedback.' },
                { title: 'Presenting Your Work', text: 'Create a simple portfolio site or PDF, include contact details, and practice a short walkthrough for each piece.' },
                { title: 'Tutorial', text: 'Portfolio building guide: https://www.youtube.com/watch?v=QH2-TGUlwu4' },
            ]}
        />
    );
}
