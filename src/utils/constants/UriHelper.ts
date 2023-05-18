/**
 * UriHelper
 *
 * @author brilliant
 */
export const UriHelper = {
    HOST: 'http://localhost:8080/OpenKM/',
    /**
     * Auth
     */
    AUTHORIZATION: 'Bearer d847fa01-3958-4942-b096-790c4b671293',
    AUTH_GET_GRANTED_ROLES: 'services/rest/auth/getGrantedRoles',
    AUTH_GET_GRANTED_USERS: 'services/rest/auth/getGrantedUsers',
    AUTH_GET_MAIL: 'services/rest/auth/getMail',
    AUTH_GET_NAME: 'services/rest/auth/getName',
    AUTH_GET_ROLES: 'services/rest/auth/getRoles',
    AUTH_GET_ROLES_BY_USER: 'services/rest/auth/getRolesByUser',
    AUTH_GET_USERS: 'services/rest/auth/getUsers',
    AUTH_GET_USERS_BY_ROLE: 'services/rest/auth/getUsersByRole',
    AUTH_REVOKE_ROLE: 'services/rest/auth/revokeRole',
    AUTH_ASSIGN_ROLE: 'services/rest/auth/assignRole',
    AUTH_REVOKE_USER: 'services/rest/auth/revokeUser',
    AUTH_GRANT_ROLE: 'services/rest/auth/grantRole',
    AUTH_GRANT_USER: 'services/rest/auth/grantUser',
    AUTH_GET_SESSIONS: 'services/rest/auth/sessions',
    AUTH_LOGIN: 'services/rest/auth/login',
    AUTH_CREATE_USER: 'services/rest/auth/createUser',
    AUTH_CREATE_ROLE: 'services/rest/auth/createRole',
    AUTH_UPDATE_ROLE: 'services/rest/auth/updateRole',
    AUTH_UPDATE_USER: 'services/rest/auth/updateUser',
    AUTH_REMOVE_ROLE: 'services/rest/auth/removeUser',
    AUTH_DELETE_USER: 'services/rest/auth/deleteUser',
    AUTH_DELETE_ROLE: 'services/rest/auth/deleteRole',
    AUTH_IS_AUTHENTICATED: 'services/rest/auth/is_authenticated',
    /**
     * Dashboard
     */
    DASHBOARD_GET_USER_CHECKED_OUT_DOCUMENTS: 'services/rest/dashboard/getUserCheckedOutDocuments',
    DASHBOARD_GET_USER_LAST_MODIFIED_DOCUMENTS: 'services/rest/dashboard/getUserLastModifiedDocuments',
    DASHBOARD_GET_USER_LOCKED_DOCUMENTS: 'services/rest/dashboard/getUserLockedDocuments',
    DASHBOARD_GET_USER_SUBSCRIBED_FOLDERS: 'services/rest/dashboard/getUserSubscribedFolders',
    DASHBOARD_GET_USER_SUBSCRIBED_DOCUMENTS: 'services/rest/dashboard/getUserSubscribedDocuments',
    DASHBOARD_GET_USER_LAST_UPLOADED_DOCUMENTS: 'services/rest/dashboard/getUserCheckedOutDocuments',
    DASHBOARD_GET_USER_LAST_DOWNLOADED_DOCUMENTS: 'services/rest/dashboard/getUserLastDownloadedDocuments',
    DASHBOARD_GET_USER_LAST_IMPORTED_MAILS: 'services/rest/dashboard/getUserLastImportedMails',
    DASHBOARD_GET_USER_LAST_IMPORTED_MAIL_ATTACHMENTS: 'services/rest/dashboard/getUserLastImportedMailAttachments',
    DASHBOARD_GET_USER_SEARCHES: 'services/rest/dashboard/getUserSearchs',
    DASHBOARD_GET_FIND_USER_SEARCHES: 'services/rest/dashboard/findUserSearches',
    DASHBOARD_GET_LAST_WEEK_TOP_DOWNLOADED_DOCUMENTS: 'services/rest/dashboard/getLastWeekTopDownloadedDocuments',
    DASHBOARD_GET_LAST_MONTH_TOP_DOWN_LOADED_DOCUMENTS: 'services/rest/dashboard/getLastMonthTopDownloadedDocuments',
    DASHBOARD_GET_LAST_WEEK_TOP_MODIFIED_DOCUMENTS: 'services/rest/dashboard/getLastWeekTopModifiedDocuments',
    DASHBOARD_GET_LAST_MONTH_TOP_MODIFIED_DOCUMENTS: 'services/rest/dashboard/getLastMonthTopModifiedDocuments',
    DASHBOARD_GET_CHECKED_OUT_DOCUMENTS: 'services/rest/dashboard/getUserCheckedOutDocuments',
    DASHBOARD_GET_LAST_MODIFIED_DOCUMENTS: 'services/rest/dashboard/getLastModifiedDocuments',
    DASHBOARD_GET_LAST_UPLOADED_DOCUMENTS: 'services/rest/dashboard/getLastUploadedDocuments',
    /**
     * Document
     */
    DOCUMENT_CREATE: 'services/rest/document/create',
    DOCUMENT_CREATE_SIMPLE: 'services/rest/document/createSimple',
    DOCUMENT_DELETE: 'services/rest/document/delete',
    DOCUMENT_GET_PROPERTIES: 'services/rest/document/getProperties',
    DOCUMENT_GET_CONTENT: 'services/rest/document/getContent',
    DOCUMENT_GET_CONTENT_BY_VERSION: 'services/rest/document/getContentByVersion',
    DOCUMENT_GET_CHILDREN: 'services/rest/document/getChildren',
    DOCUMENT_RENAME: 'services/rest/document/rename',
    DOCUMENT_SET_PROPERTIES: 'services/rest/document/setProperties',
    DOCUMENT_CHECKOUT: 'services/rest/document/checkout',
    DOCUMENT_CANCEL_CHECKOUT: 'services/rest/document/cancelCheckout',
    DOCUMENT_FORCE_CANCEL_CHECKOUT: 'services/rest/document/forceCancelCheckout',
    DOCUMENT_IS_CHECKOUT: 'services/rest/document/isCheckedOut',
    DOCUMENT_CHECKIN: 'services/rest/document/checkin',
    DOCUMENT_GET_VERSION_HISTORY: 'services/rest/document/getVersionHistory',
    DOCUMENT_LOCK: 'services/rest/document/lock',
    DOCUMENT_UNLOCK: 'services/rest/document/unlock',
    DOCUMENT_FORCE_UNLOCK: 'services/rest/document/forceUnlock',
    DOCUMENT_IS_LOCKED: 'services/rest/document/isLocked',
    DOCUMENT_GET_LOCKINFO: 'services/rest/document/getLockInfo',
    DOCUMENT_PURGE: 'services/rest/document/purge',
    DOCUMENT_COPY: 'services/rest/document/copy',
    DOCUMENT_MOVE: 'services/rest/document/move',
    DOCUMENT_RESTORE_VERSION: 'services/rest/document/restoreVersion',
    DOCUMENT_PURGE_VERSION_HISTORY: 'services/rest/document/purgeVersionHistory',
    DOCUMENT_GET_VERSION_HISTORY_SIZE: 'services/rest/document/getVersionHistorySize',
    DOCUMENT_IS_VALID: 'services/rest/document/isValid',
    DOCUMENT_GET_PATH: 'services/rest/document/getPath',
    DOCUMENT_EXTEND_COPY: 'services/rest/document/extendedCopy',
    DOCUMENT_CREATE_FROM_TEMPLATE: 'services/rest/document/createFromTemplate',

    /**
     * Folder
     */
    FOLDER_CREATE: 'services/rest/folder/create',
    FOLDER_CREATE_SIMPLE: 'services/rest/folder/createSimple',
    FOLDER_GET_PROPERTIES: 'services/rest/folder/getProperties',
    FOLDER_DELETE: 'services/rest/folder/delete',
    FOLDER_RENAME: 'services/rest/folder/rename',
    FOLDER_MOVE: 'services/rest/folder/move',
    FOLDER_GET_CHILDREN: 'services/rest/folder/getChildren',
    FOLDER_IS_VALID: 'services/rest/folder/isValid',
    FOLDER_GET_PATH: 'services/rest/folder/getPath',
    FOLDER_GET_CONTENT_INFO: 'services/rest/folder/getContentInfo',
    FOLDER_PURGE: 'services/rest/folder/purge',
    FOLDER_COPY: 'services/rest/folder/copy',
    FOLDER_EXTENDED_COPY: 'services/rest/folder/copy',
    FOLDER_CREATE_MISSING_FOLDERS: 'services/rest/folder/createMissingFolders',
    /**
     * Note
     */
    NOTE_ADD: 'services/rest/note/add',
    NOTE_GET: 'services/rest/note/get',
    NOTE_DELETE: 'services/rest/note/delete',
    NOTE_SET: 'services/rest/note/set',
    NOTE_LIST: 'services/rest/note/list',

    /**
     * Mail
     */
    MAIL_GET_PROPERTIES: 'services/rest/mail/getProperties',
    MAIL_GET_ATTACHMENTS: 'services/rest/mail/getAttachments',
    MAIL_GET_CHILDREN: 'services/rest/mail/getChildren',
    MAIL_IS_VALID: 'services/rest/mail/isValid',
    MAIL_GET_PATH: 'services/rest/mail/getPath',

    /**
     * PropertyGroup
     */
    PROPERTY_GROUP_ADD_GROUP: 'services/rest/propertyGroup/addGroup',
    PROPERTY_GROUP_REMOVE_GROUP: 'services/rest/propertyGroup/removeGroup',
    PROPERTY_GROUP_GET_GROUPS: 'services/rest/propertyGroup/getGroups',
    PROPERTY_GROUP_GET_ALL_GROUPS: 'services/rest/propertyGroup/getAllGroups',
    PROPERTY_GROUP_GET_PROPERTIES: 'services/rest/propertyGroup/getProperties',
    PROPERTY_GROUP_GET_PROPERTY_GROUP_FORM: 'services/rest/propertyGroup/getPropertyGroupForm',
    PROPERTY_GROUP_SET_PROPERTIES: 'services/rest/propertyGroup/setProperties',
    PROPERTY_GROUP_SET_PROPERTIES_SIMPLE: 'services/rest/propertyGroup/setPropertiesSimple',
    PROPERTY_GROUP_HAS_GROUP: 'services/rest/propertyGroup/hasGroup',

    /**
     * Repository
     */
    REPOSITORY_GET_ROOT_FOLDER: 'services/rest/repository/getRootFolder',
    REPOSITORY_GET_ROOT_TRASH: 'services/rest/repository/getTrashFolder',
    REPOSITORY_GET_ROOT_TEMPLATES: 'services/rest/repository/getTemplatesFolder',
    REPOSITORY_GET_ROOT_PERSONAL: 'services/rest/repository/getPersonalFolder',
    REPOSITORY_GET_ROOT_MAIL: 'services/rest/repository/getMailFolder',
    REPOSITORY_GET_ROOT_THESAURUS: 'services/rest/repository/getThesaurusFolder',
    REPOSITORY_GET_ROOT_CATEGORIES: 'services/rest/repository/getCategoriesFolder',
    REPOSITORY_PURGE_TRASH: 'services/rest/repository/purgeTrash',
    REPOSITORY_GET_UPDATE_MESSAGE: 'services/rest/repository/getUpdateMessage',
    REPOSITORY_GET_RESPOSITORY_UUID: 'services/rest/repository/getRepositoryUuid',
    REPOSITORY_HAS_NODE: 'services/rest/repository/hasNode',
    REPOSITORY_GET_NODE_PATH: 'services/rest/repository/getNodePath',
    REPOSITORY_GET_NODE_UUID: 'services/rest/repository/getNodeUuid',
    REPOSITORY_GET_APP_VERSION: 'services/rest/repository/getAppVersion',
    REPOSITORY_EXECUTE_SCRIPT: 'services/rest/repository/executeScript',
    REPOSITORY_EXECUTE_SQL_QUERY: 'services/rest/repository/executeSqlQuery',
    REPOSITORY_EXECUTE_HQL_QUERY: 'services/rest/repository/executeHqlQuery',

    /**
     * Search
     */
    REPOSITORY_FIND_BY_CONTENT: 'services/rest/search/findByContent',
    REPOSITORY_FIND_BY_NAME: 'services/rest/search/findByName',
    REPOSITORY_FIND_BY_KEYWORDS: 'services/rest/search/findByKeywords',
    REPOSITORY_FIND: 'services/rest/search/find',
    REPOSITORY_FIND_PAGINATED: 'services/rest/search/findPaginated',
    REPOSITORY_FIND_SIMPLE_QUERY_PAGINATED: 'services/rest/search/findSimpleQueryPaginated',
    REPOSITORY_FIND_MORE_LIKE_THIS: 'services/rest/search/findMoreLikeThis',
    REPOSITORY_GET_KEYWORD_MAP: 'services/rest/search/getKeywordMap',
    REPOSITORY_GET_CATEGORIZED_DOCUMENTS: 'services/rest/search/getCategorizedDocuments',
    REPOSITORY_SAVE_SEARCH: 'services/rest/search/saveSearch',
    REPOSITORY_UPDATE_SEARCH: 'services/rest/search/updateSearch',
    REPOSITORY_GET_SEARCH: 'services/rest/search/getSearch',
    REPOSITORY_GET_ALL_SEARCH: 'services/rest/search/getAllSearchs',
    REPOSITORY_DELETE_SEARCH: 'services/rest/search/deleteSearch',

    /**
     * Property
     */
    PROPERTY_ADD_CATEGORY: 'services/rest/property/addCategory',
    PROPERTY_REMOVE_CATEGORY: 'services/rest/property/removeCategory',
    PROPERTY_ADD_KEYWORD: 'services/rest/property/addKeyword',
    PROPERTY_REMOVE_KEYWORD: 'services/rest/property/removeKeyword',
    PROPERTY_SET_ENCRYPTION: 'services/rest/property/setEncryption',
    PROPERTY_UNSET_ENCRYPTION: 'services/rest/property/unsetEncryption',
    PROPERTY_SET_SIGNED: 'services/rest/property/setSigned',

    /**
     *  Workflow
     */
    WORKFLOW_REGISTER_PROCESS_DEFINITION: 'services/rest/workflow/registerProcessDefinition',
    WORKFLOW_DELETE_PROCESS_DEFINITION: 'services/rest/workflow/deleteProcessDefinition',
    WORKFLOW_GET_PROCESS_DEFINITION: 'services/rest/workflow/getProcessDefinition',
    WORKFLOW_RUN_PROCESS_DEFINITION: 'services/rest/workflow/runProcessDefinition',
    WORKFLOW_FIND_PROCESS_INSTANCES: 'services/rest/workflow/findProcessInstances',
    WORKFLOW_FIND_ALL_PROCESS_DEFINITIONS: 'services/rest/workflow/findAllProcessDefinitions',
    WORKFLOW_FIND_LATEST_PROCESS_DEFINITIONS: 'services/rest/workflow/findLatestProcessDefinitions',
    WORKFLOW_FIND_LAST_PROCESS_DEFINITION: 'services/rest/workflow/findLastProcessDefinition',
    WORKFLOW_GET_PROCESS_INSTANCE: 'services/rest/workflow/getProcessInstance',
    WORKFLOW_FIND_USER_TASK_INSTANCES: 'services/rest/workflow/findUserTaskInstances',
    WORKFLOW_FIND_TASK_INSTANCES: 'services/rest/workflow/findTaskInstances',
    WORKFLOW_SET_TASK_INSTANCE_VALUES: 'services/rest/workflow/setTaskInstanceValues',
    WORKFLOW_GET_TASK_INSTANCE: 'services/rest/workflow/getTaskInstance',
    WORKFLOW_SET_TASK_INSTANCE_ACTOR_ID: 'services/rest/workflow/setTaskInstanceActorId',
    WORKFLOW_START_TASKINSTANCE: 'services/rest/workflow/startTaskInstance',
    WORKFLOW_END_TASKINSTANCE: 'services/rest/workflow/endTaskInstance',
    WORKFLOW_GET_PROCESS_DEFINITION_FORMS: 'services/rest/workflow/getProcessDefinitionForms'

    /**
     * getUri
     */
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
