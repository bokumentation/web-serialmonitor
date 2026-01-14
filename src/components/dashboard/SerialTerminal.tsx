import React, { useRef, useEffect } from 'react';
import { useDataStore } from '@/store/useDataStore';
import { Terminal, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SerialTerminal = () => {
    const logs = useDataStore((state) => state.logs);
    const clearAll = useDataStore((state) => state.clearAll);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0; // Since logs are unshifted (newest at top)
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold font-mono text-zinc-400">SERIAL_DATA</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={clearAll} 
                    className="h-7 w-7 hover:bg-zinc-800 text-zinc-500"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Terminal Body */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed bg-black"
            >
                {logs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-700 italic">
                        Waiting for data...
                    </div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-3 group animate-in fade-in slide-in-from-left-1">
                                <span className="text-zinc-600 shrink-0 select-none">{log.time}</span>
                                <span className={log.text.startsWith('{') ? "text-emerald-400" : "text-zinc-300"}>
                                    {log.text}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};