import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course7() {
    return (
        <CoursePageTemplate
            courseId={7}
            title="Introduction to CapCut"
            subtitle="Basic video editing with CapCut"
            sections={[
                { title: 'Overview', text: 'Discover the power of video editing with CapCut. This course introduces essential tools and features to create stunning video projects.' },
                { title: "What You'll Learn", text: 'Getting started with CapCut; Basic editing techniques; Adding music, effects and transitions; Exporting videos in high quality.' },
                { title: 'Getting Started', text: '1) Install CapCut — Download the app. 2) Import Your Clips — Select clips and add to timeline. 3) Edit Your Video — Trim, split, and crop. 4) Add Audio — Include music or voiceovers. 5) Export — Save in the desired resolution.' },
                { title: 'Tips', text: 'Keep videos short; Use transitions sparingly; Choose matching music; Experiment with filters.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=l6b7zD3P31o' },
            ]}
        />
    );
}
