import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Auto-detect backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
    `http://${window.location.hostname}:3000`;

function Simulator({ socket }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        fromLat: '',
        fromLng: '',
        toLat: '',
        toLng: '',
        isFriend: true,
        confidence: 0,
    });
    const [allAircraft, setAllAircraft] = useState([]);
    const [isDeploying, setIsDeploying] = useState(false);

    // Listen to real-time flight data from radar
    useEffect(() => {
        socket.on('flightData', (data) => {
            setAllAircraft(data);
        });

        return () => {
            socket.off('flightData');
        };
    }, [socket]);

    const handleRemoveAircraft = (aircraftId) => {
        if (confirm(`Remove aircraft ${aircraftId}?`)) {
            socket.emit('removeAircraft', aircraftId);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calculateBearing = (lat1, lng1, lat2, lng2) => {
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const lat1Rad = lat1 * Math.PI / 180;
        const lat2Rad = lat2 * Math.PI / 180;

        const y = Math.sin(dLng) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360;
    };

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleDeploy = async () => {
        const { name, fromLat, fromLng, toLat, toLng, isFriend } = formData;

        // Validation
        if (!name || !fromLat || !fromLng || !toLat || !toLng) {
            alert('Please fill in all fields');
            return;
        }

        const lat1 = parseFloat(fromLat);
        const lng1 = parseFloat(fromLng);
        const lat2 = parseFloat(toLat);
        const lng2 = parseFloat(toLng);

        if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
            alert('Please enter valid coordinates');
            return;
        }

        setIsDeploying(true);

        try {
            // Request AI to generate parameters
            const response = await fetch(`${BACKEND_URL}/api/generate-aircraft-params`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    fromLat: lat1,
                    fromLng: lng1,
                    toLat: lat2,
                    toLng: lng2,
                    isFriend
                })
            });

            const aiParams = await response.json();

            // Calculate bearing and speed
            const bearing = calculateBearing(lat1, lng1, lat2, lng2);
            const distance = calculateDistance(lat1, lng1, lat2, lng2);
            const speed = aiParams.speed || (0.05 + Math.random() * 0.05);

            const newPlane = {
                id: `${name.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`,
                name,
                lat: lat1,
                lng: lng1,
                targetLat: lat2,
                targetLng: lng2,
                bearing,
                speed,
                isFriend,
                confidence: formData.confidence,
                type: aiParams.aircraftType || (isFriend ? 'FRIENDLY' : 'UNKNOWN/THREAT'),
                altitude: aiParams.altitude,
                velocity: aiParams.velocity,
                fuelLevel: aiParams.fuelLevel,
                weaponStatus: aiParams.weaponStatus,
                eta: aiParams.eta
            };

            // Emit to backend via socket
            socket.emit('deployAircraft', newPlane);

            // Reset form
            setFormData({
                name: '',
                fromLat: '',
                fromLng: '',
                toLat: '',
                toLng: '',
                isFriend: true,
                confidence: 0,
            });

            alert(`Aircraft "${name}" deployed successfully!`);
        } catch (error) {
            console.error('Deployment error:', error);
            alert('Failed to deploy aircraft. Please try again.');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="min-h-screen bg-tactical-dark text-white font-mono p-6">
            {/* Header */}
            <div className="mb-8 border-b border-tactical-cyan pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-tactical-cyan mb-2">
                            AIRCRAFT DEPLOYMENT SIMULATOR
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Deploy custom aircraft with AI-generated parameters
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-tactical-cyan text-black font-bold hover:bg-cyan-400 transition-colors"
                    >
                        ← BACK TO RADAR
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deployment Form */}
                <div className="bg-black bg-opacity-50 border border-tactical-cyan p-6">
                    <h2 className="text-2xl font-bold text-tactical-cyan mb-6">
                        DEPLOYMENT PARAMETERS
                    </h2>

                    <div className="space-y-4">
                        {/* Aircraft Name */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                AIRCRAFT CALLSIGN
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., EAGLE-1, VIPER-7"
                                className="w-full bg-black border border-gray-600 px-4 py-2 text-white focus:border-tactical-cyan focus:outline-none"
                            />
                        </div>

                        {/* From Coordinates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    ORIGIN LATITUDE
                                </label>
                                <input
                                    type="number"
                                    name="fromLat"
                                    value={formData.fromLat}
                                    onChange={handleInputChange}
                                    step="0.0001"
                                    placeholder="e.g., 28.6139"
                                    className="w-full bg-black border border-gray-600 px-4 py-2 text-white focus:border-tactical-cyan focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    ORIGIN LONGITUDE
                                </label>
                                <input
                                    type="number"
                                    name="fromLng"
                                    value={formData.fromLng}
                                    onChange={handleInputChange}
                                    step="0.0001"
                                    placeholder="e.g., 77.2090"
                                    className="w-full bg-black border border-gray-600 px-4 py-2 text-white focus:border-tactical-cyan focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* To Coordinates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    DESTINATION LATITUDE
                                </label>
                                <input
                                    type="number"
                                    name="toLat"
                                    value={formData.toLat}
                                    onChange={handleInputChange}
                                    step="0.0001"
                                    placeholder="e.g., 19.0760"
                                    className="w-full bg-black border border-gray-600 px-4 py-2 text-white focus:border-tactical-cyan focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    DESTINATION LONGITUDE
                                </label>
                                <input
                                    type="number"
                                    name="toLng"
                                    value={formData.toLng}
                                    onChange={handleInputChange}
                                    step="0.0001"
                                    placeholder="e.g., 72.8777"
                                    className="w-full bg-black border border-gray-600 px-4 py-2 text-white focus:border-tactical-cyan focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Friend/Foe Toggle */}
                        <div className="flex items-center space-x-4 pt-2">
                            <label className="text-sm text-gray-400">
                                IDENTIFICATION:
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isFriend"
                                    checked={formData.isFriend}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                />
                                <span className={formData.isFriend ? 'text-tactical-cyan' : 'text-red-500'}>
                                    {formData.isFriend ? 'FRIENDLY' : 'HOSTILE/UNKNOWN'}
                                </span>
                            </label>
                        </div>

                        {/* Confidence Level */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                THREAT CONFIDENCE: <span className={formData.confidence > 80 ? 'text-red-500' : 'text-tactical-cyan'}>{formData.confidence}%</span>
                            </label>
                            <input
                                type="range"
                                name="confidence"
                                min="0"
                                max="100"
                                value={formData.confidence}
                                onChange={handleInputChange}
                                className="w-full accent-tactical-cyan"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0% (No Threat)</span>
                                <span>100% (Critical)</span>
                            </div>
                        </div>

                        {/* Deploy Button */}
                        <button
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className={`w-full py-3 font-bold text-lg transition-colors ${isDeploying
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                        >
                            {isDeploying ? 'DEPLOYING...' : '🚀 DEPLOY AIRCRAFT'}
                        </button>
                    </div>
                </div>

                {/* All Aircraft List */}
                <div className="bg-black bg-opacity-50 border border-tactical-cyan p-6">
                    <h2 className="text-2xl font-bold text-tactical-cyan mb-6">
                        ALL AIRCRAFT ON RADAR ({allAircraft.length})
                    </h2>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {allAircraft.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No aircraft on radar
                            </p>
                        ) : (
                            allAircraft.map((plane, index) => (
                                <div
                                    key={plane.id}
                                    className="bg-black border border-gray-700 p-4 hover:border-tactical-cyan transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {plane.name || plane.id}
                                            </h3>
                                            <p className="text-xs text-gray-500">{plane.id}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 text-xs font-bold ${plane.isFriend
                                                    ? 'bg-tactical-cyan text-black'
                                                    : 'bg-red-600 text-white'
                                                    }`}
                                            >
                                                {plane.isFriend ? 'FRIENDLY' : 'HOSTILE'}
                                            </span>
                                            <button
                                                onClick={() => handleRemoveAircraft(plane.id)}
                                                className="px-2 py-1 bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                                                title="Remove aircraft"
                                            >
                                                ✕ REMOVE
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-400">Type:</span>
                                            <span className="text-white ml-2">{plane.type}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Bearing:</span>
                                            <span className="text-white ml-2">{Math.round(plane.bearing)}°</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Position:</span>
                                            <span className="text-white ml-2">{plane.lat.toFixed(2)}, {plane.lng.toFixed(2)}</span>
                                        </div>
                                        {plane.altitude && (
                                            <div>
                                                <span className="text-gray-400">Altitude:</span>
                                                <span className="text-white ml-2">{plane.altitude}</span>
                                            </div>
                                        )}
                                        {plane.velocity && (
                                            <div>
                                                <span className="text-gray-400">Velocity:</span>
                                                <span className="text-white ml-2">{plane.velocity}</span>
                                            </div>
                                        )}
                                        {plane.eta && (
                                            <div className="col-span-2">
                                                <span className="text-gray-400">ETA:</span>
                                                <span className="text-white ml-2">{plane.eta}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <div className="mt-6 bg-black bg-opacity-50 border border-gray-700 p-4">
                <h3 className="text-sm font-bold text-gray-400 mb-2">SYSTEM INFO</h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="text-green-500 ml-2">OPERATIONAL</span>
                    </div>
                    <div>
                        <span className="text-gray-500">AI Engine:</span>
                        <span className="text-tactical-cyan ml-2">ACTIVE</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Total Aircraft:</span>
                        <span className="text-white ml-2">{allAircraft.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Simulator;
