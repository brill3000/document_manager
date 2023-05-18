import { create } from 'zustand';

const hist = Array.from(Array(10)).map((_, i) => ({ id: i, label: `Home ${i + 1}` }));

interface State {
    dragging: boolean;
    setDragging: (val: boolean) => void;
}

export const createFileDragDrop = create<State>((set) => {
    return {
        /**
         * Dragging
         */
        dragging: false,
        setDragging: (isDragging: boolean) => set(() => ({ dragging: isDragging }))
    };
});
