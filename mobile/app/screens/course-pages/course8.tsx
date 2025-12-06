import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course8() {
    return (
        <CoursePageTemplate
            courseId={8}
            title="Photo Editing"
            subtitle="Enhance photos with advanced editing techniques"
            sections={[
                { title: 'Overview', text: 'Enhance your photography skills with advanced photo editing techniques to transform images into professional-quality photos.' },
                { title: "What You'll Learn", text: 'Basic adjustments: brightness, contrast, saturation; Removing blemishes and unwanted objects; Applying filters and effects; Editing for social media.' },
                { title: 'Step-by-Step Editing Guide', text: '1) Choose Your Editing Software — Use Lightroom, Photoshop or similar. 2) Adjust the Basics — Tweak exposure, contrast, saturation. 3) Remove Unwanted Elements — Use spot healing. 4) Add Finishing Touches — Filters, overlays, and frames.' },
                { title: 'Tips', text: 'Save originals; Avoid over-editing; Use rule of thirds; Experiment with color grading.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=rPalLOkA2lA' },
            ]}
        />
    );
}
