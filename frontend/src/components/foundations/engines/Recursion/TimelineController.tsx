import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { SimulationResult, ExecutionStep, CallFrame } from './RecursionSimulator';
import { useStore } from '../../../../store/useStore';

interface TimelineContextType {
    state: {
        steps: ExecutionStep[];
        frames: Record<string, CallFrame>;
        currentStepIndex: number;
        isPlaying: boolean;
        speed: number;
    };
    currentStep: ExecutionStep | null;
    play: () => void;
    pause: () => void;
    stepForward: () => void;
    stepBackward: () => void;
    seek: (index: number) => void;
    setSpeed: (speed: number) => void;
    restart: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ result: SimulationResult; children: React.ReactNode }> = ({ result, children }) => {
    // Sync with Global Store
    const storeCurrentStepIndex = useStore(state => state.currentStepIndex);
    const storeIsPlaying = useStore(state => state.isPlaying);
    const setStoreStep = useStore(state => state.setStep);
    const setStorePlaying = useStore(state => state.setPlaying);
    const speed = useStore(state => state.playbackSpeed);

    const play = useCallback(() => setStorePlaying(true), [setStorePlaying]);
    const pause = useCallback(() => setStorePlaying(false), [setStorePlaying]);

    const stepForward = useCallback(() => {
        setStoreStep(Math.min(storeCurrentStepIndex + 1, result.steps.length - 1));
    }, [result.steps.length, storeCurrentStepIndex, setStoreStep]);

    const stepBackward = useCallback(() => {
        setStoreStep(Math.max(storeCurrentStepIndex - 1, 0));
    }, [storeCurrentStepIndex, setStoreStep]);

    const seek = useCallback((index: number) => {
        setStoreStep(Math.max(0, Math.min(index, result.steps.length - 1)));
    }, [result.steps.length, setStoreStep]);

    const restart = useCallback(() => {
        setStoreStep(0);
        setStorePlaying(false);
    }, [setStoreStep, setStorePlaying]);

    useEffect(() => {
        if (storeIsPlaying && storeCurrentStepIndex < result.steps.length - 1) {
            const timeout = setTimeout(() => {
                setStoreStep(storeCurrentStepIndex + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else if (storeCurrentStepIndex >= result.steps.length - 1) {
            setStorePlaying(false);
        }
    }, [storeIsPlaying, storeCurrentStepIndex, result.steps.length, speed, setStoreStep, setStorePlaying]);

    return (
        <TimelineContext.Provider value={{
            state: {
                steps: result.steps,
                frames: result.frames,
                currentStepIndex: storeCurrentStepIndex,
                isPlaying: storeIsPlaying,
                speed
            },
            currentStep: result.steps[storeCurrentStepIndex] || null,
            play,
            pause,
            stepForward,
            stepBackward,
            seek,
            setSpeed: () => { }, // Controlled by global store
            restart
        }}>
            {children}
        </TimelineContext.Provider>
    );
};

export const useTimeline = () => {
    const context = useContext(TimelineContext);
    if (!context) throw new Error('useTimeline must be used within a TimelineProvider');
    return context;
};
