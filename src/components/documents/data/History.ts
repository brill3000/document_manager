import * as React from 'react';

interface UseHistoryExports {
    select: (nodeId: string | number) => void;
    history: Map<string | number, number>;
    nav: any[];
}

const useHistory = (): UseHistoryExports => {
    const [history, setHistory] = React.useState<Map<string | number, number>>(new Map());
    const [nav, setNav] = React.useState<any[]>([]);

    const selectFn = React.useCallback((nodeId: string | number) => {
        setHistory((_history) => {
            const copy = new Map(_history);
            if (copy.has(nodeId)) {
                let index = copy.get(nodeId);
                if (index !== undefined) {
                    setNav((_nav) => {
                        // @ts-expect-error
                        return _nav.slice(0, index + 1);
                    });
                }
                let newMap = new Map();
                const it = copy.entries();
                let result = it.next();
                while (!result.done) {
                    // @ts-expect-error
                    if (result.value[1] <= index) newMap.set(result.value[0], result.value[1]);
                    result = it.next();
                    // }
                }
                return newMap;
            } else {
                copy.set(nodeId, copy.size);
                setNav((_nav) => [...new Set([..._nav, nodeId])]);
            }
            return copy;
        });
    }, []);

    const { select } = React.useMemo(() => {
        return {
            select: selectFn
        };
    }, [selectFn]);

    return {
        select: select,
        history: history,
        nav: nav
    };
};

export { useHistory };
