import { DocumentType, EditDocumentType, key, StoreState } from '../../../Interface/FileBrowser';
import { create } from '../../../__mocks__/zustand';

export const useBrowserStore = create<StoreState>((set, get) => ({
    fileMap: new Map<string, DocumentType>(),
    root: null,
    selected: [],
    farthestPath: null,
    focused: null,
    splitScreen: true,
    initiateFileBrowser: (documents: DocumentType[]) => {
        if (Array.isArray(documents) && documents.length > 0) {
            const copy = new Map();
            documents.forEach((document) => {
                copy.set(document.id, document);
            });
            set(() => ({ fileMap: copy }));
        }
        return true;
    },
    actions: {
        createDocument: (key: key, val: DocumentType | undefined) => {
            set((state) => ({ fileMap: new Map(state.fileMap).set(key, val) }));
            return true;
        },
        getDocument: (key: string) => {
            return get().fileMap.get(key);
        },
        documentExists: (key: string) => {
            return get().fileMap.has(key);
        },
        setRoot: (key: key) => {
            set(() => ({ root: key ?? null }));
            return true;
        },
        setSelected: (selected: Array<string>) => {
            set(() => ({ selected: selected ?? null }));
            return true;
        },
        setFocused: (focused: string | null) => {
            set(() => ({ focused: focused ?? null }));
            return true;
        },
        setSplitScreen: (splitScreen: boolean) => {
            set(() => ({ splitScreen: splitScreen }));
        },
        clear: () => {
            set(() => ({ fileMap: new Map() }));
            return get().fileMap.size === 0;
        },
        delete: (key: key) => {
            set((state) => {
                const mapCopy = new Map(state.fileMap);
                mapCopy.delete(key);
                return {
                    fileMap: mapCopy
                };
            });
            return !get().fileMap.has(key);
        },
        getChildren: (parent: string | null) => {
            if (parent && get().fileMap.has(parent)) {
                const children: Array<string | null> | null | undefined = get().fileMap.get(parent)?.children;
                return children !== undefined ? children : null;
            } else return null;
        },
        changeDetails: (key: key | null, details: EditDocumentType): boolean | Error => {
            try {
                if (key === null || key === undefined) throw new Error('You did not select a valid file id');
                const doc = get().fileMap.get(key);
                if (doc === undefined) throw Error('Document is not in the map');

                const properties = Object.keys(details);
                if (properties.length < 1) throw Error('You did not enter any properties for modification');
                properties.forEach((property) => {
                    const _property = property as keyof EditDocumentType;
                    if (doc[_property] !== undefined && details[_property]) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        doc[_property] = details[_property];
                    } else {
                        throw new Error(`The Property ${_property} does not exist in Document ${doc.doc_name}`);
                    }
                });
                get().fileMap.set(key, doc);
                return true;
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to create folder');
            }
        },
        move: (key: string | null, target: string | null): boolean | Error => {
            try {
                const mapCopy = new Map(get().fileMap);
                const removeFromCurrentParent = (prevParent: key, childKey: key) => {
                    const prevParentValue = mapCopy.get(prevParent);
                    if (prevParentValue !== null && prevParentValue !== undefined) {
                        const children = prevParentValue.children;
                        if (!Array.isArray(children)) throw Error('The selected folder may have already been moved ');
                        const obj = { ...prevParentValue };
                        obj.children = Array.isArray(children) ? [...children.filter((child) => child !== childKey)] : null;
                        mapCopy.set(prevParent, obj);
                    }
                };

                const changeParentFolder = (childKey: key, targetkey: key) => {
                    const childValue = mapCopy.get(childKey);
                    if (childValue !== null && childValue !== undefined) {
                        const obj = { ...childValue };
                        obj.parent = targetkey;
                        mapCopy.set(childKey, obj);
                    }
                };

                if (key === null || key === undefined) throw new Error('You did not select a valid folder id');
                if (target === null || target === undefined) throw new Error('You may be moving the document to non-existent folder');

                const doc = mapCopy.get(key);
                if (doc === undefined) throw new Error('This folder does not exist in fileMap');
                if (key === target) throw new Error('Cannot move folder into itself');

                if (Array.isArray(doc.children) && doc.children.includes(target))
                    throw new Error('Cannot move a parent folder into a child folder');
                const prevParent = doc.parent;
                if (prevParent === target) throw new Error('You cannot move a document to the same location');
                if (prevParent === null || prevParent === undefined)
                    throw new Error('The Folder you are moving from may have been deleted, Reload to view this');
                removeFromCurrentParent(prevParent, key);
                changeParentFolder(key, target);
                const targetValue = mapCopy.get(target);
                if (targetValue === null || targetValue === undefined) throw Error('The target folder does not seem to exist');
                const targetChildren = targetValue?.children;
                if (Array.isArray(targetChildren)) {
                    const obj = { ...targetValue };
                    obj.children = [...targetChildren, key];
                    mapCopy.set(target, obj);
                    set(() => ({ fileMap: mapCopy }));
                    return true;
                } else {
                    const obj = { ...targetValue };
                    obj.children = [key];
                    mapCopy.set(target, obj);
                    set(() => ({ fileMap: mapCopy }));
                    return true;
                }
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to move folder');
            }
        },
        uploadFiles: (parent: string, files: DocumentType[]): boolean | Error => {
            try {
                const mapCopy = new Map(get().fileMap);
                if (parent === null || parent === undefined || !mapCopy.has(parent))
                    throw new Error('The folder you are uploading appears to have been deleted, reload to check for changes');
                const parentDoc = mapCopy.get(parent);
                if (parentDoc === undefined)
                    throw new Error('The folder you are uploading appears to have been deleted, reload to check for changes');

                if (Array.isArray(files) && files.length > 0) {
                    const children = Array.isArray(parentDoc.children) && parentDoc.children.length > 0 ? [...parentDoc.children] : [];
                    files.forEach((file) => {
                        children.push(file.id);
                        mapCopy.set(file.id, file);
                    });
                    parentDoc.children = children;
                    mapCopy.set(parent, parentDoc);
                    set(() => ({ fileMap: mapCopy }));
                    return true;
                    // changeDetails(parent, { children: children })
                } else {
                    throw new Error('No files were selected');
                }
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to upload Files');
            }
        },
        deleteById: (key: key | null): boolean | Error => {
            try {
                const mapCopy = new Map(get().fileMap);
                if (key === null || key === undefined) throw new Error('The id of the document is invalid, please select a valid document');
                if (!mapCopy.has(key)) throw new Error('This file does not exist it may have been deleted');
                const parentDoc = mapCopy.get(key);
                if (parentDoc !== null && parentDoc !== undefined) {
                    const prevParentChildren = parentDoc.children;
                    if (Array.isArray(prevParentChildren)) {
                        mapCopy.set(parentDoc.id, { ...parentDoc, children: [...prevParentChildren.filter((x) => x !== key)] });
                    }
                } else {
                    throw new Error(
                        'Could not delete from document from parent document, maybe the parent folder has already been deleted'
                    );
                }
                return mapCopy.delete(key);
            } catch (e) {
                if (e instanceof Error) {
                    return e;
                }
                return typeof e === 'string' ? new Error(e) : new Error('Failed to delete document');
            }
        }
    }
}));
