import { createContext, useContext } from 'react';

interface GeneratePatternFlowActions {
    closeFlow: () => void;
    acceptPattern: () => void;
}

const noop = () => undefined;

export const GeneratePatternFlowContext = createContext<GeneratePatternFlowActions>({
    closeFlow: noop,
    acceptPattern: noop,
});

export function useGeneratePatternFlow(): GeneratePatternFlowActions {
    return useContext(GeneratePatternFlowContext);
}
