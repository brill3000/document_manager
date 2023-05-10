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
import { foldersQuery } from './async/folderQuery';
import { filesQuery } from './async/filesQuery';
import { usersQuery } from './async/usersQuery';
import { messageQuery } from "./async/messagesQuery";
import { logsQuery } from "./async/logsQuery";


import logger from "redux-logger"
import reducers from './reducers';
import { workflowQuery } from "./async/workflowQuery";


export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(logger)
        .concat(foldersQuery.middleware)
        .concat(filesQuery.middleware)
        .concat(usersQuery.middleware)
        .concat(messageQuery.middleware)
        .concat(workflowQuery.middleware)
        .concat(logsQuery.middleware)



})



setupListeners(store.dispatch)
