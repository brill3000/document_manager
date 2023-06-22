import { JavaCalendar } from 'global/interfaces';

/**
 * UriHelper
 *
 * @author brilliant
 */
export const UriHelper = {
    // HOST: 'http://localhost:8080/OpenKM/services/rest/',
    HOST: 'http://ec100.stl-horizon.com:8080/OpenKM/services/rest/',

    /**
     * Auth
     */
    AUTHORIZATION: 'Bearer 9486d9d3-903e-4b04-a8ff-f4bf47c7c878',
    AUTH_GET_GRANTED_ROLES: 'auth/getGrantedRoles',
    AUTH_GET_GRANTED_USERS: 'auth/getGrantedUsers',
    AUTH_GET_MAIL: 'auth/getMail',
    AUTH_GET_NAME: 'auth/getName',
    AUTH_GET_ROLES: 'auth/getRoles',
    AUTH_GET_ROLES_BY_USER: 'auth/getRolesByUser',
    AUTH_GET_USERS: 'auth/getUsers',
    AUTH_GET_USERS_BY_ROLE: 'auth/getUsersByRole',
    AUTH_REVOKE_ROLE: 'auth/revokeRole',
    AUTH_ASSIGN_ROLE: 'auth/assignRole',
    AUTH_REVOKE_USER: 'auth/revokeUser',
    AUTH_GRANT_ROLE: 'auth/grantRole',
    AUTH_GRANT_USER: 'auth/grantUser',
    AUTH_GET_SESSIONS: 'auth/sessions',
    AUTH_LOGIN: 'auth/login',
    AUTH_LOGOUT: 'auth/logout',
    AUTH_LOGIN_WITH_PASSWORD: 'auth/loginWithPassword',
    AUTH_CREATE_USER: 'auth/createUser',
    AUTH_CREATE_ROLE: 'auth/createRole',
    AUTH_UPDATE_ROLE: 'auth/updateRole',
    AUTH_UPDATE_USER: 'auth/updateUser',
    AUTH_REMOVE_ROLE: 'auth/removeUser',
    AUTH_DELETE_USER: 'auth/deleteUser',
    AUTH_DELETE_ROLE: 'auth/deleteRole',
    AUTH_IS_AUTHENTICATED: 'auth/is_authenticated',
    /**
     * Dashboard
     */
    DASHBOARD_GET_USER_CHECKED_OUT_DOCUMENTS: 'dashboard/getUserCheckedOutDocuments',
    DASHBOARD_GET_USER_LAST_MODIFIED_DOCUMENTS: 'dashboard/getUserLastModifiedDocuments',
    DASHBOARD_GET_USER_LOCKED_DOCUMENTS: 'dashboard/getUserLockedDocuments',
    DASHBOARD_GET_USER_SUBSCRIBED_FOLDERS: 'dashboard/getUserSubscribedFolders',
    DASHBOARD_GET_USER_SUBSCRIBED_DOCUMENTS: 'dashboard/getUserSubscribedDocuments',
    DASHBOARD_GET_USER_LAST_UPLOADED_DOCUMENTS: 'dashboard/getUserCheckedOutDocuments',
    DASHBOARD_GET_USER_LAST_DOWNLOADED_DOCUMENTS: 'dashboard/getUserLastDownloadedDocuments',
    DASHBOARD_GET_USER_LAST_IMPORTED_MAILS: 'dashboard/getUserLastImportedMails',
    DASHBOARD_GET_USER_LAST_IMPORTED_MAIL_ATTACHMENTS: 'dashboard/getUserLastImportedMailAttachments',
    DASHBOARD_GET_USER_SEARCHES: 'dashboard/getUserSearchs',
    DASHBOARD_GET_FIND_USER_SEARCHES: 'dashboard/findUserSearches',
    DASHBOARD_GET_LAST_WEEK_TOP_DOWNLOADED_DOCUMENTS: 'dashboard/getLastWeekTopDownloadedDocuments',
    DASHBOARD_GET_LAST_MONTH_TOP_DOWN_LOADED_DOCUMENTS: 'dashboard/getLastMonthTopDownloadedDocuments',
    DASHBOARD_GET_LAST_WEEK_TOP_MODIFIED_DOCUMENTS: 'dashboard/getLastWeekTopModifiedDocuments',
    DASHBOARD_GET_LAST_MONTH_TOP_MODIFIED_DOCUMENTS: 'dashboard/getLastMonthTopModifiedDocuments',
    DASHBOARD_GET_CHECKED_OUT_DOCUMENTS: 'dashboard/getUserCheckedOutDocuments',
    DASHBOARD_GET_LAST_MODIFIED_DOCUMENTS: 'dashboard/getLastModifiedDocuments',
    DASHBOARD_GET_LAST_UPLOADED_DOCUMENTS: 'dashboard/getLastUploadedDocuments',
    /**
     * Document
     */
    DOCUMENT_CREATE: 'document/create',
    DOCUMENT_CREATE_SIMPLE: 'document/createSimple',
    DOCUMENT_DELETE: 'document/delete',
    DOCUMENT_GET_PROPERTIES: 'document/getProperties',
    DOCUMENT_GET_CONTENT: 'document/getContent',
    DOCUMENT_GET_CONTENT_BY_VERSION: 'document/getContentByVersion',
    DOCUMENT_GET_CHILDREN: 'document/getChildren',
    DOCUMENT_RENAME: 'document/rename',
    DOCUMENT_SET_PROPERTIES: 'document/setProperties',
    DOCUMENT_EXTRACT: 'document/unzip',
    DOCUMENT_CHECKOUT: 'document/checkout',
    DOCUMENT_CANCEL_CHECKOUT: 'document/cancelCheckout',
    DOCUMENT_FORCE_CANCEL_CHECKOUT: 'document/forceCancelCheckout',
    DOCUMENT_IS_CHECKOUT: 'document/isCheckedOut',
    DOCUMENT_CHECKIN: 'document/checkin',
    DOCUMENT_GET_VERSION_HISTORY: 'document/getVersionHistory',
    DOCUMENT_LOCK: 'document/lock',
    DOCUMENT_UNLOCK: 'document/unlock',
    DOCUMENT_FORCE_UNLOCK: 'document/forceUnlock',
    DOCUMENT_IS_LOCKED: 'document/isLocked',
    DOCUMENT_GET_LOCKINFO: 'document/getLockInfo',
    DOCUMENT_PURGE: 'document/purge',
    DOCUMENT_COPY: 'document/copy',
    DOCUMENT_MOVE: 'document/move',
    DOCUMENT_RESTORE_VERSION: 'document/restoreVersion',
    DOCUMENT_PURGE_VERSION_HISTORY: 'document/purgeVersionHistory',
    DOCUMENT_GET_VERSION_HISTORY_SIZE: 'document/getVersionHistorySize',
    DOCUMENT_IS_VALID: 'document/isValid',
    DOCUMENT_GET_PATH: 'document/getPath',
    DOCUMENT_EXTEND_COPY: 'document/extendedCopy',
    DOCUMENT_CREATE_FROM_TEMPLATE: 'document/createFromTemplate',

    /**
     * Folder
     */
    FOLDER_CREATE: 'folder/create',
    FOLDER_CREATE_SIMPLE: 'folder/createSimple',
    FOLDER_GET_PROPERTIES: 'folder/getProperties',
    FOLDER_DELETE: 'folder/delete',
    FOLDER_RENAME: 'folder/rename',
    FOLDER_MOVE: 'folder/move',
    FOLDER_GET_CHILDREN: 'folder/getChildren',
    FOLDER_IS_VALID: 'folder/isValid',
    FOLDER_GET_PATH: 'folder/getPath',
    FOLDER_GET_CONTENT_INFO: 'folder/getContentInfo',
    FOLDER_PURGE: 'folder/purge',
    FOLDER_COPY: 'folder/copy',
    FOLDER_EXTENDED_COPY: 'folder/copy',
    FOLDER_CREATE_MISSING_FOLDERS: 'folder/createMissingFolders',
    /**
     * Note
     */
    NOTE_ADD: 'note/add',
    NOTE_GET: 'note/get',
    NOTE_DELETE: 'note/delete',
    NOTE_SET: 'note/set',
    NOTE_LIST: 'note/list',

    /**
     * Mail
     */
    MAIL_GET_PROPERTIES: 'mail/getProperties',
    MAIL_GET_ATTACHMENTS: 'mail/getAttachments',
    MAIL_GET_CHILDREN: 'mail/getChildren',
    MAIL_IS_VALID: 'mail/isValid',
    MAIL_GET_PATH: 'mail/getPath',

    /**
     * PropertyGroup
     */
    PROPERTY_GROUP_ADD_GROUP: 'propertyGroup/addGroup',
    PROPERTY_GROUP_REMOVE_GROUP: 'propertyGroup/removeGroup',
    PROPERTY_GROUP_GET_GROUPS: 'propertyGroup/getGroups',
    PROPERTY_GROUP_GET_ALL_GROUPS: 'propertyGroup/getAllGroups',
    PROPERTY_GROUP_GET_PROPERTIES: 'propertyGroup/getProperties',
    PROPERTY_GROUP_GET_PROPERTY_GROUP_FORM: 'propertyGroup/getPropertyGroupForm',
    PROPERTY_GROUP_SET_PROPERTIES: 'propertyGroup/setProperties',
    PROPERTY_GROUP_SET_PROPERTIES_SIMPLE: 'propertyGroup/setPropertiesSimple',
    PROPERTY_GROUP_HAS_GROUP: 'propertyGroup/hasGroup',

    /**
     * Repository
     */
    REPOSITORY_GET_ROOT_FOLDER: 'repository/getRootFolder',
    REPOSITORY_GET_TRASH_FOLDER: 'repository/getTrashFolder',
    REPOSITORY_GET_TRASH_ROOT_FOLDER: 'repository/getTrashFolderBase',
    REPOSITORY_GET_ROOT_TRASH: 'repository/getTrashFolderBase',
    REPOSITORY_GET_ROOT_TEMPLATES: 'repository/getTemplatesFolder',
    REPOSITORY_GET_ROOT_PERSONAL: 'repository/getPersonalFolderBase',
    REPOSITORY_GET_MAIL_FOLDER: 'repository/getMailFolder',
    REPOSITORY_GET_ROOT_MAIL_FOLDER: 'repository/getMailFolderBase',
    REPOSITORY_GET_PERSONAL_FOLDER: 'repository/getPersonalFolder',
    REPOSITORY_GET_ROOT_MAIL: 'repository/getMailFolder',
    REPOSITORY_GET_ROOT_THESAURUS: 'repository/getThesaurusFolder',
    REPOSITORY_GET_ROOT_CATEGORIES: 'repository/getCategoriesFolder',
    REPOSITORY_PURGE_TRASH: 'repository/purgeTrash',
    REPOSITORY_GET_UPDATE_MESSAGE: 'repository/getUpdateMessage',
    REPOSITORY_GET_RESPOSITORY_UUID: 'repository/getRepositoryUuid',
    REPOSITORY_HAS_NODE: 'repository/hasNode',
    REPOSITORY_GET_NODE_PATH: 'repository/getNodePath',
    REPOSITORY_GET_NODE_UUID: 'repository/getNodeUuid',
    REPOSITORY_GET_APP_VERSION: 'repository/getAppVersion',
    REPOSITORY_EXECUTE_SCRIPT: 'repository/executeScript',
    REPOSITORY_EXECUTE_SQL_QUERY: 'repository/executeSqlQuery',
    REPOSITORY_EXECUTE_HQL_QUERY: 'repository/executeHqlQuery',
    REPOSITORY_GET_CONFIGURATION: 'repository/getConfiguration',

    /**
     * Search
     */
    SEARCH_FIND_BY_CONTENT: 'search/findByContent',
    SEARCH_FIND_BY_NAME: 'search/findByName',
    SEARCH_FIND_BY_KEYWORDS: 'search/findByKeywords',
    SEARCH_FIND: 'search/find',
    SEARCH_FIND_PAGINATED: 'search/findPaginated',
    SEARCH_FIND_SIMPLE_QUERY_PAGINATED: 'search/findSimpleQueryPaginated',
    SEARCH_FIND_MORE_LIKE_THIS: 'search/findMoreLikeThis',
    SEARCH_GET_CATEGORIES_FOLDERS: 'search/getCategoriesFolder',
    SEARCH_GET_KEYWORD_MAP: 'search/getKeywordMap',
    SEARCH_GET_CATEGORIZED_DOCUMENTS: 'search/getCategorizedDocuments',
    SEARCH_SAVE_SEARCH: 'search/saveSearch',
    SEARCH_UPDATE_SEARCH: 'search/updateSearch',
    SEARCH_GET_SEARCH: 'search/getSearch',
    SEARCH_GET_ALL_SEARCH: 'search/getAllSearchs',
    SEARCH_DELETE_SEARCH: 'search/deleteSearch',
    SEARCH_GET_CONFIGURATION: 'search/getConfiguration',

    /**
     * Property
     */
    PROPERTY_ADD_CATEGORY: 'property/addCategory',
    PROPERTY_REMOVE_CATEGORY: 'property/removeCategory',
    PROPERTY_ADD_KEYWORD: 'property/addKeyword',
    PROPERTY_REMOVE_KEYWORD: 'property/removeKeyword',
    PROPERTY_SET_ENCRYPTION: 'property/setEncryption',
    PROPERTY_UNSET_ENCRYPTION: 'property/unsetEncryption',
    PROPERTY_SET_SIGNED: 'property/setSigned',

    /**
     *  Workflow
     */
    WORKFLOW_REGISTER_PROCESS_DEFINITION: 'workflow/registerProcessDefinition',
    WORKFLOW_DELETE_PROCESS_DEFINITION: 'workflow/deleteProcessDefinition',
    WORKFLOW_GET_PROCESS_DEFINITION: 'workflow/getProcessDefinition',
    WORKFLOW_RUN_PROCESS_DEFINITION: 'workflow/runProcessDefinition',
    WORKFLOW_FIND_PROCESS_INSTANCES: 'workflow/findProcessInstances',
    WORKFLOW_FIND_ALL_PROCESS_DEFINITIONS: 'workflow/findAllProcessDefinitions',
    WORKFLOW_FIND_LATEST_PROCESS_DEFINITIONS: 'workflow/findLatestProcessDefinitions',
    WORKFLOW_FIND_LAST_PROCESS_DEFINITION: 'workflow/findLastProcessDefinition',
    WORKFLOW_GET_PROCESS_INSTANCE: 'workflow/getProcessInstance',
    WORKFLOW_FIND_USER_TASK_INSTANCES: 'workflow/findUserTaskInstances',
    WORKFLOW_FIND_TASK_INSTANCES: 'workflow/findTaskInstances',
    WORKFLOW_SET_TASK_INSTANCE_VALUES: 'workflow/setTaskInstanceValues',
    WORKFLOW_GET_TASK_INSTANCE: 'workflow/getTaskInstance',
    WORKFLOW_SET_TASK_INSTANCE_ACTOR_ID: 'workflow/setTaskInstanceActorId',
    WORKFLOW_START_TASKINSTANCE: 'workflow/startTaskInstance',
    WORKFLOW_END_TASKINSTANCE: 'workflow/endTaskInstance',
    WORKFLOW_GET_PROCESS_DEFINITION_FORMS: 'workflow/getProcessDefinitionForms',
    /**
     * getUri
     */
    TRANSITION: '0.1s'
};
/**
 *
 * @param authHeader
 * @returns username: string, password: string
 */
export const extractBasicAuth = (authHeader: string): { username: string; password: string } => {
    // Parse and extract the token from the authorization header
    // The authHeader will be in the format: 'Basic BASE64_ENCODED_CREDENTIALS'
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [username, password] = decodedCredentials.split(':');

    return { username, password };
};

/**
 *
 * @param authHeader
 * @returns string
 */
export const extractAuthToken = (authHeader: string): string => {
    // Parse and extract the token from the authorization header
    // The authHeader will be in the format: 'Basic BASE64_ENCODED_CREDENTIALS'
    if (typeof authHeader === 'string' && authHeader.toLowerCase().includes('bearer')) {
        return authHeader;
    } else return 'Bearer ';
};

export const getDateFromObject = ({ year, month, dayOfMonth, hourOfDay, minute, second }: JavaCalendar): Date => {
    return new Date(year, month - 1, dayOfMonth, hourOfDay, minute, second);
};
