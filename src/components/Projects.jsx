import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        id: 1,
        title: 'ML Student Performance Predictor',
        desc: 'Machine learning model predicting academic outcomes based on study hours and attendance.',
        tags: ['Python', 'Scikit-learn', 'Pandas', 'Linear Regression'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 2,
        title: 'Intelligent Hostel Management System',
        desc: 'Full-stack solution utilizing Python and machine learning for predictive resource allocation.',
        tags: ['Python', 'Machine Learning', 'Prototyping'],
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 3,
        title: 'Event System & Hardware Override',
        desc: 'Python script to automatically shuffle and distribute registered players into groups.',
        tags: ['Python', 'Data Structures', 'Automation'],
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 4,
        title: 'Personal Web Portfolio',
        desc: 'Streamlined digital portfolio to showcase technical progress and creative design assets.',
        tags: ['React', 'UX/UI', 'Generative AI'],
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800'
    }
];

const Projects = () => {
    const [hoveredProject, setHoveredProject] = useState(null);

    return (
        <section id="projects" style={{ padding: 'var(--section-padding)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">My <span>Projects</span></h2>

                    <div className="projects-grid">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                                style={{
                                    position: 'relative',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    background: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    minHeight: '300px'
                                }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: '0 10px 30px -10px rgba(255, 204, 0, 0.3)'
                                }}
                            >
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                            transform: hoveredProject === project.id ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    />
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>{project.desc}</p>

                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} style={{
                                                fontSize: '0.75rem',
                                                background: 'rgba(255, 204, 0, 0.1)',
                                                color: 'var(--primary-color)',
                                                padding: '4px 8px',
                                                borderRadius: '4px'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: '#fff' }}>
                                            <Github size={16} /> Code
                                        </a>
                                        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                                            <ExternalLink size={16} /> Live Demo
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
