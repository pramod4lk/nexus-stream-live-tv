'use client';

import React, { useState, useMemo } from 'react';
import { Monitor } from 'lucide-react';
import { CountryGroup, Channel } from '@/lib/m3u-parser';
import Combobox from './Combobox';

interface SidebarProps {
    data: CountryGroup[];
    onChannelSelect: (channel: Channel) => void;
    selectedChannel: Channel | null;
}

export default function Sidebar({ data, onChannelSelect, selectedChannel }: SidebarProps) {
    const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);

    // Memoize options for performance
    const countryOptions = useMemo(() =>
        data.map(g => ({
            value: g.name,
            label: g.name,
            count: g.channels.length
        })),
        [data]);

    const channelOptions = useMemo(() => {
        if (!selectedCountryName) return [];
        const country = data.find(g => g.name === selectedCountryName);
        return country ? country.channels.map(ch => ({
            value: ch.url,
            label: ch.name
        })) : [];
    }, [data, selectedCountryName]);

    // Handle country change
    const handleCountryChange = (val: string) => {
        setSelectedCountryName(val);
    };

    // Handle channel change
    const handleChannelChange = (val: string) => {
        const country = data.find(g => g.name === selectedCountryName);
        const channel = country?.channels.find(ch => ch.url === val);
        if (channel) {
            onChannelSelect(channel);
        }
    };

    return (
        <div className="w-80 h-full flex flex-col bg-zinc-900/40 backdrop-blur-xl border-r border-white/5 shadow-2xl relative z-10">
            <div className="p-6 border-b border-white/5 space-y-6 bg-gradient-to-b from-white/5 to-transparent">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
                    <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain drop-shadow-2xl" />
                    Nexus Stream
                </h1>

                <div className="space-y-4">
                    <Combobox
                        label="1. Select Country"
                        placeholder="Search country..."
                        options={countryOptions}
                        value={selectedCountryName}
                        onChange={handleCountryChange}
                    />

                    <Combobox
                        label="2. Select Channel"
                        placeholder={selectedCountryName ? "Search channel..." : "Select country first"}
                        options={channelOptions}
                        value={selectedChannel?.url || null}
                        onChange={handleChannelChange}
                        disabled={!selectedCountryName}
                    />
                </div>
            </div>

            <div className="flex-1 p-6 text-zinc-400 text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                <div className="prose prose-invert prose-sm">
                    <p className="opacity-80">
                        Select a country and then a channel to start watching.
                    </p>
                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                        <h3 className="text-zinc-300 font-medium mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Global Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-black/20 text-center">
                                <div className="text-2xl font-bold text-white mb-1">{data.length}</div>
                                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Countries</div>
                            </div>
                            <div className="p-3 rounded-xl bg-black/20 text-center">
                                <div className="text-2xl font-bold text-white mb-1">
                                    {data.reduce((acc, curr) => acc + curr.channels.length, 0)}
                                </div>
                                <div className="text-[10px] uppercase tracking-wider text-zinc-500">Channels</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
