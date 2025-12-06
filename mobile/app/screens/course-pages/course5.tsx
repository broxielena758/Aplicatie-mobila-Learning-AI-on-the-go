import React from 'react';
import CoursePageTemplate from '../../components/CoursePageTemplate';

export default function Course5() {
    return (
        <CoursePageTemplate
            courseId={5}
            title="School Project Presentation"
            subtitle="Structure and delivery for school projects"
            sections={[
                { title: 'Overview', text: 'Make your school projects stand out with engaging presentations using Mentimeter. This course shows you how to create visually appealing and interactive slides.' },
                { title: "What You'll Learn", text: 'Designing effective presentation layouts; Adding interactive polls; Incorporating animations and transitions; Tips for presenting with confidence; How AI can help.' },
                { title: 'Steps to Create a Winning Presentation', text: '1) Plan Your Content — Organize main topics. 2) Choose a Theme — Select a Mentimeter template. 3) Add Interactive Features — Polls and Q&A to engage the audience. 4) Rehearse — Practice aloud for a smooth delivery.' },
                { title: 'Tutorial', text: 'Watch a quick tutorial: https://www.youtube.com/watch?v=W79AXvYVjQs' },
            ]}
        />
    );
}
