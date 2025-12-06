import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course2() {
    return (
        <CoursePageTemplate
            courseId={2}
            title="Create Your Own Designs"
            subtitle="Learn Microsoft Designer and simple graphic projects"
            sections={[
                { title: 'Overview', text: 'Take your first steps into the exciting world of graphic design! This course guides you in creating fun and interactive designs using Microsoft Designer.' },
                { title: "What You'll Learn", text: "Understand the basics of Microsoft Designer; How to create customized templates; Photo editing features; Using Microsoft Designer for interactive projects." },
                { title: 'Step-by-Step Guide', text: '1) Choose a Template — Start with a pre-made template that suits your needs. 2) Add Your Elements — Use Microsoft Designer to include images, text, and shapes. Try layers and different fonts. 3) Experiment with Styles — Change colors, adjust transparency, and try effects. 4) Save and Share — Export high-resolution files and share with classmates or on social media.' },
                { title: 'Tips for Creativity', text: 'Use contrasting colors for text and background; Keep layouts simple and clean; Avoid overcrowding designs; Focus on one clear theme or idea.' },
                { title: 'Simple Ideas & Video', text: 'Try a poster, social post or simple flyer using a template. Watch a quick tutorial: https://www.youtube.com/watch?v=mrJnCZzguuY' },
            ]}
        />
    );
}
