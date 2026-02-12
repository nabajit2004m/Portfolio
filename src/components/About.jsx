import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Database, Layout, Smartphone, Cloud } from 'lucide-react';

const skills = [
    { name: 'React', icon: <Code size={24} />, level: 'Advanced' },
    { name: 'Node.js', icon: <Server size={24} />, level: 'Intermediate' },
    { name: 'MongoDB', icon: <Database size={24} />, level: 'Intermediate' },
    { name: 'UI/UX Design', icon: <Layout size={24} />, level: 'Advanced' },
    { name: 'Mobile Dev', icon: <Smartphone size={24} />, level: 'Basic' },
    { name: 'Cloud Services', icon: <Cloud size={24} />, level: 'Basic' },
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
                                Crafting Digital <span style={{ color: 'var(--primary-color)' }}>Experiences</span>
                            </h3>
                            <p style={{ color: '#ccc', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                                I am a passionate developer with a knack for building high-performance applications.
                                My focus is on creating web experiences that are not only functional but also visually stunning
                                and intuitive to use. I treat every project like a flagship product, ensuring speed,
                                responsiveness, and attention to detail.
                            </p>
                            <p style={{ color: '#ccc', lineHeight: '1.8' }}>
                                Just like iQOO pushes the boundaries of performance, I push the boundaries of what's possible on the web.
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
