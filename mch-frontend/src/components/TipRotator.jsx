import React, { useEffect, useState, useRef } from 'react';

/**
 * TipRotator
 * props:
 * - tips: array of strings
 * - mode: 'type' | 'slide'  (default 'type')
 * - typingSpeed, deletingSpeed, pauseAfterTyping (type mode)
 * - slideInterval (ms) (slide mode)
 */
const TipRotator = ({
    tips = [],
    className = '',
    mode = 'type',
    typingSpeed = 50,
    deletingSpeed = 30,
    pauseAfterTyping = 1800,
    slideInterval = 3000,
}) => {
    const [index, setIndex] = useState(0);

    // typewriter state
    const [subIndex, setSubIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const slideTimer = useRef(null);

    useEffect(() => {
        if (!tips.length) return;

        if (mode === 'type') {
            let timeout = null;

            if (!isDeleting && subIndex === tips[index].length) {
                timeout = setTimeout(() => setIsDeleting(true), pauseAfterTyping);
            } else if (isDeleting && subIndex === 0) {
                setIsDeleting(false);
                setIndex((i) => (i + 1) % tips.length);
            } else {
                timeout = setTimeout(() => {
                    setSubIndex((s) => s + (isDeleting ? -1 : 1));
                }, isDeleting ? deletingSpeed : typingSpeed);
            }

            return () => clearTimeout(timeout);
        }

        // slide mode
        if (mode === 'slide') {
            // advance index every slideInterval
            slideTimer.current = setInterval(() => {
                setIndex((i) => (i + 1) % tips.length);
            }, slideInterval);
            return () => clearInterval(slideTimer.current);
        }
    }, [subIndex, isDeleting, index, tips, mode, typingSpeed, deletingSpeed, pauseAfterTyping, slideInterval]);

    useEffect(() => {
        if (mode === 'type') setSubIndex(0);
    }, [index, mode]);

    if (!tips || tips.length === 0) return null;

    if (mode === 'slide') {
        return (
            <div className={`tip-rotator tip-rotator-slide ${className}`} aria-live="polite">
                <strong className='text-custom-color-primary'>Tip:</strong>
                <div className="tip-slide-viewport">
                    <div
                        className="tip-slide-inner"
                        style={{ transform: `translateY(-${index * 100}%)` }}
                    >
                        {tips.map((t, i) => (
                            <div className="tip-slide-item" key={i}>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // default: typewriter
    return (
        <div className={`tip-rotator ${className}`} aria-live="polite">
            <strong>Tip:</strong>
            <span className="tip-text"> {tips[index].substring(0, subIndex)}<span className="caret">|</span></span>
        </div>
    );
};

export default TipRotator;
