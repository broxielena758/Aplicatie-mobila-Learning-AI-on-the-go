import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course9() {
    return (
        <CoursePageTemplate
            courseId={9}
            title="Professional Video Editing"
            subtitle="Advanced CapCut techniques"
            sections={[
                { title: 'Overview', text: 'Level up your video editing skills by learning advanced techniques with CapCut focused on creating polished, professional videos.' },
                { title: "What You'll Learn", text: 'Advanced editing techniques; Using keyframes for motion; Color grading and correction; Special effects and transitions.' },
                { title: 'Mastering Advanced Techniques', text: '1) Keyframes and Motion — Animate elements like text and images. 2) Perfect Your Audio — Clean and sync audio tracks. 3) Color Grading — Adjust tones and use LUTs. 4) Visual Effects — Add overlays, slow-motion, and filters.' },
                { title: 'Tips', text: 'Plan edits with a storyboard; Use consistent fonts/colors; Focus on audio quality; Export at high quality.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=ol7PQ_arWPg' },
            ]}
        />
    );
}
