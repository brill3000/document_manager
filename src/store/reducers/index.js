// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import departments from './departments';
import documents from './documents';
import { document_fetch } from '../async/query';




// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, departments, documents, documents_fetch: document_fetch });

export default reducers;
