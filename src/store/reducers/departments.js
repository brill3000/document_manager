// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    currentDepartment: 'All Departments',
    users: []
};

// ==============================|| SLICE - MENU ||============================== //

const departments = createSlice({
    name: 'departments',
    initialState,
    reducers: {
        setCurrentDepartment(state, action) {
            state.currentDepartment = action.payload.currentDepartment;
        },
        setUsers(state, action) {
            state.users = action.payload.users;
        }
    }
});

export default departments.reducer;

export const { setCurrentDepartment, setUsers } = departments.actions;
