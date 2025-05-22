import React, { useEffect, useState } from 'react';

const CircularProgressWithText = ({ size, progress, strokeWidth, strokeColor, trackColor }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size}>
            <circle
                stroke={trackColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                stroke={strokeColor}
                fill="#ffffff"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
                fill={"#000"}
                fontSize="12"
                fontWeight={'bold'}
                x="50%"
                y="50%"
                dy=".3em" // Adjust this value to center the text vertically
                textAnchor="middle"
            >
                {`${Math.round(progress)}%`}
            </text>
        </svg>
    );
};

const AnimatedProgress = ({ targetProgress, duration, ...props }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();

        const animate = () => {
            const step = (Date.now() - start) / duration;
            const currentProgress = Math.min(step * targetProgress, targetProgress);

            setProgress(currentProgress);

            if (currentProgress < targetProgress) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);

        return () => setProgress(0); // Reset on unmount
    }, [targetProgress, duration]);

    return <CircularProgressWithText progress={progress} {...props} />;
};

export default AnimatedProgress;
