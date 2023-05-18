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

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { foldersQuery } from 'store/async/folderQuery';
import { filesQuery } from 'store/async/filesQuery';
import { usersQuery } from 'store/async/usersQuery';
import { messageQuery } from 'store/async/messagesQuery';
import { logsQuery } from 'store/async/logsQuery';
import { workflowQuery } from 'store/async/workflowQuery';
import { authApi } from 'store/async/dms/auth/authApi';

import logger from 'redux-logger';
import reducers from './reducers';

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(logger)
            .concat(foldersQuery.middleware)
            .concat(filesQuery.middleware)
            .concat(usersQuery.middleware)
            .concat(messageQuery.middleware)
            .concat(workflowQuery.middleware)
            .concat(logsQuery.middleware)
            .concat(authApi.middleware)
});

setupListeners(store.dispatch);
