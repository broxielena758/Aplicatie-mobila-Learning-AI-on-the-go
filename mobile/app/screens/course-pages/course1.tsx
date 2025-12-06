import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course1() {
    return (
        <CoursePageTemplate
            courseId={1}
            title="Introduction to Microsoft Designer"
            subtitle="Create graphics quickly with AI"
            sections={[
                { title: 'Overview', text: 'Learn to use Microsoft Designer to create posters, social media images and simple designs with AI assistance.' },
                { title: 'What you will learn', text: 'Template selection, customization, exporting images, basic typography and color.' },
                { title: 'Quiz', text: 'Short 4-question quiz to test understanding.' },
            ]}
        />
    );
}
