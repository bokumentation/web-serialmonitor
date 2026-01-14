import { useState, useCallback, useRef } from 'react';
import { useDataStore } from '../store/useDataStore';

export const useWebSerial = () => {
    const [port, setPort] = useState<SerialPort | null>(null);
    const [reading, setReading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);
    const isReadingRef = useRef(false);
    const readTaskRef = useRef<Promise<void> | null>(null);

    const decoderRef = useRef<TextDecoderStream | null>(null);

    const startReading = async (currentPort: SerialPort) => {
        if (isReadingRef.current) return;
        isReadingRef.current = true;
        setReading(true);

        const textDecoder = new TextDecoderStream();
        decoderRef.current = textDecoder;

        const pipePromise = currentPort.readable!
            .pipeTo(textDecoder.writable)
            .catch(() => { /* Ignore pipe abort errors */ });

        const reader = textDecoder.readable.getReader();
        readerRef.current = reader;

        try {
            let buffer = "";
            while (currentPort.readable && isReadingRef.current) {
                const { value, done } = await reader.read();
                
                // Check done OR if we've been told to stop via ref
                if (done || !isReadingRef.current) break;

                if (value) {
                    buffer += value;
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed) {
                            useDataStore.getState().addLog(trimmed);
                            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                                try {
                                    const parsed = JSON.parse(trimmed);
                                    useDataStore.getState().addData(parsed);
                                } catch (e) { console.error("JSON Error:", e); }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                setError("Read Error: " + (err as Error).message);
            }
        } finally {
            reader.releaseLock();
            readerRef.current = null;
            
            await pipePromise;
            
            isReadingRef.current = false;
            setReading(false);
            console.log("Cleanup loop finished");
        }
    };

    const connect = useCallback(async () => {
        try {
            setError(null);
            const selectedPort = await navigator.serial.requestPort();
            await selectedPort.open({ baudRate: 115200 });
            setPort(selectedPort);
            
            readTaskRef.current = startReading(selectedPort);
        } catch (err) {
            setError("Failed to connect: " + (err as Error).message);
            setPort(null);
        }
    }, []);

    const disconnect = useCallback(async () => {
        isReadingRef.current = false;
        setReading(false);

        try {
            if (readerRef.current) {
                await readerRef.current.cancel();
            }

            if (readTaskRef.current) {
                await readTaskRef.current;
                readTaskRef.current = null;
            }

            if (port) {
                await port.close();
                setPort(null);
            }
            console.log("Disconnected successfully");
        } catch (err) {
            console.error("Disconnect Error:", err);
            setPort(null);
            isReadingRef.current = false;
        }
    }, [port]);

    return { connect, disconnect, port, reading, error };
};