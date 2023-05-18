import { Box, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import FileBrowserContent from './browser/Container';
import FileBrowserNavigation from './browser/navigation/bottom/Footer';
import { DocumentType, FileBrowserProps, Units } from '../Interface/FileBrowser';
import { useHistory } from '../data/History';
import { useStore } from '../data/global_state';
import FileBrowserTopNav from './browser/navigation/top/TopNav';
import { faker } from '@faker-js/faker';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';
import { useViewStore } from '../data/global_state/slices/view';
import MainCard from 'components/MainCard';

export const sampleFiles: DocumentType[] = Array.from(Array(10)).map((_, i) => {
    const id: string = i.toString() + 'file';
    return {
        id: id,
        doc_name: `${faker.lorem.lines()}`,
        is_dir: false,
        type: Math.ceil(Math.random() * 10) > i ? 'application/msword' : 'application/pdf',
        size: 20,
        dateCreated: new Date().toLocaleString(),
        size_units: Units.Mb,
        is_archived: false,
        children: null,
        parent: i === 0 ? '0folder' : '1folder'
    };
});
export const sampleFolders: DocumentType[] = Array.from(Array(10)).map((_, i) => {
    return {
        id: i.toString() + 'folder',
        doc_name: `${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()}`,
        is_dir: true,
        dateCreated: new Date().toLocaleString(),
        size_units: Units.Mb,
        size: 100,
        is_archived: false,
        parent: i === 0 ? null : i > 2 ? '1folder' : '0folder',
        children:
            i === 0
                ? ['1folder', '2folder', '0file']
                : i === 1
                ? [
                      '3folder',
                      '4folder',
                      '5folder',
                      '6folder',
                      '7folder',
                      '8folder',
                      '9folder',
                      '1file',
                      '2file',
                      '3file',
                      '4file',
                      '5file',
                      '6file'
                  ]
                : null,
        type: 'folder'
    };
});

/**
 * This is a main file browser component, it takes an array of documents and creates a virtual filebrowser using react
 */

const FileBrowser = ({ height, width, bgColor, borderRadius, browserDocuments, title }: FileBrowserProps) => {
    const { dragging } = useStore();
    const { fileMap, actions, initiateFileBrowser } = useBrowserStore();
    const { nav, select } = useHistory();
    const [selected, setSelected] = React.useState<DocumentType[]>([]);
    const [documents, setDocuments] = React.useState<(DocumentType | undefined)[]>([]);
    const topRef = React.useRef<HTMLInputElement | null>(null);
    const bottomRef = React.useRef<HTMLInputElement | null>(null);
    // const [heightContent, setHeightContent] = React.useState<number | null>(null);
    const stack = React.useRef<string[] | number[]>([]);
    const { setBrowserHeight, setBrowserWidth, browserHeight, browserWidth } = useViewStore();
    const ref = React.useRef<HTMLDivElement>(null);

    // React.useEffect(() => {
    //   if (okmUsers.isSuccess) {
    //     console.log(okmUsers.data, "DATA")
    //   } else {
    //     console.log(okmUsers, "OKM USERS")
    //   }
    // })

    React.useEffect(() => {
        initiateFileBrowser(browserDocuments ? browserDocuments : [...sampleFolders, ...sampleFiles]);
    }, []);

    const handleForward = () => {
        if (Array.isArray(stack.current) && stack.current.length >= 1) {
            select(stack.current[stack.current.length - 1]);
            stack.current.pop();
        }
    };
    const handleBack = () => {
        const navCopy = [...nav];
        if (Array.isArray(navCopy) && navCopy.length > 1) {
            const popped = navCopy.pop();
            const selected = navCopy[navCopy.length - 1];
            stack.current = [...stack.current, popped];
            select(selected);
        }
    };
    React.useEffect(() => {
        const handleWindowResize = () => {
            setBrowserHeight(window.innerHeight);
            setBrowserWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });

    React.useEffect(() => {
        setBrowserHeight(window.innerHeight * 0.96);
        setBrowserWidth(window.innerWidth * 0.96);
    }, [setBrowserHeight, setBrowserWidth]);

    React.useEffect(() => {
        try {
            if (nav.length > 0) {
                const docs = actions.getChildren(nav[nav.length - 1] ?? '0folder');
                setSelected([]);
                if (docs !== null) {
                    setDocuments(docs);
                } else {
                    setDocuments([]);
                }
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            } else {
                console.log(e);
            }
        }
    }, [nav, fileMap, actions]);
    React.useEffect(() => {
        if (nav.length < 1) {
            select('0folder');
        }
    }, [fileMap, nav.length, select]);
    React.useEffect(() => {
        dragging ? document.body.classList.add('dragging') : document.body.classList.remove('dragging');
    }, [dragging]);

    // React.useEffect(() => {
    //   const topHeight = topRef.current !== null && topRef.current !== undefined ? topRef.current.clientHeight : null
    //   const bottomHeight = bottomRef.current !== null && bottomRef.current !== undefined ? bottomRef.current.clientHeight : null
    //   if (topHeight !== undefined && topHeight !== null && bottomHeight !== undefined && bottomHeight !== null) {
    //     // if (height && height - bottomHeight > 0) {
    //     //   setHeightContent(height - bottomHeight)
    //     // } else {
    //     // setHeightContent((windowHeight * .7 * .8) - topHeight + bottomHeight)
    //     // }
    //   }
    // }, [height, windowHeight, windowWidth])

    return (
        <Stack spacing={2}>
            <Typography variant="h5">{title ?? 'Documents'}</Typography>
            {
                // @ts-expect-error The component takes children
                <MainCard
                    sx={{
                        width: width ?? browserWidth,
                        height: height ?? browserHeight,
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiCardContent-root': {
                            p: 0,
                            height: '100%',
                            width: '100%'
                        }
                    }}
                >
                    <Box height="20%">
                        <FileBrowserTopNav
                            ref={topRef}
                            bgColor={bgColor}
                            borderRadius={borderRadius}
                            doc={fileMap.get(nav[nav.length - 1])}
                            handleBack={handleBack}
                            handleForward={handleForward}
                        />
                    </Box>
                    <Box height="72%">
                        <FileBrowserContent
                            select={select}
                            selected={selected}
                            setSelected={setSelected}
                            documents={documents}
                            nav={nav}
                            gridRef={ref}
                        />
                    </Box>
                    <Divider />
                    <Box height="8%">
                        <FileBrowserNavigation ref={bottomRef} history={nav} select={select} />
                    </Box>
                </MainCard>
            }
        </Stack>
    );
};

export default FileBrowser;
