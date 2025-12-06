import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course14() {
    return (
        <CoursePageTemplate
            courseId={14}
            title="AI Computer Vision"
            subtitle="Image understanding and processing"
            sections={[
                { title: 'Overview', text: 'Learn core computer vision concepts: image preprocessing, object detection, and simple image classification projects.' },
                { title: "What You'll Learn", text: 'Image pipelines, convolution basics, object detection fundamentals, using pre-trained models, and practical tips for dataset labeling.' },
                { title: 'Hands-On Tasks', text: '1) Preprocess images and augment data. 2) Fine-tune a pre-trained model. 3) Evaluate with common metrics. 4) Deploy a basic inference service.' },
                { title: 'Tools & Models', text: 'Try TensorFlow Lite, OpenCV, and pre-trained models for quick experiments.' },
                { title: 'Tutorial', text: 'Intro to computer vision: https://www.youtube.com/watch?v=7eh4d6sabA0' },
            ]}
        />
    );
}
