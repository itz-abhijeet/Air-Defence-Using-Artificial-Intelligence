import React from 'react';

const newsItems = [
    "INDIAN AIR FORCE DEPLOYS NEW S-400 SQUADRON TO WESTERN SECTOR",
    "DRDO SUCCESSFULLY TESTS HYPERSONIC MISSILE TECHNOLOGY",
    "UNIDENTIFIED DRONES SPOTTED NEAR BORDER REGION - ALERT LEVEL RAISED",
    "NAVY CONDUCTS JOINT EXERCISES IN INDIAN OCEAN REGION",
    "DEFENSE MINISTRY APPROVES BUDGET FOR AI SURVEILLANCE SYSTEMS"
];

function NewsTicker() {
    return (
        <div className="absolute bottom-0 w-full h-8 bg-black border-t border-tactical-cyan z-[500] flex items-center overflow-hidden">
            <div className="bg-tactical-cyan text-black px-4 font-bold text-xs h-full flex items-center whitespace-nowrap z-10">
                GEOPOLITICAL FEED
            </div>
            <div className="flex-grow overflow-hidden relative h-full flex items-center">
                <div className="animate-ticker text-tactical-red text-sm font-bold tracking-wider whitespace-nowrap absolute left-full">
                    {newsItems.join(" +++ ")} +++ {newsItems.join(" +++ ")}
                </div>
            </div>
            {/* Style for animation injected here or in index.css. 
            Note: Tailwind needs custom keyframes or arbitrary values.
            We'll assume we add .animate-ticker in index.css or use a style tag.
        */}
            <style>{`
            @keyframes ticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }
            .animate-ticker {
                animation: ticker 20s linear infinite;
            }
        `}</style>
        </div>
    );
}

export default NewsTicker;
