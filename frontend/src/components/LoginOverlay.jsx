import React, { useEffect, useState, useRef } from 'react';

const LoginOverlay = ({ onLogin }) => {
    const [status, setStatus] = useState("Waiting for subject...");
    const [statusColor, setStatusColor] = useState("text-red-500");
    const [show, setShow] = useState(true);
    const onLoginRef = useRef(onLogin);

    // Keep ref updated
    useEffect(() => {
        onLoginRef.current = onLogin;
    }, [onLogin]);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setStatus("Subject Identified. Analyzing...");
            setStatusColor("text-tactical-cyan");
        }, 2000);

        const timer2 = setTimeout(() => {
            setStatus("ACCESS GRANTED");
            setStatusColor("text-green-500");
        }, 3500);

        const timer3 = setTimeout(() => {
            setShow(false);
            onLoginRef.current();
        }, 4500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []); // Empty deps - run once on mount

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
            <div className="w-64 h-64 border-4 border-tactical-cyan rounded-full relative flex items-center justify-center animate-pulse">
                <div className="absolute inset-0 border-t-4 border-tactical-red rounded-full animate-spin"></div>
                {/* Using SVG instead of img for reliability */}
                <svg className="w-32 h-32 text-tactical-cyan opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-.11 0-.21-.04-.3-.12-.21-.21-.21-.54 0-.75.7-.7 1.43-1.51 1.93-2.43.59-1.09.9-2.3.9-3.97h1c0 1.85-.36 3.26-1.03 4.5-.57 1.05-1.4 1.98-2.2 2.75-.09.02-.19.02-.3.02zM12.01 22c-2.75 0-5.27-1.25-6.91-3.43-.18-.23-.14-.56.09-.74.23-.18.56-.14.74.09 1.46 1.94 3.7 3.08 6.08 3.08 2.38 0 4.63-1.13 6.09-3.07.18-.23.5-.27.74-.09.23.18.27.5.09.74C17.29 20.75 14.76 22 12.01 22z" />
                </svg>
            </div>
            <h2 className="mt-8 text-2xl text-tactical-cyan tracking-widest uppercase">Biometric Scan Initiated</h2>
            <p className={`mt-2 ${statusColor} animate-pulse font-bold`}>{status}</p>
        </div>
    );
};

export default LoginOverlay;
