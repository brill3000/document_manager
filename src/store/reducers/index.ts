// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import departments from './departments';
import documents from './documents';
import { folders_query } from '../async/folderQuery';
import { files_query} from '../async/filesQuery';
import { users_query} from '../async/usersQuery';
import { messages_query } from 'store/async/messagesQuery';





// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, departments, documents, folders_query: folders_query, files_query: files_query, users_query: users_query, messages_query });

export default reducers;
export type RootState = ReturnType<typeof reducers>
