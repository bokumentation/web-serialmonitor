import { useDataStore } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AddWidget() {
    const history = useDataStore((state) => state.history);
    const addWidget = useDataStore((state) => state.addWidget);

    const latestData = history[history.length - 1];
    const availableKeys = latestData 
        ? Object.keys(latestData).filter(k => k !== 'timestamp') 
        : [];

    return (
        <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed rounded-xl bg-zinc-950/20 border-border">
            <p className="w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Detected Sensor Streams
            </p>
            {availableKeys.map((key, index) => (
                <Button 
                    key={key} 
                    variant="outline" // Changed to outline for better visibility
                    size="sm" 
                    onClick={() => addWidget({ type: 'line', dataKey: key, title: key.toUpperCase() })}
                    className="h-9 gap-2 bg-background hover:bg-primary/5 hover:text-primary border-muted-foreground/20"
                >
                    {/* Visual indicator of the chart color */}
                    <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: `var(--chart-${(index % 5) + 1})` }}
                    />
                    <span className="font-mono text-xs">{key}</span>
                    <Plus className="h-3 w-3 opacity-50" />
                </Button>
            ))}
            {availableKeys.length === 0 && (
                <p className="text-xs italic text-muted-foreground animate-pulse">
                    Waiting for JSON packets to identify sensors...
                </p>
            )}
        </div>
    );
}