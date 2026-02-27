export interface CallFrame {
    id: string;
    functionName: string;
    params: Record<string, any>;
    localVars: Record<string, any>;
    depth: number;
    parentId?: string;
    state: 'created' | 'active' | 'waiting' | 'returned';
    returnValue?: any;
    stepCreated: number;
    stepReturned?: number;
}

export type ActionType =
    | 'PUSH_FRAME'
    | 'EVALUATE'
    | 'SPAWN_CHILD'
    | 'BASE_CASE'
    | 'ASSIGN_RETURN'
    | 'POP_FRAME';

export interface ExecutionStep {
    stepIndex: number;
    action: ActionType;
    activeFrameId: string;
    payload?: any;
}

export interface SimulationResult {
    steps: ExecutionStep[];
    frames: Record<string, CallFrame>;
}

export const simulateFactorial = (n: number): SimulationResult => {
    const steps: ExecutionStep[] = [];
    const frames: Record<string, CallFrame> = {};
    let stepCounter = 0;

    const run = (val: number, parentId?: string): number => {
        const id = `fact-${val}`;
        const depth = parentId ? frames[parentId].depth + 1 : 0;

        frames[id] = {
            id,
            functionName: 'factorial',
            params: { n: val },
            localVars: {},
            depth,
            parentId,
            state: 'created',
            stepCreated: stepCounter
        };

        steps.push({ stepIndex: stepCounter++, action: 'PUSH_FRAME', activeFrameId: id, payload: { n: val } });
        steps.push({ stepIndex: stepCounter++, action: 'EVALUATE', activeFrameId: id, payload: { condition: `n <= 1`, result: val <= 1 } });

        if (val <= 1) {
            steps.push({ stepIndex: stepCounter++, action: 'BASE_CASE', activeFrameId: id, payload: { returnValue: 1 } });
            frames[id].state = 'returned';
            frames[id].returnValue = 1;
            frames[id].stepReturned = stepCounter;
            steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: 1 } });
            return 1;
        }

        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { childN: val - 1 } });
        const childResult = run(val - 1, id);
        const result = val * childResult;

        steps.push({ stepIndex: stepCounter++, action: 'ASSIGN_RETURN', activeFrameId: id, payload: { expression: `${val} * ${childResult}`, result } });
        frames[id].state = 'returned';
        frames[id].returnValue = result;
        frames[id].stepReturned = stepCounter;
        steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: result } });
        return result;
    };

    run(n);
    return { steps, frames };
};

export const simulateFibonacci = (n: number): SimulationResult => {
    const steps: ExecutionStep[] = [];
    const frames: Record<string, CallFrame> = {};
    let stepCounter = 0;
    let callCount = 0;

    const run = (val: number, parentId?: string): number => {
        const id = `fib-${val}-${callCount++}`;
        const depth = parentId ? frames[parentId].depth + 1 : 0;

        frames[id] = {
            id,
            functionName: 'fibonacci',
            params: { n: val },
            localVars: {},
            depth,
            parentId,
            state: 'created',
            stepCreated: stepCounter
        };

        steps.push({ stepIndex: stepCounter++, action: 'PUSH_FRAME', activeFrameId: id, payload: { n: val } });
        steps.push({ stepIndex: stepCounter++, action: 'EVALUATE', activeFrameId: id, payload: { condition: `n <= 1`, result: val <= 1 } });

        if (val <= 1) {
            steps.push({ stepIndex: stepCounter++, action: 'BASE_CASE', activeFrameId: id, payload: { returnValue: val } });
            frames[id].state = 'returned';
            frames[id].returnValue = val;
            frames[id].stepReturned = stepCounter;
            steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: val } });
            return val;
        }

        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { branch: 'left', childN: val - 1 } });
        const left = run(val - 1, id);

        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { branch: 'right', childN: val - 2 } });
        const right = run(val - 2, id);

        const result = left + right;
        steps.push({ stepIndex: stepCounter++, action: 'ASSIGN_RETURN', activeFrameId: id, payload: { expression: `${left} + ${right}`, result } });
        frames[id].state = 'returned';
        frames[id].returnValue = result;
        frames[id].stepReturned = stepCounter;
        steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: result } });
        return result;
    };

    run(n);
    return { steps, frames };
};

export const simulateMergeSort = (arr: number[]): SimulationResult => {
    const steps: ExecutionStep[] = [];
    const frames: Record<string, CallFrame> = {};
    let stepCounter = 0;
    let callCount = 0;

    const run = (nums: number[], parentId?: string): number[] => {
        const id = `merge-${nums.join(',')}-${callCount++}`;
        const depth = parentId ? frames[parentId].depth + 1 : 0;

        frames[id] = {
            id,
            functionName: 'mergeSort',
            params: { arr: nums },
            localVars: {},
            depth,
            parentId,
            state: 'created',
            stepCreated: stepCounter
        };

        steps.push({ stepIndex: stepCounter++, action: 'PUSH_FRAME', activeFrameId: id, payload: { arr: nums } });
        steps.push({ stepIndex: stepCounter++, action: 'EVALUATE', activeFrameId: id, payload: { condition: `arr.length <= 1`, result: nums.length <= 1 } });

        if (nums.length <= 1) {
            steps.push({ stepIndex: stepCounter++, action: 'BASE_CASE', activeFrameId: id, payload: { returnValue: nums } });
            frames[id].state = 'returned';
            frames[id].returnValue = nums;
            frames[id].stepReturned = stepCounter;
            steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: nums } });
            return nums;
        }

        const mid = Math.floor(nums.length / 2);
        const leftArr = nums.slice(0, mid);
        const rightArr = nums.slice(mid);

        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { branch: 'left', arr: leftArr } });
        const leftSorted = run(leftArr, id);

        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { branch: 'right', arr: rightArr } });
        const rightSorted = run(rightArr, id);

        // Simplistic merge for simulation
        const merged = [...leftSorted, ...rightSorted].sort((a, b) => a - b);

        steps.push({ stepIndex: stepCounter++, action: 'ASSIGN_RETURN', activeFrameId: id, payload: { expression: `merge(${leftSorted}, ${rightSorted})`, result: merged } });
        frames[id].state = 'returned';
        frames[id].returnValue = merged;
        frames[id].stepReturned = stepCounter;
        steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: merged } });
        return merged;
    };

    run(arr);
    return { steps, frames };
};

export const simulateSubsets = (nums: number[]): SimulationResult => {
    const steps: ExecutionStep[] = [];
    const frames: Record<string, CallFrame> = {};
    let stepCounter = 0;
    let callCount = 0;

    const run = (index: number, current: number[], parentId?: string): void => {
        const id = `subset-${index}-${current.join(',')}-${callCount++}`;
        const depth = parentId ? frames[parentId].depth + 1 : 0;

        frames[id] = {
            id,
            functionName: 'subsets',
            params: { index, current: [...current] },
            localVars: {},
            depth,
            parentId,
            state: 'created',
            stepCreated: stepCounter
        };

        steps.push({ stepIndex: stepCounter++, action: 'PUSH_FRAME', activeFrameId: id, payload: { index, current: [...current] } });

        if (index === nums.length) {
            steps.push({ stepIndex: stepCounter++, action: 'BASE_CASE', activeFrameId: id, payload: { returnValue: [...current] } });
            frames[id].state = 'returned';
            frames[id].stepReturned = stepCounter;
            steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: { returnValue: [...current] } });
            return;
        }

        // Exclusion branch
        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { choice: 'exclude', val: nums[index] } });
        run(index + 1, current, id);

        // Inclusion branch
        steps.push({ stepIndex: stepCounter++, action: 'SPAWN_CHILD', activeFrameId: id, payload: { choice: 'include', val: nums[index] } });
        current.push(nums[index]);
        run(index + 1, current, id);

        // Backtrack (unchoose)
        current.pop();

        frames[id].state = 'returned';
        frames[id].stepReturned = stepCounter;
        steps.push({ stepIndex: stepCounter++, action: 'POP_FRAME', activeFrameId: id, payload: {} });
    };

    run(0, []);
    return { steps, frames };
};
export interface TreeNode {
    val: number;
    left?: TreeNode;
    right?: TreeNode;
}

export type TraversalMode = 'inorder' | 'preorder' | 'postorder';

export const simulateTreeTraversal = (root: TreeNode, mode: TraversalMode = 'inorder'): SimulationResult => {
    const steps: ExecutionStep[] = [];
    const frames: Record<string, CallFrame> = {};
    let stepCounter = 0;
    let callCount = 0;

    const run = (node?: TreeNode, parentId?: string): void => {
        const id = `tree-${node ? node.val : 'null'}-${callCount++}`;
        const depth = parentId ? frames[parentId].depth + 1 : 0;

        frames[id] = {
            id,
            functionName: mode,
            params: { node: node ? node.val : 'null' },
            localVars: {},
            depth,
            parentId,
            state: 'created',
            stepCreated: stepCounter
        };

        // 1. Frame Pushed (Line 1: function entry)
        steps.push({
            stepIndex: stepCounter++,
            action: 'PUSH_FRAME',
            activeFrameId: id,
            payload: {
                val: node ? node.val : null,
                pseudoCodeLine: 1,
                observationText: `Calling ${mode}(${node ? node.val : 'null'})`
            }
        });

        // 2. Base Case Check (Line 2: if node == null)
        steps.push({
            stepIndex: stepCounter++,
            action: 'EVALUATE',
            activeFrameId: id,
            payload: {
                condition: 'node === null',
                result: !node,
                pseudoCodeLine: 2,
                observationText: `Checking if node is null...`
            }
        });

        if (!node) {
            // Line 3: return
            steps.push({
                stepIndex: stepCounter++,
                action: 'BASE_CASE',
                activeFrameId: id,
                payload: {
                    returnValue: 'void',
                    pseudoCodeLine: 3,
                    observationText: `Node is null, returning from base case.`
                }
            });
            frames[id].state = 'returned';
            frames[id].stepReturned = stepCounter;
            steps.push({
                stepIndex: stepCounter++,
                action: 'POP_FRAME',
                activeFrameId: id,
                payload: {}
            });
            return;
        }

        // PREORDER: Visit Root First
        if (mode === 'preorder') {
            steps.push({
                stepIndex: stepCounter++,
                action: 'EVALUATE',
                activeFrameId: id,
                payload: {
                    action: 'VISIT',
                    val: node.val,
                    pseudoCodeLine: 5,
                    observationText: `Visiting node ${node.val}! Adding to result.`,
                    targetNodeId: `bst-node-${node.val}`
                }
            });
        }

        // LEFT BRANCH
        steps.push({
            stepIndex: stepCounter++,
            action: 'SPAWN_CHILD',
            activeFrameId: id,
            payload: {
                branch: 'left',
                childVal: node.left ? node.left.val : 'null',
                pseudoCodeLine: 4,
                observationText: `Node ${node.val} creates left child call...`,
                targetNodeId: `bst-node-${node.val}`
            }
        });
        run(node.left, id);

        // INORDER: Visit Root Between Branches
        if (mode === 'inorder') {
            steps.push({
                stepIndex: stepCounter++,
                action: 'EVALUATE',
                activeFrameId: id,
                payload: {
                    action: 'VISIT',
                    val: node.val,
                    pseudoCodeLine: 5,
                    observationText: `Visiting node ${node.val}! Adding to result.`,
                    targetNodeId: `bst-node-${node.val}`
                }
            });
        }

        // RIGHT BRANCH
        steps.push({
            stepIndex: stepCounter++,
            action: 'SPAWN_CHILD',
            activeFrameId: id,
            payload: {
                branch: 'right',
                childVal: node.right ? node.right.val : 'null',
                pseudoCodeLine: 6,
                observationText: `Node ${node.val} creates right child call...`,
                targetNodeId: `bst-node-${node.val}`
            }
        });
        run(node.right, id);

        // POSTORDER: Visit Root Last
        if (mode === 'postorder') {
            steps.push({
                stepIndex: stepCounter++,
                action: 'EVALUATE',
                activeFrameId: id,
                payload: {
                    action: 'VISIT',
                    val: node.val,
                    pseudoCodeLine: 5,
                    observationText: `Visiting node ${node.val}! Adding to result.`,
                    targetNodeId: `bst-node-${node.val}`
                }
            });
        }

        // 6. Frame Popped
        frames[id].state = 'returned';
        frames[id].stepReturned = stepCounter;
        steps.push({
            stepIndex: stepCounter++,
            action: 'POP_FRAME',
            activeFrameId: id,
            payload: {
                observationText: `Execution finished for node ${node.val}, returning to parent.`
            }
        });
    };

    run(root);
    return { steps, frames };
};
