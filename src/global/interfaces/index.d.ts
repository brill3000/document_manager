import { PermissionTypes, RolePermission, UserPermission } from 'components/documents/Interface/FileBrowser';
import { Dispatch, SetStateAction } from 'react';

export type MimeTypeConfigInterface = {
    // MIME types:> NOTE Keep on sync with default.sql
    MIME_UNDEFINED: 'application/octet-stream';
    // Application
    MIME_RTF: 'application/rtf';
    MIME_JSON: 'application/json';
    MIME_PDF: 'application/pdf';
    MIME_ZIP: 'application/zip';
    MIME_POSTSCRIPT: 'application/postscript';
    MIME_MS_WORD: 'application/msword';
    MIME_MS_EXCEL: 'application/vnd.ms-excel';
    MIME_MS_POWERPOINT: 'application/vnd.ms-powerpoint';
    MIME_MS_WORD_2007: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    MIME_MS_EXCEL_2007: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    MIME_MS_POWERPOINT_2007: 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    MIME_OO_TEXT: 'application/vnd.oasis.opendocument.text';
    MIME_OO_SPREADSHEET: 'application/vnd.oasis.opendocument.spreadsheet';
    MIME_OO_PRESENTATION: 'application/vnd.oasis.opendocument.presentation';
    MIME_SWF: 'application/x-shockwave-flash';
    MIME_JAR: 'application/x-java-archive';
    MIME_EPUB: 'application/epub+zip';
    // Image
    MIME_DXF: 'image/vnd.dxf';
    MIME_DWG: 'image/vnd.dwg';
    MIME_TIFF: 'image/tiff';
    MIME_JPEG: 'image/jpeg';
    MIME_GIF: 'image/gif';
    MIME_PNG: 'image/png';
    MIME_BMP: 'image/bmp';
    MIME_PSD: 'image/x-psd';
    MIME_ICO: 'image/x-ico';
    MIME_PBM: 'image/pbm';
    MIME_SVG: 'image/svg+xml';
    // Video
    MIME_MP4: 'video/mp4';
    MIME_MPEG: 'video/mpeg';
    MIME_FLV: 'video/x-flv';
    MIME_WMV: 'video/x-ms-wmv';
    MIME_AVI: 'video/x-msvideo';
    // Text
    MIME_HTML: 'text/html';
    MIME_TEXT: 'text/plain';
    MIME_XML: 'text/xml';
    MIME_CSV: 'text/csv';
    MIME_CSS: 'text/css';
    // Language
    MIME_SQL: 'text/x-sql';
    MIME_JAVA: 'text/x-java';
    MIME_SCALA: 'text/x-scala';
    MIME_PYTHON: 'text/x-python';
    MIME_GROOVY: 'text/x-groovy';
    MIME_DIFF: 'text/x-diff';
    MIME_PASCAL: 'text/x-pascal';
    MIME_CSHARP: 'text/x-csharp';
    MIME_CPP: 'text/x-c++';
    MIME_APPLESCRIPT: 'text/applescript';
    MIME_SH: 'application/x-shellscript';
    MIME_BSH: 'application/x-bsh';
    MIME_PHP: 'application/x-php';
    MIME_PERL: 'application/x-perl';
    MIME_JAVASCRIPT: 'application/javascript';
    MIME_AS3: 'application/x-font-truetype';
    // Mail
    MIME_OUTLOOK: 'application/vnd.ms-outlook';
    MIME_EML: 'message/rfc822';
};
type AcceptedFilesType<T extends Record<string, string>> = {
    [K in T[keyof T]]: any[];
};
export interface User {
    first_name: string;
    last_name: string;
}

export interface UserResponse {
    TOKEN: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
export interface IWorkflowRequest {
    pdId: string;
}
export interface IRunWorkflowRequest {
    pdId: string;
    uuid: string;
    values: IFormElementsComplex[];
}

export interface IWorkflowPanelProps {
    isSending: boolean;
    setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    nodes: Array<any>;
    edges: Array<any>;
    openForm: boolean;
    setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
    onAdd: (title: string, actions?: { type: string; action: string }) => void;
    setNodes: any;
    setEdges: any;
}
export interface INewFormTitle {
    newFormTitle: string;
    handleNewFormTitleChange: React.ChangeEventHandler<HTMLInputElement>;
    openEditIndex: { input: boolean; large_input: boolean; checkbox: boolean; radio: boolean; select: boolean; submit: boolean };
    setOpenEditIndex: React.Dispatch<
        React.SetStateAction<{ input: boolean; large_input: boolean; checkbox: boolean; radio: boolean; select: boolean; submit: boolean }>
    >;
    setEditDetails: React.Dispatch<React.SetStateAction<Array<any>>>;
    addFormComponent: (
        type: string,
        label: string,
        uid: string,
        placeholder?: string,
        minRows?: number,
        isRequired?: boolean | string,
        initialValue?: string,
        defaultChecked?: boolean
    ) => void;
    formComponents: any[];
    savedForms: any[];
    setSavedForms: React.Dispatch<React.SetStateAction<any[]>>;
    setFormComponents: React.Dispatch<React.SetStateAction<any[]>>;
    setNewFormTitle: React.Dispatch<React.SetStateAction<string>>;
    editDetails: any;
}
export interface IFormElementsComplex {
    height: string;
    label: string;
    name: string;
    objClass: string;
    options: any[];
    readonly: boolean;
    type: string;
    validators: any[];
    value: string;
    width: string;
}
type ProcessDefinitionFormKeys = 'tasks' | 'run_config';

export interface IProcessDefinitionForm {
    processDefinitionForm: { key: ProcessDefinitionFormKeys; formElementsComplex: IFormElementsComplex[] }[];
}
export interface IProcessDefinition {
    id: number;
    name: string;
    nodes: GenericDocument[];
}

export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    active: string;
}

export interface CreateRoleRequest {
    role: string;
    active: string;
}

export interface GrantNodeRequest {
    nodeId: string;
    permissions: number;
    recursive: boolean;
}
export interface GrantRoleRequest extends GrantNodeRequest {
    role: string;
    type: keyof RolePermission;
}
export interface GrantUserRequest extends GrantNodeRequest {
    user: string;
    type: keyof UserPermission;
}
export interface AssignRoleRequest {
    user: string;
    active: string;
}
export interface DeleteUserRequest {
    user: string;
    active: string;
}

export interface GetDocumentContentProps {
    docId: string;
}

interface DeleteDocRequest {
    parent: string | null;
}
export interface DeleteFileRequest extends DeleteDocRequest {
    docId: string;
}

export interface DeleteFolderRequest extends DeleteDocRequest {
    fldId: string;
}
export interface GetDocumentContentByVersionProps extends GetDocumentContentProps {
    versionId: string;
}

export interface FolderRequestType {
    fldId: string;
}

export interface CategoryRequestType {
    categoryId: string;
}
export interface CreateDocumentProps {
    doc: Blob;
    content: string;
    fileName: string;
}
export interface CreateDocumentSimpleProps {
    docPath: string;
    file: File;
    fileName: string;
}

export interface CheckInProps extends GetDocumentContentProps {
    content: File;
    comment: string;
    increment: string;
    fileName: string;
}

export interface RenameDocumentsProps extends GetDocumentContentProps, GenericRenameProps {}

export interface MoveDocumentProps extends GetDocumentContentProps {
    dstId: string;
    currentId?: string;
    newPath?: string;
    oldPath?: string;
}
export interface AddToCategoryProps {
    nodeId: string;
    catId: string;
}
export interface AddToNoteProps {
    nodeId: string;
    text: string;
}

export interface INote {
    date: JavaCalendar;
    author: string;
    text: string;
    path: string;
}

export interface ExtendeCopyDocumentsProps extends MoveDocumentProps {
    name: string;
    categories: boolean;
    keywords: boolean;
    notes: boolean;
    propertyGroups: boolean;
    wiki: boolean;
}

export interface GetFoldersContentProps {
    fldId: string;
}
export interface JavaCalendar {
    year: number;
    month: number;
    dayOfMonth: number;
    hourOfDay: number;
    minute: number;
    second: number;
}

// ================================= | Create Generic Document type | =============================== //

export interface GenericDocument {
    author: string;
    created: JavaCalendar;
    doc_name: string;
    path: string;
    permissions: PermissionTypes;
    subscribed: boolean;
    uuid: string;
    is_dir: boolean;
    mimeType?: MimeTypeConfigInterface[keyof MimeTypeConfigInterface];
    size?: number;
    locked?: boolean;
    isLoading?: boolean;
    isExtracting?: boolean;
    progress?: number;
    error?: boolean;
    newDoc?: boolean;
    categories: FileInterface[];
    notes: INote[];
}

export type UploadedFileInterface = Omit<File, 'type'> & {
    type: MimeTypeConfigInterface[keyof MimeTypeConfigInterface];
};

export interface FolderInterface extends Omit<GenericDocument, 'permissions'> {
    hasChildren: boolean;
    permissions: PermissionTypes;
}
export interface FileInterface extends Omit<GenericDocument, 'permissions'> {
    actualVersion: ActualVersionType;
    checkedOut: boolean;
    convertibleToPdf: boolean;
    convertibleToSwf: boolean;
    lastModified: string;
    permissions: PermissionTypes;
    lockInfo: LockInfoType;
    locked: boolean;
    mimeType: MimeTypeConfigInterface[keyof MimeTypeConfigInterface];
    signed: boolean;
    title: string;
    uuid: string;
    doc_name: string;
    is_dir: boolean;
}
export interface CreateFoldersProps {
    fld: any;
}
export interface CreateFoldersSimpleProps {
    fldPath: string;
}

interface GenericRenameProps {
    newName: string;
    parent: string;
    newPath: string;
    oldPath: string;
}
export interface RenameFoldersProps extends GetFoldersContentProps, GenericRenameProps {}

export interface SetFoldersPropertiesProps {
    doc: any;
}

export interface MoveFoldersProps extends GetFoldersContentProps {
    dstId: string;
    currentId?: string;
    newPath?: string;
    oldPath?: string;
}

export interface ExtendeCopyFoldersProps extends MoveFoldersProps {
    name: string;
    categories: boolean;
    keywords: boolean;
    notes: boolean;
    propertyGroups: boolean;
    wiki: boolean;
}

export interface CreateMissingFoldersProps {
    fldPath: string;
}

export interface LockInfoType {
    nodePath: string;
    owner: string;
    token: string;
}

// =============================== | Documents: Response Types | ============================== //

export type ActualVersionType = {
    actual: boolean;
    author: string;
    checksum: string;
    created: string;
    name: number;
    size: numeber;
};
export interface GenericDocumentResponse {
    author: string;
    path: string;
    permissions: number;
    signed: boolean;
    subscribed: boolean;
    title: string;
    uuid: string;
    created: JavaCalendar;
    subscriptors: any[];
    keywords: any[];
    categories: FileInterface[];
    notes: INote[];
}
export interface FileResponseInterface extends GenericDocumentResponse {
    actualVersion: ActualVersionType;
    checkedOut: boolean;
    convertibleToPdf: boolean;
    convertibleToSwf: boolean;
    lastModified: string;
    lockInfo: LockInfoType;
    locked: boolean;
    mimeType: MimeTypeConfigInterface[keyof MimeTypeConfigInterface];
    permissions: number;
    signed: boolean;
    title: string;
}
export interface FolderReponseInterface extends GenericDocumentResponse {
    hasChildren: boolean;
}

// =============================== | Treeview | ============================== //

export interface TreeMap {
    expanded: string[];
    treeMap: Map<string, GenericDocument & { children: string[]; hasChildren: boolean }>;
    setTreeMap: Dispatch<SetStateAction<Map<string, GenericDocument & { children: string[]; hasChildren: boolean }>>>;
}

// =============================== | HOOKS: RETURN TYPE | ============================== //

export interface UseHandleActionMenuReturnType {
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleMenuClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, type: DocumentActionMenuType['type']) => void;
    renameFn: (args0: { value: string; renameTarget: { id: string; rename: boolean; is_new?: boolean } | null }) => void;
    isRenaming: boolean | null;
}

export interface DocumentActionMenuType {
    type:
        | 'open'
        | 'copy'
        | 'cut'
        | 'rename'
        | 'edit'
        | 'extract'
        | 'moveToTrash'
        | 'delete'
        | 'permissions'
        | 'add'
        | 'workflow'
        | 'new_version';
}

export interface FolderActionMenuType {
    type: 'new_folder' | 'paste' | 'paste_all' | 'edit' | 'purgeTrash' | 'purgeFolder' | 'moveToTrash';
}

export interface ListViewRowSelectedProps {
    uuid: string;
    path: string;
    locked?: boolean;
    doc_name: string;
    is_dir: boolean;
    mimeType?: MimeTypeConfigInterface[keyof MimeTypeConfigInterface];
    newDoc?: boolean;
}

// =============================== | SEARCH | ============================== //

interface QueryResults extends QueryNode {
    attachment: boolean;
    excerpt: string | null;
    score: number;
}
interface QueryNode {
    node: FileInterface;
}
export interface SearchResultsInterface {
    queryResults: QueryResults[];
}
// =============================== | FILE VIEWER | ============================== //
interface PdfPreview {
    docUrl: string;
    uniqueContainerId: string;
}
