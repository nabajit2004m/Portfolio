import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" style={{ padding: 'var(--section-padding)', background: 'var(--bg-secondary)' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">Get In <span>Touch</span></h2>

                    <div className="contact-links">
                        <motion.a
                            href="mailto:nabajit2004m@gmail.com"
                            whileHover={{ scale: 1.05, y: -5, background: 'var(--primary-color)', color: '#000', boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 32px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}
                        >
                            <Mail size={20} />
                            Email
                        </motion.a>

                        <motion.a
                            href="https://github.com/nabajit2004"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -5, background: 'var(--primary-color)', color: '#000', boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 32px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}
                        >
                            <Github size={20} />
                            GitHub
                        </motion.a>

                        <motion.a
                            href="https://www.linkedin.com/in/nabajit2004m"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -5, background: 'var(--primary-color)', color: '#000', boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '16px 32px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}
                        >
                            <Linkedin size={20} />
                            LinkedIn
                        </motion.a>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
