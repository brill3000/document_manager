import { create } from 'zustand';

interface State {
    view: 'list' | 'grid';
    toogleView: (view: 'list' | 'grid') => void;
    browserHeight: number;
    browserWidth: number;
    setBrowserHeight: (height: number) => void;
    setBrowserWidth: (width: number) => void;
}

export const useViewStore = create<State>((set) => {
    return {
        browserHeight: 0,
        browserWidth: 0,
        setBrowserHeight: (height: number) => set(() => ({ browserHeight: height })),
        setBrowserWidth: (width: number) => set(() => ({ browserWidth: width })),
        /**
         * View
         */
        view: 'grid',
        toogleView: (view: 'list' | 'grid') =>
            set(() => ({ view: view?.toLowerCase() === 'list' ? 'list' : view?.toLowerCase() === 'grid' ? 'grid' : 'grid' }))
    };
});
