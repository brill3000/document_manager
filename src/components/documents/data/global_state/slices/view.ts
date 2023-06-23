import { create } from 'zustand';

interface State {
    view: 'list' | 'grid';
    filesOpened: Map<string, string>;
    toogleView: (view: 'list' | 'grid') => void;
    openPermissionDialog: { open: boolean; scrollType: 'paper' | 'body' };
    browserHeight: number;
    browserWidth: number;
    setBrowserHeight: (height: number) => void;
    setBrowserWidth: (width: number) => void;
    openFile: (fileId: string) => void;
    closeFile: (fileId: string) => void;
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
        filesOpened: new Map(),
        openPermissionDialog: { open: false, scrollType: 'paper' },
        toogleView: (view: 'list' | 'grid') =>
            set(() => ({ view: view?.toLowerCase() === 'list' ? 'list' : view?.toLowerCase() === 'grid' ? 'grid' : 'grid' })),
        openFile: (fileId: string) =>
            set((state) => {
                const fileMapCopy = new Map(state.filesOpened);
                fileMapCopy.set(fileId, fileId);
                return { filesOpened: fileMapCopy };
            }),
        closeFile: (fileId: string) =>
            set((state) => {
                const fileMapCopy = new Map(state.filesOpened);
                fileMapCopy.delete(fileId);
                return { filesOpened: fileMapCopy };
            }),
        setOpenPermissionDialog: (open: boolean, scrollType: 'paper' | 'body') =>
            set(() => ({ openPermissionDialog: { open, scrollType } }))
    };
});
