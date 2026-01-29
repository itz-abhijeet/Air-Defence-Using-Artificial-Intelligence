import React, { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
);

function Sidebar({ selectedFlight }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState(["> SYSTEM READY...", "> WAITING FOR INPUT..."]);
    const logEndRef = useRef(null);

    // Chart Data State
    const [chartData, setChartData] = useState({
        labels: Array(20).fill(''),
        datasets: [
            {
                label: 'Signal Density',
                data: Array(20).fill(0).map(() => Math.random() * 100),
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderWidth: 1,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
            },
        ],
    });

    // Update Chart Animation
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prev => {
                const newData = [...prev.datasets[0].data];
                newData.shift();
                newData.push(Math.random() * 100);
                return {
                    ...prev,
                    datasets: [{ ...prev.datasets[0], data: newData }]
                };
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Handle Selection
    useEffect(() => {
        if (selectedFlight) {
            addLog(`> TRACKING TARGET: ${selectedFlight.id}...`);
            addLog(`> INITIATING AZURE AI SCAN...`);
            setLoading(true);
            setAnalysis(null);

            fetch('http://localhost:3000/api/analyze')
                .then(res => res.json())
                .then(data => {
                    setAnalysis(data);
                    setLoading(false);
                    addLog(`> IDENTIFIED: ${data.tagName.toUpperCase()}`);
                    addLog(`> CONFIDENCE: ${data.probability}%`);
                    addLog(`> THREAT LEVEL: ${parseFloat(data.probability) > 90 ? 'CRITICAL' : 'HIGH'}`);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                    addLog(`> ERROR: CONNECTION LOST`);
                });
        }
    }, [selectedFlight]);

    const addLog = (msg) => {
        setLogs(prev => [...prev, msg]);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { display: false, min: 0, max: 100, grid: { color: '#111' } },
        },
        animation: false,
    };

    return (
        <div className="w-1/4 h-full border-r border-gray-800 bg-gray-900 bg-opacity-90 flex flex-col p-4 backdrop-blur-sm z-[200]">
            <h1 className="text-3xl font-bold text-tactical-cyan mb-2 tracking-tighter">S-EYE <span className="text-xs align-top text-gray-500">v2.0</span></h1>
            <div className="text-xs text-gray-400 mb-6 font-bold tracking-widest">ADVANCED AIR DEFENSE INTERFACE</div>

            {/* Target Recognition Panel */}
            <div className="border border-gray-700 p-2 mb-4 bg-black bg-opacity-50 relative flex-grow-0">
                <div className="absolute top-0 right-0 bg-tactical-red text-black text-xs px-1 font-bold">LIVE FEED</div>

                <div className="h-48 bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-800 relative">
                    {!selectedFlight && <span className="text-gray-600 text-xs">NO TARGET SELECTED</span>}
                    {loading && <span className="text-tactical-cyan animate-pulse font-bold">SCANNING...</span>}
                    {analysis && !loading && (
                        <>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/F-16_Fighting_Falcon.jpg/300px-F-16_Fighting_Falcon.jpg"
                                alt="Target"
                                className="h-full w-full object-cover filter sepia brightness-50 contrast-125"
                            />
                            {/* Simulated Bounding Box */}
                            <div
                                className="absolute border-2 border-tactical-red animate-pulse"
                                style={{
                                    left: `${analysis.boundingBox.left * 100}%`,
                                    top: `${analysis.boundingBox.top * 100}%`,
                                    width: `${analysis.boundingBox.width * 100}%`,
                                    height: `${analysis.boundingBox.height * 100}%`
                                }}
                            ></div>
                        </>
                    )}
                </div>

                <div className="mt-2">
                    <h3 className="text-tactical-cyan uppercase text-sm font-bold mb-1">Target Analysis</h3>
                    <div className="h-32 bg-black border border-gray-800 p-2 text-xs text-green-500 font-mono overflow-y-auto custom-scrollbar">
                        {logs.map((log, i) => <div key={i}>{log}</div>)}
                        <div ref={logEndRef} />
                    </div>
                </div>
            </div>

            {/* Signal Strength Chart */}
            <div className="flex-grow border border-gray-700 p-2 bg-black bg-opacity-50 relative min-h-0 flex flex-col">
                <h3 className="text-tactical-cyan uppercase text-sm font-bold mb-2">Airspace Signal Density</h3>
                <div className="flex-grow relative">
                    <Line options={options} data={chartData} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
