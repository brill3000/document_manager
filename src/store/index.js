// // third-party
// import { configureStore } from '@reduxjs/toolkit';

// // project import
// import reducers from './reducers';
// import logger from 'redux-logger';

// // ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

// const store = configureStore({
//     reducer: reducers,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
// });

// const { dispatch } = store;

// export { store, dispatch };

import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query'
import { documentsApi } from './async/query';
import logger from "redux-logger"
import reducers from './reducers';


export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(logger)
        .concat(documentsApi.middleware)
})



setupListeners(store.dispatch)
