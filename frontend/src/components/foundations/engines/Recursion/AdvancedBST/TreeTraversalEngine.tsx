import React, { useMemo, useEffect } from 'react';
import { TimelineProvider, useTimeline } from '../TimelineController';
import DualTreeVisualizer from './DualTreeVisualizer';
import { simulateTreeTraversal, TraversalMode, TreeNode } from '../RecursionSimulator';
import { useStore } from '../../../../../store/useStore';

// LeetCode style array to Tree parser
const parseLeetCodeTree = (input: string): TreeNode | null => {
    try {
        const arr = JSON.parse(input.replace(/none/gi, 'null'));
        if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;

        const root: TreeNode = { val: arr[0] };
        const queue: (TreeNode | null)[] = [root];
        let i = 1;

        while (i < arr.length && queue.length > 0) {
            const curr = queue.shift();
            if (!curr) continue;

            // Left child
            if (i < arr.length) {
                if (arr[i] !== null) {
                    curr.left = { val: arr[i] };
                    queue.push(curr.left);
                } else {
                    queue.push(null);
                }
                i++;
            }

            // Right child
            if (i < arr.length) {
                if (arr[i] !== null) {
                    curr.right = { val: arr[i] };
                    queue.push(curr.right);
                } else {
                    queue.push(null);
                }
                i++;
            }
        }
        return root;
    } catch (e) {
        console.warn("Invalid tree data parsing", e);
        return { val: 1 }; // Default fallback
    }
};

const TreeTraversalEngineContent: React.FC<{ treeData: TreeNode | null }> = ({ treeData }) => {
    const { state } = useTimeline();
    const { setTotalSteps, setActivePseudoLine, setObservationText } = useStore();

    // Sync state with global sidebar
    useEffect(() => {
        if (state.steps.length > 0) {
            setTotalSteps(state.steps.length);
        }

        const step = state.steps[state.currentStepIndex];
        if (step && step.payload) {
            setActivePseudoLine(step.payload.pseudoCodeLine || null);
            setObservationText(step.payload.observationText || null);
        }
        return () => {
            setActivePseudoLine(null);
            setObservationText(null);
        };
    }, [state.currentStepIndex, state.steps, setActivePseudoLine, setObservationText, setTotalSteps]);


    return (
        <div className="w-full h-full flex flex-col bg-transparent text-white font-sans relative overflow-hidden">
            {/* Main Content - Full Width Visualization */}
            <div className="flex-1 relative overflow-hidden">
                <DualTreeVisualizer is3DMode={false} treeData={treeData} />
            </div>
        </div>
    );
};

interface TreeTraversalEngineProps {
}

const TreeTraversalEngine: React.FC<TreeTraversalEngineProps> = () => {
    const { currentProblem, customInput, setCustomInput } = useStore();

    useEffect(() => {
        if (!customInput || customInput === 'Search trees...') {
            setCustomInput('[1, 2, 3, null, 4, 5, null]');
        }
    }, [customInput, setCustomInput]);

    const mode: TraversalMode = (currentProblem?.slug?.includes('preorder') ? 'preorder' :
        currentProblem?.slug?.includes('postorder') ? 'postorder' : 'inorder');

    const treeData = useMemo(() => parseLeetCodeTree(customInput), [customInput]);

    const simulationResult = useMemo(() => {
        return simulateTreeTraversal(treeData || { val: 1 }, mode);
    }, [treeData, mode]);

    return (
        <TimelineProvider key={`${customInput}-${mode}`} result={simulationResult}>
            <TreeTraversalEngineContent
                treeData={treeData}
            />
        </TimelineProvider>
    );
};

export default TreeTraversalEngine;
