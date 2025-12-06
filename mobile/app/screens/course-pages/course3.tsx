import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course3() {
    return (
        <CoursePageTemplate
            courseId={3}
            title="Create More Advanced Projects"
            subtitle="Level up your Microsoft Designer skills"
            sections={[
                { title: 'Overview', text: 'Now that you’ve mastered the basics of design, this course helps you level up with more complex projects and advanced techniques.' },
                { title: "What You'll Learn", text: 'Using advanced Microsoft Designer editing tools; Refining design layouts; Creating multi-layered projects; Collaboration and teamwork in design.' },
                { title: 'Advanced Techniques', text: '1) Layering and Masking — Use layers to add depth and masks to blend images. 2) Professional Typography — Improve readability with font choices and spacing. 3) Advanced Color Theory — Use palettes and complementary colors to make designs pop.' },
                { title: 'Sample Projects', text: 'Create a poster for a school event; Design a digital birthday card; Make a social media banner.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=QSrJAsrhnxg' },
            ]}
        />
    );
}
