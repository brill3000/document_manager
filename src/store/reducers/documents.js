// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    openFileView: false,
    currentFolder: null,
    documents: [],
    modalType: 'view'

};

// ==============================|| SLICE - MENU ||============================== //

const documents = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setOpenFileView(state, action) {
            state.openFileView = action.payload.openFileView;
        },
        setCurrentFolder(state, action) {
            state.currentFolder = action.payload.currentFolder;
        },
        setDocuments(state, action) {
            state.documents = action.payload.documents;
        },
        setModalType(state, action) {
            state.modalType = action.payload.modalType;
        },


    }
});

export default documents.reducer;

export const { setOpenFileView, setCurrentFolder, setDocuments, setModalType } = documents.actions;
