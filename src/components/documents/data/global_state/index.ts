import { create } from 'zustand';
import { DocumentType } from '../../Interface/FileBrowser';
import { useModel, UseModelActions } from '../Model';

interface State {
    dragging: boolean;
    setDragging: (val: boolean) => void;
    clipboard: Map<string, { action: 'cut' | 'copy'; is_dir: boolean }>;
    addToClipBoard: (node: { id: string; action: 'cut' | 'copy'; is_dir: boolean }) => void;
    root: string | null | undefined;
    fileMap: Map<string, DocumentType | undefined>;
    actions: UseModelActions | null;
    documents: DocumentType[];
    initiateFileBrowser: (documents: DocumentType[]) => boolean | Error;
}

export const useStore = create<State>((set) => {
    return {
        /**
         * File Browser Data
         * Model
         */
        fileMap: new Map(),
        actions: null,
        root: null,
        documents: [],
        /**
         * Initiate the filebrowser content. Receives an array of documents and inserts them into the map
         */
        initiateFileBrowser: (documents: DocumentType[]) => {
            if (Array.isArray(documents) && documents.length > 0) {
                const copy = new Map();
                documents.forEach((document) => {
                    copy.set(document.id, document);
                });
                set(() => ({ fileMap: copy }));
            }
            return true;
        },

        /**
         * Dragging
         */
        dragging: false,
        setDragging: (isDragging: boolean) => set(() => ({ dragging: isDragging })),

        /**
         * Clipboard
         */
        clipboard: new Map(),
        addToClipBoard: (node: { id: string; action: 'cut' | 'copy'; is_dir: boolean }) =>
            set((state) => {
                const { clipboard } = state;
                if (clipboard.has(node.id)) {
                    clipboard.delete(node.id);
                }
                clipboard.set(node.id, { action: node.action, is_dir: node.is_dir });
                return { clipboard: clipboard };
            })
    };
});

export const useModelStore = (documents: DocumentType[]) => {
    const { fileMap, actions, root } = useModel(documents.length > 0 ? documents.find((x) => x.is_dir === true)?.id : null, [...documents]);
    return { fileMap, actions, root };
};
