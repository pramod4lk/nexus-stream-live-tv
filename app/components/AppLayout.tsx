'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';
import { CountryGroup, Channel } from '@/lib/m3u-parser';
import { Menu, X } from 'lucide-react';

interface AppLayoutProps {
    initialData: CountryGroup[];
}

export default function AppLayout({ initialData }: AppLayoutProps) {
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleChannelSelect = (channel: Channel) => {
        setSelectedChannel(channel);
        setIsMobileMenuOpen(false); // Close sidebar on selection on mobile
    };

    return (
        <div className="flex h-screen w-full bg-transparent text-white overflow-hidden font-sans selection:bg-purple-500/30">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-md animate-in fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Wrapper */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <Sidebar
                    data={initialData}
                    onChannelSelect={handleChannelSelect}
                    selectedChannel={selectedChannel}
                />
                {/* Close button for mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 md:hidden p-2 text-zinc-400 hover:text-white bg-black/50 rounded-full backdrop-blur-md border border-white/10"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden bg-transparent">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b border-white/5 shrink-0 bg-black/40 backdrop-blur-md">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2 ml-2">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nexus Stream</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-none">
                    <div className="flex-1 p-4 md:p-8 flex flex-col gap-6 min-h-min max-w-7xl mx-auto w-full">
                        {/* Player Container - Fixed aspect ratio on mobile, flex on desktop */}
                        <div className="w-full aspect-video md:aspect-video md:h-auto bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden shrink-0 shadow-2xl ring-1 ring-white/10 z-0 relative">
                            <Player url={selectedChannel?.url || ''} playing={!!selectedChannel} />
                        </div>

                        {/* Channel Info Area */}
                        {selectedChannel && (
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md shrink-0 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                <div className="flex items-start gap-6">
                                    {selectedChannel.logo && (
                                        <div className="w-20 h-20 shrink-0 bg-white/10 rounded-xl p-2 flex items-center justify-center shadow-lg">
                                            <img
                                                src={selectedChannel.logo}
                                                alt={selectedChannel.name}
                                                className="w-full h-full object-contain drop-shadow-md"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent truncate tracking-tight">
                                            {selectedChannel.name}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-medium tracking-wide shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                {selectedChannel.country}
                                            </span>
                                            {selectedChannel.category && (
                                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-zinc-300 text-xs font-medium tracking-wide">
                                                    {selectedChannel.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
