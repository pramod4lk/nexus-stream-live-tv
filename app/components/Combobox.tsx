'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface ComboboxOption {
    value: string;
    label: string;
    count?: number;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    label: string;
    disabled?: boolean;
}

export default function Combobox({ options, value, onChange, placeholder = 'Select...', label, disabled }: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="w-full space-y-1.5" ref={wrapperRef}>
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest pl-1">{label}</label>
            <div className="relative group">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        if (!disabled) {
                            setIsOpen(!isOpen);
                            setSearchQuery('');
                        }
                    }}
                    className={`
            w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-300
            ${disabled
                            ? 'bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed'
                            : 'bg-black/20 border-white/10 text-zinc-100 hover:border-white/20 hover:bg-black/40 hover:shadow-lg hover:shadow-purple-500/5 active:scale-[0.99] backdrop-blur-md'
                        }
            ${isOpen ? 'ring-2 ring-purple-500/30 border-purple-500/50' : ''}
          `}
                >
                    <span className={`truncate ${!selectedOption ? 'text-zinc-500' : ''}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
                </button>

                {isOpen && !disabled && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0f0f11]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 border-b border-white/5 bg-white/[0.02]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Type to search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/20 text-zinc-200 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500/50 placeholder:text-zinc-600 transition-all"
                                />
                            </div>
                        </div>

                        <div className="max-h-[260px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-700">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-6 text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
                                    <Search className="w-6 h-6 opacity-20" />
                                    <span>No results found</span>
                                </div>
                            ) : (
                                <div className="p-1.5 space-y-0.5">
                                    {filteredOptions.slice(0, 100).map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                onChange(option.value);
                                                setIsOpen(false);
                                            }}
                                            className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
                        ${value === option.value
                                                    ? 'bg-purple-500/20 text-purple-300'
                                                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100 hover:translate-x-1'
                                                }
                      `}
                                        >
                                            <span className="truncate text-left font-medium">{option.label}</span>
                                            <div className="flex items-center gap-2">
                                                {option.count !== undefined && (
                                                    <span className="text-[10px] text-zinc-600 bg-black/20 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                                                        {option.count}
                                                    </span>
                                                )}
                                                {value === option.value && <Check className="w-3.5 h-3.5 text-purple-400" />}
                                            </div>
                                        </button>
                                    ))}
                                    {filteredOptions.length > 100 && (
                                        <div className="px-3 py-2 text-center text-[10px] text-zinc-600 italic border-t border-white/5 mt-1">
                                            + {filteredOptions.length - 100} more...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
