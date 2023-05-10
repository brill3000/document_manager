import { renderHook, act } from '@testing-library/react';
import { DocumentType, Units } from '../Interface/FileBrowser';
import { useModel } from '../data/Model';


export const documents: DocumentType[] = [{
    id: '1',
    doc_name: 'folder 1',
    is_dir: true,
    size: 20,
    size_units: Units.Mb,
    is_archived: false,
    parent: 'root',
    children: null,
    type: 'pdf'
}]




describe('useModel', () => {

    it('Should return a Map containing a list of documents', async () => {
        const map = new Map()

        map.set('1', documents[0])

        const { result } = renderHook(() => useModel('root', documents))
        expect(map).toStrictEqual(result.current.fileMap)
    })
    it('Should return a `root` as the root of the fileMap', () => {
        const fileMap = new Map()
        fileMap.set('1', documents[0])
        const { result } = renderHook(() => useModel('root', documents))

        expect('root').toStrictEqual(result.current.root)
    })
    it('Should add a document with id 2 to the fileMap', async () => {
        const fileMap = new Map()
        fileMap.set('1', documents[0])
        const { result } = renderHook(() => useModel('root', documents))
        const copyDoc: DocumentType = { ...documents[0] }
        copyDoc.id = '2'
        copyDoc.doc_name = 'folder 2'
        await act(async () => {
            result.current.actions.set('2', copyDoc)
        })
        fileMap.set('2', copyDoc)
        expect(fileMap).toStrictEqual(result.current.fileMap)
    })
    it('Should set the fileMap to an empty map and the root to null', async () => {
        const fileMap = new Map()
        fileMap.set('1', documents[0])
        const { result } = renderHook(() => useModel('root', documents))
        await act(async () => {
            result.current.actions.clear()
        })
        fileMap.clear()
        expect(fileMap).toStrictEqual(result.current.fileMap)
        expect(null).toBe(result.current.root)
    })
    it('Should Delete a document with an input identifier of 1 and if this key is the root set the root to null', async () => {
        let root: string | null = '1'
        const fileMap = new Map()
        fileMap.set('1', documents[0])
        const { result } = renderHook(() => useModel('1', documents))
        await act(async () => {
            result.current.actions.delete('1')
        })
        if (root === '1') root = null
        fileMap.delete('1')
        expect(fileMap).toStrictEqual(result.current.fileMap)
        expect(root).toStrictEqual(result.current.root)
    })
    it('Should return true if the input node identifier is found within the fileMap and false if otherwise', async () => {
        const fileMap = new Map()
        fileMap.set('1', documents[0])
        const { result } = renderHook(() => useModel('1', documents))
        let docExists = false
        await act(async () => {
            docExists = result.current.actions.has('1')
        })
        expect(false).toBe(fileMap.has(docExists))
    })
    it('Should return an array of document that are children of the given input node identifier', async () => {
        const fileMap = new Map()
        const copy_doc = { ...documents[0] }
        const doc2 = { ...documents[0] }
        doc2.id = '2'
        doc2.doc_name = 'folder 2'
        const doc3 = { ...documents[0] }
        doc3.id = '3'
        doc3.doc_name = 'folder 3'
        copy_doc.children = ['2', '3', '600']
        fileMap.set('1', copy_doc)
        fileMap.set('2', doc2)
        fileMap.set('3', doc3)
        const { result } = renderHook(() => useModel('1', [copy_doc]))
        await act(async () => {
            result.current.actions.set('2', doc2)
            result.current.actions.set('3', doc3)
        })
        let children: Array<DocumentType | undefined> | null = null
        const childrenIds = fileMap.get('1').children
        if (Array.isArray(childrenIds) && childrenIds.length > 0) {
            children = childrenIds.map(child => {
                const childDoc = fileMap.get(child)
                if (childDoc) {
                    return childDoc
                } else return undefined
            })
        }
        expect(children).toStrictEqual(result.current.actions.getChildren('1'))
        expect(null).toBe(result.current.actions.getChildren(null))
        expect(null).toBe(result.current.actions.getChildren('2'))


    })
    it('Should mutate a node given its identifier and an object containing its key value pairs to be mutated, Should return false if mutation failed', async () => {
        const fileMap = new Map<string, DocumentType>()
        const copy_doc = { ...documents[0] }
        fileMap.set('1', copy_doc)
        const { result } = renderHook(() => useModel('1', [copy_doc]))
        copy_doc.doc_name = 'folder 0 mutated'
        fileMap.set('1', copy_doc)
        await act(async () => {
            result.current.actions.changeDetails('1', { doc_name: 'folder 1 mutated' })
        })
        expect(fileMap.get('1')?.doc_name).toStrictEqual(result.current.fileMap.get('1')?.doc_name)
        let val = null
        await act(async () => {
            val = result.current.actions.changeDetails('20', { doc_name: 'folder 1 mutated' })
        })
        expect(new Error('Document is not in the map')).toStrictEqual(val)
        await act(async () => {
            val = result.current.actions.changeDetails('1', {})
        })
        expect(new Error('You did not enter any properties for modification')).toStrictEqual(val)
        await act(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            val = result.current.actions.changeDetails('1', { new: 'test' })
        })
        expect(Error(`The Property new does not exist in Document folder 1 mutated`)).toStrictEqual(val)

    })
    it('Should move this child node to nest in the given parent node', async () => {
        const fileMap = new Map<string, DocumentType>()
        const copy_doc = { ...documents[0] }
        let val;
        let val2;

        const doc2 = { ...documents[0] }
        const doc3 = { ...documents[0] }
        doc2.doc_name = 'folder 2'
        doc2.id = '2'
        doc3.doc_name = 'folder 3'
        doc2.id = '3'
        fileMap.set('1', copy_doc)
        fileMap.set('2', doc2)
        fileMap.set('3', doc3)

        const { result } = renderHook(() => useModel('1', [copy_doc]))
        await act(async () => {
            result.current.actions.set('2', doc2)
            result.current.actions.set('3', doc3)
        })
        expect(fileMap).toStrictEqual(result.current.fileMap)
        expect(fileMap.get('2')?.parent).toStrictEqual(result.current.fileMap.get('2')?.parent)
        doc2.parent = '1'
        fileMap.set('2', doc2)
        await act(async () => {
            val = result.current.actions.move('2', '1')
            val2 = result.current.actions.move('1', '1')
        })
        expect(new Error('You cannot move a document to the same location')).toStrictEqual(val)
        expect(new Error('Cannot move folder into itself')).toStrictEqual(val2)


        await act(async () => {
            val = result.current.actions.move('2', '3')
        })
        expect('3').toStrictEqual(result.current.fileMap.get('2')?.parent)

        await act(async () => {
            val = result.current.actions.move('2', '20')
        })
        expect(new Error('The Folder you are moving to may have been deleted')).toStrictEqual(val)
        await act(async () => {
            val = result.current.actions.move('20', '2')
        })
        expect(new Error('This folder does not exist in fileMap')).toStrictEqual(val)
        await act(async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            val = result.current.actions.move('2', null)
        })
        expect(new Error('You did not select a valid file id')).toStrictEqual(val)
        doc2.parent = null
        await act(async () => {
            result.current.actions.changeDetails('2', { parent: null })
        })
        await act(async () => {
            val = result.current.actions.move('2', '1')
        })
        expect(new Error('The Folder you are moving from may have been deleted, Reload to view this')).toStrictEqual(val)
    })

    it('Should add new folder to current folder', async () => {
        const fileMap = new Map<string | number, DocumentType>()
        const copy_doc = { ...documents[0] }

        const doc2 = { ...documents[0] }
        const doc3 = { ...documents[0] }
        doc2.doc_name = 'folder 2'
        doc2.id = '2'
        doc3.doc_name = 'folder 3'
        doc3.id = '3'
        fileMap.set('1', copy_doc)
        fileMap.set('2', doc2)
        fileMap.set('3', doc3)

        const { result } = renderHook(() => useModel('1', [copy_doc]))
        await act(async () => {
            result.current.actions.set('2', doc2)
            result.current.actions.set('3', doc3)
        })
        expect(fileMap).toStrictEqual(result.current.fileMap)
        const doc4 = { ...documents[0] }
        doc4.id = '4'
        doc4.doc_name = 'folder 4'
        doc4.parent = '2'

        fileMap.set('4', doc4)

        await act(async () => {
            result.current.actions.createFolder('2', doc4)
        })
        expect(fileMap.get('4')).toBe(result.current.fileMap.get('4'))
    })
    it('Should upload files from the users file system', async () => {
        const fileMap = new Map<string | number, DocumentType>()
        const copy_doc = { ...documents[0] }
        let val;

        const doc2 = { ...documents[0] }
        const doc3 = { ...documents[0] }
        doc2.doc_name = 'folder 2'
        doc2.id = '2'
        doc3.doc_name = 'folder 3'
        doc2.id = '3'
        fileMap.set('1', copy_doc)
        fileMap.set('2', doc2)
        fileMap.set('3', doc3)

        const { result } = renderHook(() => useModel('1', [copy_doc]))
        await act(async () => {
            result.current.actions.set('2', doc2)
            result.current.actions.set('3', doc3)
        })
        expect(fileMap).toStrictEqual(result.current.fileMap)
        const files = Array.from(Array(10).keys()).map((x) => {
            const doc = documents[0]
            doc.id = x + 'file'
            doc.doc_name = 'file' + x
            doc.is_dir = false
            return doc
        })
        files.forEach(file => {
            fileMap.set(file.id, file)
        })
        doc2.children = files.map(file => file.id)
        fileMap.set('2', doc2)
        await act(async () => {
            result.current.actions.uploadFiles('2', files)
            val = result.current.actions.uploadFiles('1', [])
        })
        expect(fileMap.get('2')?.children).toBe(result.current.fileMap.get('2')?.children)
        expect(new Error('No files were selected')).toStrictEqual(val)

    })
})