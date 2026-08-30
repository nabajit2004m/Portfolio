import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Code, Server, Database, Layout, Smartphone, Cloud } from 'lucide-react';

const skills = [
    { name: 'C & Python', icon: <Code size={24} />, level: 'Programming' },
    { name: 'Generative AI', icon: <Server size={24} />, level: 'Prompt Eng' },
    { name: 'Data Preprocessing', icon: <Database size={24} />, level: 'Pandas/NumPy' },
    { name: 'UI & Video', icon: <Layout size={24} />, level: 'Creative' },
    { name: 'Event Logistics', icon: <Cloud size={24} />, level: 'Operations' },
    { name: 'Leadership', icon: <Smartphone size={24} />, level: 'Soft Skill' },
];

const About = () => {
    return (
        <section id="about" style={{ padding: 'var(--section-padding)', background: 'var(--bg-secondary)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">About <span>Me</span></h2>

                    <div className="about-grid">
                        <div className="bio">
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                                Innovative <span style={{ color: 'var(--primary-color)' }}>Problem Solver</span>
                            </h3>
                            <p style={{ color: '#ccc', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                I am an engineering student at Impact College of Engineering (ICEAS) with foundational programming skills, creative design capacity, and a proven background in event operations. I'm experienced in coordinating high-value corporate event logistics for industry leaders including Google, WhatsApp, and LinkedIn.
                            </p>
                            <p style={{ color: '#ccc', lineHeight: '1.8' }}>
                                Skilled in prompt engineering to accelerate AI workflows, video editing, and leading cross-functional teams. Well-equipped for collaborative roles requiring clear communication, critical thinking, and operational efficiency.
                            </p>
                        </div>

                        <div className="skills-grid">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, borderColor: 'var(--primary-color)' }}
                                    style={{
                                        padding: '20px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.3s ease'
                                    }}
                                >
                                    <div style={{ color: 'var(--primary-color)' }}>{skill.icon}</div>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{skill.name}</h4>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{skill.level}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
