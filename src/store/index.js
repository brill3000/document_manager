// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers';
import logger from 'redux-logger';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

const { dispatch } = store;

export { store, dispatch };
