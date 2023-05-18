import { renderHook, act } from '@testing-library/react';
import { DocumentType, Units } from '../Interface/FileBrowser';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';

// jest.mock('../data/global_state/slices/BrowserMock');

export const documents: DocumentType[] = [
    {
        id: '1',
        doc_name: 'folder 1',
        is_dir: true,
        size: 20,
        size_units: Units.Mb,
        is_archived: false,
        parent: 'root',
        children: null,
        type: 'pdf'
    }
];

describe('useBrowserModel', () => {
    it('Should return a Map containing a list of documents', async () => {
        const map = new Map();

        const { result } = renderHook(() => useBrowserStore());
        map.set('1', documents[0]);
        const { initiateFileBrowser } = result.current;
        await act(async () => {
            initiateFileBrowser(documents);
        });
        // console.log(newFileMap, "MAP")
        // const { result } = renderHook(() => useModel('root', documents))
        expect(map).toStrictEqual(result.current.fileMap);
    });
    it('Should add a document with id 2 to the fileMap', async () => {
        const fileMap = new Map();
        fileMap.set('1', documents[0]);
        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser, actions } = result.current;
        await act(async () => {
            initiateFileBrowser(documents);
        });
        // const { result } = renderHook(() => useModel('root', documents))
        const copyDoc: DocumentType = { ...documents[0] };
        copyDoc.id = '2';
        copyDoc.doc_name = 'folder 2';
        await act(async () => {
            // result.current.actions.set('2', copyDoc)
            actions.createDocument('2', copyDoc);
        });
        fileMap.set('2', copyDoc);
        expect(fileMap).toStrictEqual(result.current.fileMap);
        // expect(fileMap).toStrictEqual(result.current.fileMap)
    });
    it('Should set the fileMap to an empty map and the root to null', async () => {
        const fileMap = new Map();
        fileMap.set('1', documents[0]);
        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser, actions } = result.current;
        await act(async () => {
            initiateFileBrowser(documents);
        });
        await act(async () => {
            actions.clear();
        });
        fileMap.clear();
        expect(fileMap).toStrictEqual(result.current.fileMap);
    });
    // it('Should Delete a document with an input identifier of 1 and if this key is the root set the root to null', async () => {
    //     const fileMap = new Map()
    //     fileMap.set('1', documents[0])
    //     const { result } = renderHook(() => useBrowserStore())
    //     const { initiateFileBrowser, actions } = result.current
    //     await act(async () => {
    //         initiateFileBrowser(documents);
    //     })
    //     let deleted: boolean | Error = false
    //     await act(async () => {
    //         deleted = actions.delete('1')
    //     })
    //     expect(fileMap.delete('1')).toStrictEqual(deleted)
    //     expect(fileMap).toStrictEqual(result.current.fileMap)
    // })
    it('Should return true if the input node identifier is found within the fileMap and false if otherwise', async () => {
        const fileMap = new Map();
        fileMap.set('1', documents[0]);
        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser } = result.current;
        await act(async () => {
            initiateFileBrowser(documents);
        });
        expect(false).toBe(fileMap.has(result.current.fileMap.has('1')));
    });
    it('Should return an array of document that are children of the given input node identifier', async () => {
        const fileMap = new Map();
        const copy_doc = { ...documents[0] };
        const doc2 = { ...documents[0] };
        doc2.id = '2';
        doc2.doc_name = 'folder 2';
        const doc3 = { ...documents[0] };
        doc3.id = '3';
        doc3.doc_name = 'folder 3';
        copy_doc.children = ['2', '3', '600'];
        fileMap.set('1', copy_doc);
        fileMap.set('2', doc2);
        fileMap.set('3', doc3);
        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser, actions } = result.current;

        await act(async () => {
            initiateFileBrowser([copy_doc]);
            actions.createDocument('2', doc2);
            actions.createDocument('3', doc3);
        });
        expect(fileMap).toStrictEqual(result.current.fileMap);

        let children: Array<DocumentType | undefined> | null = null;
        const childrenIds = fileMap.get('1').children;
        if (Array.isArray(childrenIds) && childrenIds.length > 0) {
            children = childrenIds.map((child) => {
                const childDoc = fileMap.get(child);
                if (childDoc) {
                    return childDoc;
                } else return undefined;
            });
        }
        expect(children).toStrictEqual(actions.getChildren('1'));
        expect(null).toBe(actions.getChildren(null));
        expect(null).toBe(actions.getChildren('2'));
    });
    it('Should mutate a node given its identifier and an object containing its key value pairs to be mutated, Should return false if mutation failed', async () => {
        const fileMap = new Map<string, DocumentType>();
        const copy_doc = { ...documents[0] };
        fileMap.set('1', copy_doc);
        // const { result } = renderHook(() => useModel('1', [copy_doc]))
        const { result } = renderHook(() => useBrowserStore());
        copy_doc.doc_name = 'folder 0 mutated';
        fileMap.set('1', copy_doc);
        const { initiateFileBrowser, actions } = result.current;

        await act(async () => {
            initiateFileBrowser([copy_doc]);
        });
        expect(fileMap).toStrictEqual(result.current.fileMap);
        await act(async () => {
            actions.changeDetails('1', { doc_name: 'folder 1 mutated' });
        });
        expect(fileMap.get('1')?.doc_name).toStrictEqual(result.current.fileMap.get('1')?.doc_name);
        let val: boolean | Error = false;
        await act(async () => {
            val = actions.changeDetails('20', { doc_name: 'folder 1 mutated' });
        });
        expect(new Error('Document is not in the map')).toStrictEqual(val);
        await act(async () => {
            val = actions.changeDetails('1', {});
        });
        expect(new Error('You did not enter any properties for modification')).toStrictEqual(val);
        await act(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            val = actions.changeDetails('1', { new: 'test' });
        });
        expect(Error(`The Property new does not exist in Document folder 1 mutated`)).toStrictEqual(val);
    });
    it('Should move this child node to nest in the given parent node', async () => {
        const fileMap = new Map<string, DocumentType>();
        const copy_doc = { ...documents[0] };
        let val;
        let val2;

        const doc2 = { ...documents[0] };
        const doc3 = { ...documents[0] };
        const doc4 = { ...documents[0] };

        doc2.doc_name = 'folder 2';
        doc2.id = '2';
        doc2.parent = '1';
        doc3.doc_name = 'folder 3';
        doc3.id = '3';
        doc4.doc_name = 'folder 4';
        doc4.id = '4';
        doc4.parent = '1';
        copy_doc.children = ['2', '4'];

        fileMap.set('1', copy_doc);
        fileMap.set('2', doc2);
        fileMap.set('3', doc3);
        fileMap.set('4', doc4);

        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser, actions } = result.current;

        await act(async () => {
            initiateFileBrowser([copy_doc]);
            actions.createDocument('2', doc2);
            actions.createDocument('3', doc3);
            actions.createDocument('4', doc4);
        });

        expect(fileMap).toStrictEqual(result.current.fileMap);
        expect(fileMap.get('2')?.parent).toStrictEqual(result.current.fileMap.get('2')?.parent);

        await act(async () => {
            val = actions.move('2', '1');
            val2 = actions.move('1', '1');
        });
        expect(new Error('You cannot move a document to the same location')).toStrictEqual(val);
        expect(new Error('Cannot move folder into itself')).toStrictEqual(val2);

        await act(async () => {
            val = actions.move('2', '3');
        });

        copy_doc.children = ['4'];
        doc2.parent = '3';
        doc3.children = ['2'];
        fileMap.set('1', copy_doc);
        fileMap.set('2', doc2);
        fileMap.set('3', doc3);

        expect(fileMap).toStrictEqual(result.current.fileMap);

        await act(async () => {
            val = actions.move('4', '3');
        });

        copy_doc.children = [];
        doc4.parent = '3';
        doc3.children = ['2', '4'];
        fileMap.set('1', copy_doc);
        fileMap.set('2', doc2);
        fileMap.set('3', doc3);

        expect(fileMap).toStrictEqual(result.current.fileMap);

        await act(async () => {
            val = actions.move('2', '20');
        });
        expect(new Error('The target folder does not seem to exist')).toStrictEqual(val);
        await act(async () => {
            val = actions.move('20', '2');
        });
        expect(new Error('This folder does not exist in fileMap')).toStrictEqual(val);
        await act(async () => {
            val = actions.move('2', null);
        });
        expect(new Error('You may be moving the document to non-existent folder')).toStrictEqual(val);
    });
    it('Should upload files from the users file system', async () => {
        const fileMap = new Map<string | number, DocumentType>();
        const copy_doc = { ...documents[0] };
        let val;
        let val2;

        const doc2 = { ...documents[0] };
        const doc3 = { ...documents[0] };
        doc2.doc_name = 'folder 2';
        doc2.id = '2';
        doc3.doc_name = 'folder 3';
        doc3.id = '3';
        fileMap.set('1', copy_doc);
        fileMap.set('2', doc2);
        fileMap.set('3', doc3);

        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser, actions } = result.current;

        // const { result } = renderHook(() => useModel('1', [copy_doc]))
        await act(async () => {
            initiateFileBrowser([copy_doc]);
            actions.createDocument('2', doc2);
            actions.createDocument('3', doc3);
        });
        expect(fileMap).toStrictEqual(result.current.fileMap);
        await act(async () => {
            actions.uploadFiles('1', [doc2, doc3]);
            val = actions.uploadFiles('20', [doc2]);
            val2 = actions.uploadFiles('1', []);
        });
        expect(new Error('The folder you are uploading appears to have been deleted, reload to check for changes')).toStrictEqual(val);
        expect(new Error('No files were selected')).toStrictEqual(val2);

        doc2.parent = '1';
        doc3.parent = '1';
        copy_doc.children = [doc2, doc3].map((doc) => doc.id);
        expect(fileMap).toStrictEqual(result.current.fileMap);
    });
    it('Should Delete a document with an input identifier of 1 and if this key is the root set the root to null', async () => {
        const fileMap = new Map();
        fileMap.set('1', documents[0]);
        fileMap.set('2', undefined);
        const { result } = renderHook(() => useBrowserStore());
        const { initiateFileBrowser, actions } = result.current;
        let val;
        let val2;
        let val3;
        let val4;

        await act(async () => {
            initiateFileBrowser(documents);
            actions.createDocument('2', undefined);
        });
        expect(fileMap).toStrictEqual(result.current.fileMap);
        await act(async () => {
            val = actions.deleteById('1');
            val2 = actions.deleteById(null);
            val3 = actions.deleteById('20');
            val4 = actions.deleteById('2');
        });

        expect(new Error('The id of the document is invalid, please select a valid document')).toStrictEqual(val2);
        expect(new Error('This file does not exist it may have been deleted')).toStrictEqual(val3);
        expect(
            new Error('Could not delete from document from parent document, maybe the parent folder has already been deleted')
        ).toStrictEqual(val4);

        expect(fileMap.delete('1')).toStrictEqual(val);
    });
});
