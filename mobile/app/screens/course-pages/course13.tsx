import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course13() {
    return (
        <CoursePageTemplate
            courseId={13}
            title="Advanced Machine Learning"
            subtitle="From models to real projects"
            sections={[
                { title: 'Overview', text: 'Move beyond basics into practical machine learning projects: dataset preparation, model selection, evaluation and deployment.' },
                { title: "What You'll Learn", text: 'Supervised vs unsupervised learning; Model evaluation and validation; Feature engineering; Basic model deployment concepts.' },
                { title: 'Project Workflow', text: '1) Define the problem. 2) Collect and clean data. 3) Choose and train a model. 4) Evaluate results and iterate. 5) Package and share your model.' },
                { title: 'Resources', text: 'Use open datasets, starter notebooks, and community examples to accelerate learning.' },
                { title: 'Tutorial', text: 'Watch a concise ML overview: https://www.youtube.com/watch?v=aircAruvnKk' },
            ]}
        />
    );
}
