'use client';

import React, { useState } from 'react';
import Hls from 'hls.js';
import { Play, AlertCircle } from 'lucide-react';

interface PlayerProps {
    url: string;
    playing: boolean;
}

export default function Player({ url, playing }: PlayerProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [error, setError] = useState(false);
    const hlsRef = React.useRef<any>(null);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Reset error state when url changes
        setError(false);

        const initPlayer = () => {
            if (Hls.isSupported() && url.toLowerCase().includes('.m3u8')) {
                // Destroy previous instance if it exists
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }

                const hls = new Hls({
                    enableWorker: false,
                    lowLatencyMode: true,
                });

                hlsRef.current = hls;
                hls.loadSource(url);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (playing) {
                        video.play().catch(e => console.log("Autoplay blocked:", e));
                    }
                });

                hls.on(Hls.Events.ERROR, (event: any, data: any) => {
                    if (data.fatal) {
                        console.error('HLS Fatal Error:', data);
                        setError(true);
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = url;
            } else {
                // Regular video
                video.src = url;
            }
        };

        if (url) {
            initPlayer();
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [url]);

    // Handle playing prop changes separately
    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [playing]);

    return (
        <div className="relative w-full h-full group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 text-white z-10 w-full h-full">
                {!url ? (
                    <div className="text-zinc-500 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="p-6 rounded-full bg-zinc-900/80 ring-1 ring-white/10 backdrop-blur-md relative">
                                <Play className="w-12 h-12 text-zinc-400 fill-zinc-400/20 ml-1" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-medium text-white">Ready to Watch?</h3>
                            <p className="text-sm text-zinc-400 max-w-[200px]">Select a country and channel from the sidebar to begin.</p>
                        </div>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        controls
                        playsInline
                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E"
                    />
                )}

                {error && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm text-red-400 gap-3 animate-in fade-in">
                        <AlertCircle className="w-12 h-12 text-red-500/50" />
                        <p className="font-medium">Stream unavailable or offline</p>
                        <button
                            onClick={() => setError(false)}
                            className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
