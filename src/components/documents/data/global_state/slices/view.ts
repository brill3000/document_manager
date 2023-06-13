import { create } from 'zustand';

interface State {
    view: 'list' | 'grid';
    viewFile: { open: boolean; scrollType: 'paper' | 'body' };
    openPermissionDialog: { open: boolean; scrollType: 'paper' | 'body' };
    toogleView: (view: 'list' | 'grid') => void;
    browserHeight: number;
    browserWidth: number;
    setBrowserHeight: (height: number) => void;
    setBrowserWidth: (width: number) => void;
    setViewFile: (open: boolean, scrollType: 'paper' | 'body') => void;
    setOpenPermissionDialog: (open: boolean, scrollType: 'paper' | 'body') => void;
}

export const useViewStore = create<State>((set) => {
    return {
        browserHeight: 0,
        browserWidth: 0,
        setBrowserHeight: (height: number) => set(() => ({ browserHeight: height < 600 ? 600 : height })),
        setBrowserWidth: (width: number) => set(() => ({ browserWidth: width < 300 ? 300 : width })),
        /**
         * View
         */
        view: 'grid',
        viewFile: { open: false, scrollType: 'paper' },
        openPermissionDialog: { open: false, scrollType: 'paper' },
        toogleView: (view: 'list' | 'grid') =>
            set(() => ({ view: view?.toLowerCase() === 'list' ? 'list' : view?.toLowerCase() === 'grid' ? 'grid' : 'grid' })),
        setViewFile: (open: boolean, scrollType: 'paper' | 'body') => set(() => ({ viewFile: { open, scrollType } })),
        setOpenPermissionDialog: (open: boolean, scrollType: 'paper' | 'body') =>
            set(() => ({ openPermissionDialog: { open, scrollType } }))
    };
});
