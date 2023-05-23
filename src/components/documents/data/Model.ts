import * as React from 'react';
import { DocumentType, EditDocumentType } from '../Interface/FileBrowser';

export interface UseModelActions {
    delete: (KeyToRemove: string) => boolean | Error;
    set: (key: string, value: DocumentType) => void;
    clear: () => void;
    setValue: React.Dispatch<React.SetStateAction<Map<string, DocumentType>>>;
    has: (key: string) => boolean;
    getChildren: (parent: string | null) => Array<string | null> | null;
    changeDetails: (key: string, details: EditDocumentType) => boolean | Error;
    move: (key: string | null, parent: string | null) => boolean | Error;
    createFolder: (parent: string, folder: DocumentType) => boolean | Error;
    uploadFiles: (parent: string, files: DocumentType[]) => boolean | Error;
}
/*
    Module type interface for the useModel hook
*/
export interface UseModelExports {
    root: string | null | undefined;
    fileMap: Map<string, DocumentType>;
    actions: UseModelActions;
}
/*
    A react hook that return a generated a Tree/Graph file like structure to use in the brilliant file browser
    @deprecated This hook's functionality will be moved to global store to avoid prop drilling
    @returns {UserModelActions}
*/
export const useModel = (root: string | null | undefined, documents: DocumentType[]): UseModelExports => {
    /**
     * The base is the root of the tree, this will the entry point of the file system i.e the root folder
     */
    const [base, setBase] = React.useState<string | null | undefined>(root);
    /**
     * Is the dictionary or hash map containing documents with their ids as the key
     */
    const [map, setMap] = React.useState<Map<string, DocumentType>>(new Map<string, DocumentType>(new Map()));
    /**
     * Initiate population of the map with the array of documents supplied as parameter
     */
    React.useEffect(() => {
        Array.isArray(documents) &&
            documents.length > 0 &&
            documents.forEach((document) => {
                setMap((_map) => {
                    const copy = new Map(_map);
                    copy.set(document.id, document);
                    return copy;
                });
            });
    }, []);
    /**
     * Reset dictionaty or hash map to an empty hash map and the root to null
     */
    const clear = React.useCallback((): void => {
        setBase(null);
        setMap(new Map());
    }, []);
    /**
     * Add or Mutate value of a node given the identifier and value
     * @param {string} key
     * @param {string | DocumentType} value
     * @returns {boolean}
     * */
    const set = React.useCallback((key: string, value: DocumentType): boolean => {
        setMap((_map) => {
            const copy = new Map(_map);
            copy.set(key, value).has(key);
            return copy;
        });
        return true;
    }, []);
    /**
     * Check if node exists is in map
     * @param {string} key
     * @returns {boolean}
     * */
    const has = React.useCallback(
        (key: string): boolean => {
            return map.has(key);
        },
        [map]
    );
    /**
     * Create a new folder
     * @param {string } parent
     * @param {DocumentType} files
     * @returns {boolean}
     */
    const uploadFiles = React.useCallback(
        (parent: string, files: DocumentType[]): boolean | Error => {
            try {
                if (!parent && !map.has(parent))
                    throw new Error('The folder you are uploading appears to have been deleted, reload to check for changes');
                const parentDoc = map.get(parent);
                if (parentDoc === undefined)
                    throw new Error('The folder you are uploading appears to have been deleted, reload to check for changes');

                if (Array.isArray(files) && files.length > 0) {
                    const children = Array.isArray(parentDoc.children) && parentDoc.children.length > 0 ? [...parentDoc.children] : [];
                    files.forEach((file) => {
                        children.push(file.id);
                        set(file.id, file);
                    });
                    changeDetails(parent, { children: children });
                } else {
                    throw new Error('No files were selected');
                }
                return true;
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to uploadFiles');
            }
        },
        [map]
    );
    /**
     * Create a new folder
     * @param {string } parent
     * @param {DocumentType} files
     * @returns {boolean}
     */
    const createFolder = React.useCallback(
        (parent: string, folder: DocumentType): boolean | Error => {
            try {
                if (!parent && !map.has(parent))
                    throw new Error('The folder you are uploading appears to have been deleted, reload to check for changes');
                const parentDoc = map.get(parent);
                if (parentDoc === undefined)
                    throw new Error('The folder you are uploading appears to have been deleted, reload to check for changes');

                const children = Array.isArray(parentDoc.children) && parentDoc.children.length > 0 ? [...parentDoc.children] : [];
                children.push(folder.id);
                set(folder.id, folder);
                changeDetails(parent, { children: children });

                return true;
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to create folder');
            }
        },
        [map]
    );

    const getChildren = React.useCallback(
        (parent: string | null): Array<string | null> | null => {
            if (parent && has(parent)) {
                const children = map.get(parent)?.children;
                return children !== undefined ? children : null;
            } else return null;
        },
        [map]
    );
    const changeDetails = React.useCallback(
        (key: string, details: EditDocumentType): boolean | Error => {
            if (!key) return new Error('You did not select a valid file id');
            const doc = map.get(key);
            const properties = Object.keys(details);
            if (properties.length < 1) return Error('You did not enter any properties for modification');
            if (!doc) return Error('Document is not in the map');
            let error = null;
            properties.forEach((property) => {
                const _property = property as keyof EditDocumentType;
                if (doc[_property] !== undefined && details[_property]) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    doc[_property] = details[_property];
                } else {
                    error = new Error(`The Property ${_property} does not exist in Document ${doc.doc_name}`);
                }
            });
            if (error !== null) {
                return error;
            }
            return set(key, doc);
        },
        [map]
    );

    const move = React.useCallback(
        (key: string | null, parent: string | null): boolean | Error => {
            try {
                const mapCopy = new Map(map);
                if (!key || !parent) throw new Error('You did not select a valid file id');
                const doc = map.get(key);
                if (doc === undefined) throw new Error('This folder does not exist in fileMap');
                if (key === parent) throw new Error('Cannot move folder into itself');

                if (Array.isArray(doc.children) && doc.children.includes(parent))
                    return new Error('Cannot move a parent folder into a child folder');
                const prevParent = doc.parent;
                if (prevParent === parent) throw new Error('You cannot move a document to the same location');
                if (prevParent === null || prevParent === undefined) {
                    throw new Error('The Folder you are moving from may have been deleted, Reload to view this');
                } else {
                    const prevParentChildren = mapCopy.get(prevParent)?.children;
                    // @ts-expect
                    if (Array.isArray(prevParentChildren)) {
                        const removeChild = changeDetails(prevParent, { children: [...prevParentChildren.filter((x) => x !== key)] });

                        if (removeChild !== true) throw removeChild;
                    }
                }
                const childChange = changeDetails(key, { parent: parent });
                if (childChange !== true) {
                    throw childChange;
                }

                const children = mapCopy.get(parent)?.children;
                if (Array.isArray(children)) {
                    const parentChange = changeDetails(parent, { children: [...children, key] });
                    if (parentChange !== true) {
                        throw parentChange;
                    } else return true;
                } else {
                    const parentChange = changeDetails(parent, { children: [key] });
                    if (parentChange !== true) {
                        throw parentChange;
                    } else return true;
                }
            } catch (e) {
                if (e instanceof Error) {
                    switch (e.message) {
                        case 'Document is not in the map':
                            return new Error('The Folder you are moving to may have been deleted');
                        default:
                            return e;
                    }
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to move folder');
            }
        },
        [map]
    );

    const deleteById = React.useCallback(
        (key: string): boolean | Error => {
            try {
                let deleted = false;
                const copy = new Map(map);
                if (!has(key)) throw new Error('This file does not exist it may have been deleted');
                const parent = copy.get(key)?.parent;
                if (parent !== null && parent !== undefined) {
                    const prevParentChildren = copy.get(parent)?.children;
                    if (Array.isArray(prevParentChildren)) {
                        const removeChild = changeDetails(parent, { children: [...prevParentChildren.filter((x) => x !== key)] });
                        if (removeChild !== true) {
                            throw removeChild;
                        }
                    }
                } else {
                    throw new Error(
                        'Could not delete from document from parent document, maybe the parent folder has already been deleted'
                    );
                }
                if (copy.has(key)) {
                    deleted = copy.delete(key);
                } else {
                    throw new Error('Could not delete the document since it seems the document does not exit, Reload to see changes');
                }
                setMap(() => copy);
                if (key === base) setBase(null);
                return deleted;
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to delete document');
            }
        },
        [map]
    );
    const actions = React.useMemo(
        () => ({
            setValue: setMap,
            clear: clear,
            set: set,
            delete: deleteById,
            has: has,
            getChildren: getChildren,
            changeDetails: changeDetails,
            move: move,
            createFolder: createFolder,
            uploadFiles: uploadFiles
        }),
        [clear, set, deleteById, has, getChildren, changeDetails, move, setMap, createFolder, uploadFiles]
    );
    return {
        root: base,
        fileMap: map,
        actions: actions
    };
};
