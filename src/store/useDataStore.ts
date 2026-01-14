import { create } from 'zustand';

interface LogEntry {
    text: string;
    time: string;
}

export interface SensorData {
    timestamp: number;
    [key: string]: number;
}

// NEW: Define what a Widget is
export interface Widget {
    id: string;
    type: 'line' | 'bar';
    dataKey: string; // matches the JSON key like "temp"
    title: string;
}

interface DashboardStore {
    logs: LogEntry[];
    history: SensorData[];
    widgets: Widget[]; // NEW
    maxDataPoints: number;
    addData: (newData: any) => void;
    addLog: (text: string) => void;
    addWidget: (widget: Omit<Widget, 'id'>) => void; // NEW
    removeWidget: (id: string) => void; // NEW
    clearAll: () => void;
}

export const useDataStore = create<DashboardStore>((set) => ({
    history: [],
    logs: [],
    widgets: [], // Starts empty
    maxDataPoints: 100,

    addLog: (text) => set((state) => ({
        logs: [{
            text,
            time: new Date().toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }) + `.${new Date().getMilliseconds()}`
        }, ...state.logs].slice(0, 50)
    })),

    addData: (newData) => set((state) => ({
        history: [...state.history, { ...newData, timestamp: Date.now() }].slice(-state.maxDataPoints)
    })),

    // NEW: Function to add a widget with a random ID
    addWidget: (w) => set((state) => ({
        widgets: [...state.widgets, { ...w, id: Math.random().toString(36).substring(2, 9) }]
    })),

    // NEW: Function to remove a widget
    removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id)
    })),

    clearAll: () => set({ history: [], logs: [] }),
}));