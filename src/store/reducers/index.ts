// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import departments from './departments';
import documents from './documents';
import auth from './auth/auth';
import { folders_query } from '../async/folderQuery';
import { files_query } from '../async/filesQuery';
import { users_query } from '../async/usersQuery';
import { messages_query } from 'store/async/messagesQuery';
import { workflow_query } from 'store/async/workflowQuery';
import { logs_query } from 'store/async/logsQuery';
import { auth_api } from 'store/async/dms/auth/authApi';
import { documents_api } from 'store/async/dms/documents/documentsApi';
import { folders_api } from 'store/async/dms/folders/foldersApi';
import { repository_api } from 'store/async/dms/repository/repositoryApi';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    departments,
    documents,
    auth,
    folders_query,
    files_query,
    users_query,
    messages_query,
    workflow_query,
    logs_query,
    auth_api,
    documents_api,
    folders_api,
    repository_api
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
