import { create } from "zustand";


interface State {
    clipboard: Map<string | number, 'cut' | 'copy'>
    addToClipBoard: (node: { id: number | string, action: 'cut' | 'copy' }) => void

}

export const createClipBoard = create<State>(set => {
    return {
        /**
         * Clipboard
         */
        clipboard: new Map(),
        addToClipBoard: (node: { id: number | string, action: 'cut' | 'copy' }) => set((state) => {
            const { clipboard } = state
            if (clipboard.has(node.id)) {
                clipboard.delete(node.id)
            }
            clipboard.set(node.id, node.action)
            return { clipboard: clipboard }
        })
    }
})