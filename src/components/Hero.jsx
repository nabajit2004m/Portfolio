import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ArrowRight, Zap } from 'lucide-react';

const words = ["Creative Logic", "Interactive Experiences", "Scalable Solutions"];

const Hero = () => {
    const [text, setText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [loopNum, setLoopNum] = React.useState(0);
    const [typingSpeed, setTypingSpeed] = React.useState(150);

    React.useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullText = words[i];

            setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed]);

    return (
        <section
            id="home"
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)',
                overflow: 'hidden'
            }}
        >
            {/* Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary-color)',
                    filter: 'blur(150px)',
                    opacity: 0.1,
                    borderRadius: '50%'
                }}
            ></motion.div>

            <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 style={{
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        minHeight: '24px' // Prevent layout shift
                    }}>
                        <Zap size={16} color="var(--primary-color)" />
                        {text}
                        <span className="cursor-blink" style={{ borderLeft: '2px solid var(--primary-color)', height: '20px', marginLeft: '2px' }}></span>
                    </h2>
                    <h1 style={{
                        fontWeight: '900',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to bottom right, #fff, #888)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        NABAJIT MANDAL
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        color: '#ccc',
                        marginBottom: '3rem',
                        maxWidth: '600px',
                        margin: '0 auto 3rem'
                    }}>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold', display: 'block', fontSize: '2rem', marginBottom: '0.5rem' }}>Game Developer</span>
                        Learning, Building, and Improving Every Day
                    </p>

                    <div className="hero-buttons">
                        <a href="#projects" className="btn" style={{
                            background: 'var(--primary-color)',
                            color: '#000',
                            border: 'none',
                            padding: '14px 36px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            View Projects <ArrowRight size={18} />
                        </a>
                        <a href="#contact" className="btn" style={{
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            Contact Me
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
