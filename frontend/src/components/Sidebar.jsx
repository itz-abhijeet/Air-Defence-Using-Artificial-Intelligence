import React, { useEffect, useState, useRef } from 'react';

// Auto-detect backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
    `http://${window.location.hostname}:3000`;

function Sidebar({ selectedFlight }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([
        { text: "> SYSTEM READY...", color: "green" },
        { text: "> WAITING FOR INPUT...", color: "green" }
    ]);
    const logEndRef = useRef(null);

    // Handle Selection
    useEffect(() => {
        if (selectedFlight) {
            addLog(`> TRACKING TARGET: ${selectedFlight.id}...`, "green");
            addLog(`> INITIATING AZURE AI SCAN...`, "green");
            setLoading(true);
            setAnalysis(null);

            fetch(`${BACKEND_URL}/api/analyze`)
                .then(res => res.json())
                .then(data => {
                    setAnalysis(data);
                    setLoading(false);
                    addLog(`> IDENTIFIED: ${data.tagName.toUpperCase()}`, "green");

                    // Check if aircraft is friendly or hostile
                    const isFriendly = selectedFlight.isFriend;

                    // Use manual confidence if set, otherwise use AI confidence
                    // For friendly aircraft, confidence should be 0 unless manually set
                    const aiConfidence = parseFloat(data.probability);
                    const manualConfidence = selectedFlight.confidence !== undefined ? selectedFlight.confidence : null;

                    let displayConfidence;
                    if (manualConfidence !== null) {
                        // Use manual confidence from simulator
                        displayConfidence = manualConfidence;
                    } else if (isFriendly) {
                        // Friendly aircraft with no manual confidence = 0%
                        displayConfidence = 0;
                    } else {
                        // Hostile aircraft with no manual confidence = AI confidence
                        displayConfidence = aiConfidence;
                    }

                    const confidenceColor = displayConfidence > 80 ? "red" : "green";
                    addLog(`> CONFIDENCE: ${displayConfidence}%`, confidenceColor);

                    const threatLevel = isFriendly
                        ? 'FRIENDLY'
                        : (displayConfidence > 90 ? 'CRITICAL THREAT' : 'HIGH THREAT');
                    const threatColor = isFriendly ? "green" : "red";

                    addLog(`> THREAT LEVEL: ${threatLevel}`, threatColor);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                    addLog(`> ERROR: CONNECTION LOST`, "red");
                });
        }
    }, [selectedFlight]);

    const addLog = (msg, color = "green") => {
        setLogs(prev => [...prev, { text: msg, color }]);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="w-1/4 h-screen max-h-screen border-r border-gray-800 bg-gray-900 bg-opacity-90 flex flex-col p-4 backdrop-blur-sm z-[200] overflow-hidden">
            <h1 className="text-3xl font-bold text-tactical-cyan mb-2 tracking-tighter">S-EYE <span className="text-xs align-top text-gray-500">v2.0</span></h1>
            <div className="text-xs text-gray-400 mb-6 font-bold tracking-widest">ADVANCED AIR DEFENSE INTERFACE</div>

            {/* Target Analysis Terminal - Full Height */}
            <div className="border border-gray-700 p-2 bg-black bg-opacity-50 relative flex-grow flex flex-col min-h-0">
                <div className="absolute top-0 right-0 bg-tactical-red text-black text-xs px-1 font-bold">LIVE FEED</div>

                <h3 className="text-tactical-cyan uppercase text-sm font-bold mb-2 mt-4 flex-shrink-0">Target Analysis</h3>
                <div className="flex-grow bg-black border border-gray-800 p-2 text-xs font-mono overflow-y-auto custom-scrollbar min-h-0">
                    {logs.map((log, i) => (
                        <div
                            key={i}
                            className={log.color === "red" ? "text-red-500" : "text-green-500"}
                        >
                            {log.text}
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
