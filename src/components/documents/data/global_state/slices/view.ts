import { create } from 'zustand';

interface State {
    view: 'list' | 'grid';
    viewFile: { open: boolean; scrollType: 'paper' | 'body' };
    toogleView: (view: 'list' | 'grid') => void;
    browserHeight: number;
    browserWidth: number;
    setBrowserHeight: (height: number) => void;
    setBrowserWidth: (width: number) => void;
    setViewFile: (open: boolean, scrollType: 'paper' | 'body') => void;
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
        viewFile: { open: false, scrollType: 'paper' },
        toogleView: (view: 'list' | 'grid') =>
            set(() => ({ view: view?.toLowerCase() === 'list' ? 'list' : view?.toLowerCase() === 'grid' ? 'grid' : 'grid' })),
        setViewFile: (open: boolean, scrollType: 'paper' | 'body') => set(() => ({ viewFile: { open, scrollType } }))
    };
});
