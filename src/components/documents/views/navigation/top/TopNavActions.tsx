import * as React from 'react';
import Divider from '@mui/material/Divider';
import { BsFolderPlus, BsFileArrowUp, BsGrid, BsViewStacked, BsPencilSquare, BsTrashFill } from 'react-icons/bs';
import { alpha, Box, ButtonBase, darken, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Dropzone from 'react-dropzone';
import { HtmlTooltip } from 'components/documents/views/UI/Poppers/CustomPoppers';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
// import { useCreateSimpleFileMutation } from 'store/async/dms/files/filesApi';
import { isEmpty, isNaN, isNull, isUndefined, last } from 'lodash';
import { UseModelActions } from 'components/documents/Interface/FileBrowser';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { UriHelper } from 'utils/constants/UriHelper';
import {
    AcceptedFilesType,
    FolderInterface,
    GenericDocument,
    JavaCalendar,
    MimeTypeConfigInterface,
    UploadedFileInterface
} from 'global/interfaces';
import { useSnackbar } from 'notistack';
import { filesApi } from 'store/async/dms/files/filesApi';
import { useDispatch } from 'react-redux';
import { useHandleChangeRoute } from 'utils/hooks';
import { useMoveFolderToTrashMutation, usePurgeFolderMutation } from 'store/async/dms/folders/foldersApi';
import { RiFolderWarningFill } from 'react-icons/ri';
import { MimeTypeConfig } from 'utils/constants/MimeTypes';
const instance = axios.create({
    baseURL: UriHelper.HOST,
    withCredentials: true // Enable CORS with credentials
});
const uploadFile = async ({
    docPath,
    fileName,
    file,
    actions
}: {
    docPath: string;
    fileName: string;
    file: File;
    actions: UseModelActions;
}) => {
    const formData = new FormData();
    formData.set('content', file, fileName);
    formData.set('docPath', docPath);
    const config: AxiosRequestConfig = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const progress =
                !isNull(progressEvent.total) && !isUndefined(progressEvent.total)
                    ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
                    : null;
            if (!isNaN(progress) && !isNull(progress)) {
                actions.updateFileUploadingProgress(docPath, progress);
            }
        },
        headers: { 'Content-Type': 'multipart/form-data', Cookie: 'token=d0ce7166-59bc-455f-8fc8-dcf56e6c036d' }
    };

    return instance.post(`/${UriHelper.DOCUMENT_CREATE_SIMPLE}`, formData, config);
};

export default function TopNavActions() {
    // =========================== | STATES | ================================//
    const [isDeleteHovered, setIsDeleteHovered] = React.useState<boolean>(false);
    const [isMoveToTrashHovered, setIsMoveToTrashHovered] = React.useState<boolean>(false);

    const timoutRef = React.useRef<any>(null);
    // =========================== | CONSTANTS | ================================//
    const minWidth = 'max-content';
    const tooltipDelay = 200;
    const AcceptedTypes = React.useMemo(() => {
        const newObj = {} as AcceptedFilesType<MimeTypeConfigInterface>;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, value] of Object.entries(MimeTypeConfig)) {
            newObj[value] = [];
        }
        return newObj;
    }, []);
    // =========================== | THEME | ================================//
    const theme = useTheme();
    // =========================== | STORE: ZUSTAND | ================================//
    const { selected, actions, isCreating } = useBrowserStore();
    const { toogleView, view } = useViewStore();
    // =========================== | STORE: REDUX | ================================//
    const dispatch = useDispatch();
    // =========================== | RTK QUERY | ================================//
    const [purgeFolder] = usePurgeFolderMutation();
    const [moveFolderToTrash] = useMoveFolderToTrashMutation();

    // =========================== | ALERTS | ================================//
    const { enqueueSnackbar } = useSnackbar();

    // =========================== | CUSTOM HOOKS | ================================//
    const { currentFolder, navigate } = useHandleChangeRoute();
    // ============================= | EVENT HANDLERS | =============================== //
    const changeHandler = (files: UploadedFileInterface[]) => {
        try {
            if (!isUndefined(currentFolder) && !isNull(currentFolder) && !isEmpty(selected)) {
                files.forEach((file) => {
                    const docPath = `${currentFolder}/${file.name}`;
                    const fileName = file.name;
                    const newDate = new Date();
                    const javaDate: JavaCalendar = {
                        year: newDate.getFullYear(),
                        month: newDate.getMonth(),
                        dayOfMonth: newDate.getUTCDay(),
                        hourOfDay: newDate.getHours(),
                        minute: newDate.getMinutes(),
                        second: newDate.getSeconds()
                    };
                    const newFile: GenericDocument = {
                        author: 'undefined',
                        created: javaDate,
                        doc_name: fileName,
                        path: docPath,
                        permissions: { read: true, write: true, delete: true, security: true },
                        subscribed: false,
                        uuid: 'null',
                        is_dir: false,
                        mimeType: file.type,
                        size: file.size,
                        locked: false,
                        isLoading: true,
                        progress: 0,
                        error: false
                    };
                    actions.addUploadingFile(newFile);
                    uploadFile({ docPath, fileName, file, actions })
                        .then((res) => {
                            if (res.status === 200) {
                                const message = `File ${file.name} uploaded`;
                                actions.removeUploadingFile(`${currentFolder}/${file.name}`);
                                dispatch(filesApi.util.invalidateTags(['DMS_FILES']));
                                enqueueSnackbar(message, { variant: 'success' });
                            } else {
                                const message = `File ${file.name} upload failed`;
                                actions.removeUploadingFile(`${currentFolder}/${file.name}`);
                                enqueueSnackbar(message, { variant: 'error' });
                            }
                        })
                        .catch(() => {
                            const message = `File ${file.name} upload failed`;
                            actions.removeUploadingFile(`${currentFolder}/${file.name}`);
                            enqueueSnackbar(message, { variant: 'error' });
                        });
                    // createSimple({ docPath, fileName, file });
                });
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            } else {
                console.log(e);
            }
        }
    };

    const handleCreate = () => {
        actions.setIsCreating(true);
        if (!isUndefined(currentFolder) && !isNull(currentFolder) && !isEmpty(selected)) {
            const docPath = `${currentFolder}/new folder`;
            const folderName = 'new folder';
            const newDate = new Date();
            const javaDate: JavaCalendar = {
                year: newDate.getFullYear(),
                month: newDate.getMonth(),
                dayOfMonth: newDate.getUTCDay(),
                hourOfDay: newDate.getHours(),
                minute: newDate.getMinutes(),
                second: newDate.getSeconds()
            };
            const newFolder: FolderInterface = {
                author: 'undefined',
                created: javaDate,
                doc_name: folderName,
                path: docPath,
                permissions: { read: true, write: true, delete: true, security: true },
                subscribed: false,
                uuid: 'null',
                is_dir: true,
                hasChildren: false,
                locked: false,
                isLoading: true,
                error: false,
                newDoc: true
            };
            actions.addNewFolder(newFolder);
        }
    };
    const handlePurgeFolder = async () => {
        if (!isUndefined(currentFolder)) {
            try {
                if (!isNull(currentFolder) && !isUndefined(currentFolder)) {
                    const doc_name = last(currentFolder.split('/'));
                    const person = prompt(
                        `You are about to DELETE ${doc_name}. The Document Will be LOST FOREVER, to delete enter in YES, to cancel enter NO or close the prompt`,
                        'NO'
                    );
                    if (!isNull(person) && person.toLowerCase() === 'yes') {
                        await purgeFolder({ fldId: currentFolder, parent: null }).unwrap();
                        navigate(-1);
                        enqueueSnackbar(`Folder ${doc_name ?? ''} deleted`, { variant: 'success' });
                    }
                }
            } catch (e) {
                enqueueSnackbar(`Failed to delete folder`, { variant: 'error' });
            }
        }
    };
    const handleMoveToTrashFolder = async () => {
        if (!isUndefined(currentFolder)) {
            try {
                const doc_name = last(currentFolder.split('/'));

                const emptyFolder = confirm(`Move the opened folder ${doc_name} to TRASH?`);
                if (emptyFolder === true) {
                    await moveFolderToTrash({ fldId: currentFolder, parent: null }).unwrap();
                    navigate(-1);
                    enqueueSnackbar(`Folder ${doc_name ?? ''} moved to trash`, { variant: 'success' });
                }
            } catch (e) {
                enqueueSnackbar(`Failed to delete folder`, { variant: 'error' });
            }
        }
    };

    // ============================= | EFFECTS | ======================= //
    React.useEffect(() => {
        return () => {
            clearTimeout(timoutRef.current);
        };
    }, []);

    const md = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div>
            <Stack
                sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.text.secondary, 0.01),
                    color: 'text.primary',
                    transition: `${UriHelper.TRANSITION} all`,
                    transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                    '& svg': {
                        m: 0
                    },
                    '& hr': {
                        mx: 0
                    }
                }}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="max-content"
            >
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        transition: `${UriHelper.TRANSITION} all`,
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                        py: 0.3,
                        px: 0.5,
                        '&:hover': {
                            px: 1,
                            bgcolor: alpha(theme.palette.secondary.main, 0.1)
                        }
                    }}
                >
                    <HtmlTooltip
                        arrow
                        enterNextDelay={tooltipDelay}
                        placement="top-end"
                        title={
                            <React.Fragment>
                                <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                    Create New Folder
                                </Typography>
                                <Typography fontSize={10.5}>This button allows you to create a new empty folder</Typography>
                                {/* <Typography fontSize={8.5}>{"NB* You cannot create duplicate folders"}</Typography> */}
                            </React.Fragment>
                        }
                    >
                        <Box>
                            <Stack
                                sx={{
                                    pr: 0.7,
                                    py: 0.5,
                                    pl: 0.5,
                                    borderRadius: 1,
                                    '&:hover': {
                                        color: (theme) => theme.palette.primary.contrastText,
                                        bgcolor: (theme) => theme.palette.primary.main
                                    },
                                    width: 'max-content',
                                    height: '100%'
                                }}
                                justifyContent="space-between"
                                alignItems="center"
                                direction="row"
                                component={ButtonBase}
                                onClick={() => handleCreate()}
                                disabled={isCreating}
                                columnGap={0.7}
                            >
                                <BsFolderPlus size={19} />
                                <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                    Create Folder
                                </Typography>
                            </Stack>
                        </Box>
                    </HtmlTooltip>
                    {/* @ts-expect-error expected*/}
                    <Dropzone onDrop={changeHandler} accept={AcceptedTypes}>
                        {({ getRootProps, getInputProps }) => (
                            <HtmlTooltip
                                arrow
                                enterNextDelay={tooltipDelay}
                                placement="top"
                                title={
                                    <React.Fragment>
                                        <React.Fragment>
                                            <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                                Upload New files
                                            </Typography>
                                            <Typography fontSize={10.5}>This button allows you to upload multiple files</Typography>
                                            {/* <Typography fontSize={8.5} fontWeight={500}>{"NB* Zip files upload not yet enabled"}</Typography> */}
                                        </React.Fragment>
                                    </React.Fragment>
                                }
                            >
                                <Stack
                                    sx={{
                                        pr: 0.7,
                                        py: 0.5,
                                        pl: 0.5,
                                        borderRadius: 1,
                                        '&:hover': {
                                            color: (theme) => theme.palette.primary.contrastText,
                                            bgcolor: (theme) => theme.palette.primary.main
                                        },
                                        width: minWidth,
                                        transition: `${UriHelper.TRANSITION} all`,
                                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                        height: '100%'
                                    }}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    component={ButtonBase}
                                    {...getRootProps({ className: 'dropzone' })}
                                    direction="row"
                                    columnGap={0.7}
                                >
                                    <BsFileArrowUp size={19} />
                                    <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                        Upload files
                                    </Typography>
                                    <input {...getInputProps()} />
                                </Stack>
                            </HtmlTooltip>
                        )}
                    </Dropzone>
                </Stack>
                <Divider orientation="vertical" variant="fullWidth" flexItem />
                {/**
                 * Layout options
                 *
                 */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        transition: 'all .2s',
                        transitionTimingFunction: 'ease-in-out',
                        py: 0.3,
                        px: 0.5,
                        '&:hover': {
                            px: 1,
                            bgcolor: alpha(theme.palette.secondary.main, 0.2)
                        }
                    }}
                >
                    <HtmlTooltip
                        arrow
                        enterNextDelay={tooltipDelay}
                        placement="top"
                        title={
                            <React.Fragment>
                                <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                    Swith to list or table view
                                </Typography>
                                <Typography fontSize={10.5}>This button allows you to view folders as list or table</Typography>
                                {/* <Typography fontSize={8.5} fontWeight={500}>{"NB* List view is best if you need an overal view"}</Typography> */}
                            </React.Fragment>
                        }
                    >
                        <Stack
                            sx={{
                                pr: 0.7,
                                py: 0.5,
                                pl: 0.5,
                                borderRadius: 1,
                                color: view === 'list' ? (theme) => theme.palette.secondary.contrastText : 'inherit',
                                bgcolor: view === 'list' ? (theme) => theme.palette.secondary.dark : 'transparent',
                                '&:hover': {
                                    color: (theme) => theme.palette.secondary.contrastText,
                                    bgcolor: (theme) => darken(theme.palette.secondary.main, 0.2)
                                },
                                width: minWidth,
                                transition: `${UriHelper.TRANSITION} all`,
                                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                height: '100%'
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            component={ButtonBase}
                            direction="row"
                            columnGap={0.7}
                            onClick={() => toogleView('list')}
                        >
                            <BsViewStacked size={19} />
                            <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                List View
                            </Typography>
                        </Stack>
                    </HtmlTooltip>
                    <HtmlTooltip
                        arrow
                        enterNextDelay={tooltipDelay}
                        placement="top"
                        title={
                            <React.Fragment>
                                <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                    Swith to Grid view
                                </Typography>
                                <Typography fontSize={10.5}>This button allows you to view the documents in a grid</Typography>
                                {/* <Typography fontSize={8.5} fontWeight={500}>{"NB* List view is best if you need to see file types are important"}</Typography> */}
                            </React.Fragment>
                        }
                    >
                        <Stack
                            sx={{
                                pl: 0.5,
                                py: 0.5,
                                pr: 0.7,
                                borderRadius: 1,
                                color: view === 'grid' ? (theme) => theme.palette.secondary.contrastText : 'inherit',
                                bgcolor: view === 'grid' ? (theme) => theme.palette.secondary.dark : 'inherit',
                                '&:hover': {
                                    color: (theme) => theme.palette.secondary.contrastText,
                                    bgcolor: (theme) => darken(theme.palette.secondary.main, 0.2)
                                },
                                width: minWidth,
                                transition: `${UriHelper.TRANSITION} all`,
                                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                height: '100%'
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            component={ButtonBase}
                            direction="row"
                            columnGap={0.7}
                            onClick={() => toogleView('grid')}
                        >
                            <BsGrid size={18.5} />
                            <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                Icon View
                            </Typography>
                        </Stack>
                    </HtmlTooltip>
                </Stack>
                <Divider orientation="vertical" variant="fullWidth" flexItem />
                {/**
                 * Destructive actions
                 *
                 */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        transition: 'all .2s',
                        transitionTimingFunction: 'ease-in-out',
                        py: 0.3,
                        px: 0.5,
                        '&:hover': {
                            px: 1,
                            bgcolor: alpha(theme.palette.secondary.main, 0.1)
                        }
                    }}
                >
                    <HtmlTooltip
                        arrow
                        enterNextDelay={tooltipDelay}
                        placement="top"
                        title={
                            <React.Fragment>
                                <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                    Edit file/folder
                                </Typography>
                                <Typography fontSize={10.5}>
                                    This button allows you to edit the selected file/folder&apos;s details
                                </Typography>
                                {/* <Typography fontSize={8.5} fontWeight={500}>{"NB* Some details such as size are read only, hence cannot be edited"}</Typography> */}
                            </React.Fragment>
                        }
                    >
                        <Stack
                            sx={{
                                pl: 0.5,
                                py: 0.5,
                                pr: 0.7,
                                borderRadius: 1,
                                '&:hover': {
                                    color: (theme) => theme.palette.warning.contrastText,
                                    bgcolor: (theme) => darken(theme.palette.warning.main, 0.1)
                                },
                                width: minWidth,
                                transition: `${UriHelper.TRANSITION} all`,
                                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                height: '100%'
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            component={ButtonBase}
                            direction="row"
                            columnGap={0.7}
                        >
                            <BsPencilSquare size={20} />
                            <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                Edit Files
                            </Typography>
                        </Stack>
                    </HtmlTooltip>
                    <HtmlTooltip
                        arrow
                        enterNextDelay={tooltipDelay}
                        placement="top-start"
                        title={
                            <React.Fragment>
                                <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                    Move Opened folder to trash
                                </Typography>
                                <Typography fontSize={10.5}>This button allows you to move the current opened folder to trash</Typography>
                                {/* <Typography fontSize={8.5} fontWeight={500}>{"NB* File deletion is a permanent operation and cannot be reverted"}</Typography> */}
                            </React.Fragment>
                        }
                    >
                        <Stack
                            sx={{
                                pl: 0.5,
                                py: 0.5,
                                pr: 0.7,
                                borderRadius: 1,
                                '&:hover': {
                                    color: (theme) => theme.palette.error.contrastText,
                                    bgcolor: (theme) => darken(theme.palette.error.main, 0.1)
                                },
                                width: minWidth,
                                transition: `${UriHelper.TRANSITION} all`,
                                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                height: '100%'
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            component={ButtonBase}
                            onClick={handleMoveToTrashFolder}
                            onMouseOver={() => setIsMoveToTrashHovered(true)}
                            onMouseLeave={() => setIsMoveToTrashHovered(false)}
                            direction="row"
                            columnGap={0.7}
                        >
                            <BsTrashFill
                                size={19}
                                color={isMoveToTrashHovered ? theme.palette.error.contrastText : theme.palette.error.main}
                            />
                            <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                Move to Trash
                            </Typography>
                        </Stack>
                    </HtmlTooltip>
                    <HtmlTooltip
                        arrow
                        enterNextDelay={tooltipDelay}
                        placement="top-start"
                        title={
                            <React.Fragment>
                                <Typography color="inherit" variant="body2" sx={{ textDecoration: 'underline' }}>
                                    Delete the opened folder
                                </Typography>
                                <Typography fontSize={10.5}>This button allows you to delete the current opened folder</Typography>
                                <Typography fontSize={8.5} fontWeight={500}>
                                    {'NB* File deletion is a permanent operation and cannot be reverted'}
                                </Typography>
                            </React.Fragment>
                        }
                    >
                        <Stack
                            sx={{
                                pl: 0.5,
                                py: 0.5,
                                pr: 0.7,
                                borderRadius: 1,
                                '&:hover': {
                                    color: (theme) => theme.palette.error.contrastText,
                                    bgcolor: (theme) => darken(theme.palette.error.main, 0.1)
                                },
                                width: minWidth,
                                transition: `${UriHelper.TRANSITION} all`,
                                transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)',
                                height: '100%'
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            component={ButtonBase}
                            onClick={handlePurgeFolder}
                            onMouseOver={() => setIsDeleteHovered(true)}
                            onMouseLeave={() => setIsDeleteHovered(false)}
                            direction="row"
                            columnGap={0.7}
                        >
                            <RiFolderWarningFill
                                size={19}
                                color={isDeleteHovered ? theme.palette.error.contrastText : theme.palette.error.main}
                            />
                            <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                Delete Folder
                            </Typography>
                        </Stack>
                    </HtmlTooltip>
                </Stack>
            </Stack>
        </div>
    );
}
