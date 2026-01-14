import { SerialTerminal } from './components/dashboard/SerialTerminal';
import { useWebSerial } from './hooks/useWebSerial';
import { Button } from './components/ui/button';
import { useDataStore } from './store/useDataStore';
import { AddWidget } from './components/dashboard/AddWidgetDialog';
import { RealTimeLineChart } from './components/charts/RealTimeLineChart';
import { X, Cpu, Wifi, LayoutDashboard } from 'lucide-react';

export default function App() {
    const { connect, disconnect, port, reading, error } = useWebSerial();
    const widgets = useDataStore((state) => state.widgets);
    const removeWidget = useDataStore((state) => state.removeWidget);

    return (
        <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
            
            {/* 1. MAIN CONTENT AREA (Left Side) */}
            <main className="flex-1 flex flex-col min-w-0 h-full">
                
                {/* Fixed Header */}
                <header className="flex-none flex items-center justify-between border-b bg-card/50 backdrop-blur-md px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Cpu className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">WEB USB SERIAL MONITOR</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`h-2 w-2 rounded-full ${port ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                    {port ? 'ESP32 Connected' : 'Hardware Disconnected'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {error && (
                            <div className="px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-md">
                                <p className="text-xs text-destructive font-medium">{error}</p>
                            </div>
                        )}
                        <Button 
                            onClick={port ? disconnect : connect} 
                            // Explicit colors to fix the "Dark Text" issue
                            className={`font-bold px-6 shadow-lg transition-all active:scale-95 ${
                                port 
                                ? "bg-red-600 hover:bg-red-700 text-white" 
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                            disabled={reading && !port}
                        >
                            {port ? "Stop Session" : "Start Session"}
                        </Button>
                    </div>
                </header>

                {/* Scrolling Dashboard Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-6">
                        
                        {/* Hardware Controls */}
                        {port ? (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <AddWidget />
                            </div>
                        ) : (
                            <div className="h-[60vh] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center bg-muted/5 gap-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <Wifi className="h-10 w-10 text-muted-foreground opacity-40" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h2 className="text-xl font-semibold">Waiting for Connection</h2>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Plug in your ESP32 and click Start Session to begin real-time sensor monitoring.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Chart Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {widgets.map((w) => (
                                <div key={w.id} className="relative group border bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-4 right-4 z-20 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                                        onClick={() => removeWidget(w.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <RealTimeLineChart dataKey={w.dataKey} title={w.title} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* 2. SIDEBAR TERMINAL (Right Side) */}
            <aside className="w-[450px] flex-none border-l bg-black h-full overflow-hidden">
                <SerialTerminal />
            </aside>
        </div>
    );
}