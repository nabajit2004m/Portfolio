import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Cursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if device is mobile or has coarse pointer (touch)
        const checkMobile = () => {
            const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
            setIsVisible(!isMobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        const mouseDown = () => setIsClicking(true);
        const mouseUp = () => setIsClicking(false);

        // Only add listeners if visible
        if (isVisible) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mousedown", mouseDown);
            window.addEventListener("mouseup", mouseUp);

            // Add event listeners for hover effects on links and buttons
            const handleMouseOver = (e) => {
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                    setIsHovering(true);
                }
            };

            const handleMouseOut = () => {
                setIsHovering(false);
            };

            window.addEventListener('mouseover', handleMouseOver);
            window.addEventListener('mouseout', handleMouseOut);

            return () => {
                window.removeEventListener("mousemove", mouseMove);
                window.removeEventListener("mousedown", mouseDown);
                window.removeEventListener("mouseup", mouseUp);
                window.removeEventListener('mouseover', handleMouseOver);
                window.removeEventListener('mouseout', handleMouseOut);
                window.removeEventListener('resize', checkMobile);
            };
        }

        return () => window.removeEventListener('resize', checkMobile);

    }, [isVisible]);

    if (!isVisible) return null;

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            backgroundColor: "rgba(255, 204, 0, 0.3)",
            mixBlendMode: "difference"
        },
        hover: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            height: 48,
            width: 48,
            backgroundColor: "rgba(255, 204, 0, 0.2)",
            border: "1px solid #FFCC00",
            mixBlendMode: "normal"
        },
        click: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            height: 48,
            width: 48,
            backgroundColor: "rgba(255, 204, 0, 0.8)",
            mixBlendMode: "difference",
            scale: 0.8
        }
    };

    const dotVariants = {
        default: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            backgroundColor: "#FFCC00"
        },
        hover: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            backgroundColor: "#FFCC00",
            scale: 0
        },
        click: {
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            backgroundColor: "#FFCC00",
            scale: 0
        }
    };

    return (
        <>
            {/* Main Cursor Dot */}
            <motion.div
                className="cursor-dot"
                variants={dotVariants}
                animate={isClicking ? "click" : (isHovering ? "hover" : "default")}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                }}
            />
            {/* Trailing Cursor Circle */}
            <motion.div
                className="cursor-follower"
                variants={variants}
                animate={isClicking ? "click" : (isHovering ? "hover" : "default")}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                }}
            />
        </>
    );
};

export default Cursor;
