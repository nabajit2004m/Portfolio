import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500); // Slight delay before unmounting
                    return 100;
                }
                // Randomize increment for a more "realistic" feel
                const increment = Math.floor(Math.random() * 10) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    marginBottom: '20px',
                    fontSize: '4rem',
                    fontWeight: '900',
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--font-primary)'
                }}
            >
                {progress}%
            </motion.div>

            <div style={{
                width: '300px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    style={{
                        height: '100%',
                        background: 'var(--primary-color)',
                        boxShadow: '0 0 10px var(--primary-color)'
                    }}
                />
            </div>

            <div style={{
                marginTop: '30px',
                display: 'flex',
                gap: '2px',
                justifyContent: 'center'
            }}>
                {"LOADING...".split("").map((char, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            filter: ['blur(10px)', 'blur(0px)', 'blur(10px)'],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.15,
                            ease: "easeInOut"
                        }}
                        style={{
                            display: 'inline-block',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            color: '#fff',
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        {char}
                    </motion.span>
                ))}
            </div>
        </div>
    );
};

export default LoadingScreen;
