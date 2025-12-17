import React, { useState, useEffect } from 'react';

const CountUp = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [detectedPrefix, setDetectedPrefix] = useState('');
    const [detectedSuffix, setDetectedSuffix] = useState('');

    useEffect(() => {
        let startTime = null;
        const startValue = 0;

        let endValue = end;
        let localPrefix = '';
        let localSuffix = '';

        if (typeof end === 'string') {
            // Regex to separate prefix, number, and suffix
            // ^([^0-9.-]*): Match any non-digit/dot/minus at start (prefix)
            // ([\d,.]+): Match the number (digits, commas, dots)
            // ([^0-9]*)$: Match any non-digit at end (suffix)
            const match = end.match(/^([^0-9.-]*)([\d,.]+)([^0-9]*)$/);

            if (match) {
                localPrefix = match[1];
                const numberPart = match[2].replace(/,/g, ''); // Remove commas for parsing
                endValue = parseFloat(numberPart);
                localSuffix = match[3];
            } else {
                // Try to parse as float directly if regex fails but it's a string number
                endValue = parseFloat(end.replace(/,/g, ''));
            }
        }

        setDetectedPrefix(localPrefix);
        setDetectedSuffix(localSuffix);

        if (isNaN(endValue)) {
            setCount(end); // Fallback if not a number
            return;
        }

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function (easeOutExpo)
            const easeOutExpo = (x) => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            };

            const currentCount = Math.floor(easeOutExpo(progress) * (endValue - startValue) + startValue);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    // Format the number with commas
    const formattedCount = typeof count === 'number' ? count.toLocaleString() : count;

    return (
        <span>
            {prefix || detectedPrefix}{formattedCount}{suffix || detectedSuffix}
        </span>
    );
};

export default CountUp;
