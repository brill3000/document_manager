import {
    Box,
    Button,
    ButtonBase,
    Dialog,
    Divider,
    Fade,
    FormControl,
    InputLabel,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Popper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
    alpha
} from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyledMenu } from './StyledMenu';
import { theme } from '../../../Themes/theme';
import { MemorizedBsFillFileEarmarkUnZipFill } from 'components/documents/Icons/fileIcon';
import { RiFileWarningLine, RiFolderWarningLine } from 'react-icons/ri';
import zIndex from '@mui/material/styles/zIndex';
// ICONS
import { MdOutlinePostAdd, MdSecurity } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import {
    BsCaretLeftFill,
    BsCaretRightFill,
    BsDatabaseAdd,
    BsFileArrowUp,
    BsFillFileEarmarkBreakFill,
    BsFolderPlus,
    BsGear,
    BsKey,
    BsTrash
} from 'react-icons/bs';
import { IoIosAddCircle, IoMdCopy } from 'react-icons/io';
import { IoCutOutline } from 'react-icons/io5';
import { TbCategory2 } from 'react-icons/tb';

// INTERFACES
import { AcceptedFilesType, DocumentActionMenuType, IFormElementsComplex, MimeTypeConfigInterface } from 'global/interfaces';
// RTK: QUERY
import {
    useAddToCategoryMutation,
    useForceCancelCheckoutMutation,
    useLazyCheckoutQuery,
    useLazyGetFilePropertiesQuery,
    useRemoveFromCategoryMutation
} from 'store/async/dms/files/filesApi';
import { useLazyGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { LazyLoader } from '../..';
import { isNull, isUndefined, uniq } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { NoteTaker } from '../notes';
// HELPERS
import { UriHelper } from 'utils/constants/UriHelper';
// COMPONENTS
import { LeftSidebar } from '../../main/sidebars';
import {
    useLazyFindAllProcessDefinitionsQuery,
    useLazyFindTaskInstancesQuery,
    useLazyGetProcessDefinitionFormsQuery,
    useStartTaskInstanceMutation
} from 'store/async/dms/workflow/workflowApi';
import Dropzone from 'react-dropzone';
import { MimeTypeConfig } from 'utils/constants/MimeTypes';
import { AxiosRequestConfig } from 'axios';
import { instance } from '../../navigation/top/TopNavActions';

type SubmenuItems = 'metadata' | 'categories' | 'keyword' | 'note' | 'workflow' | null;

interface ActionMenuProps {
    contextMenu: { mouseX: number; mouseY: number } | null;
    locked: boolean;
    is_dir: boolean;
    is_zip?: boolean;
    nodeId: string | null;
    node_name?: string;
    handleMenuClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleMenuClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, type: DocumentActionMenuType['type']) => void;
}

export const ActionMenu = ({
    contextMenu,
    handleMenuClose,
    handleMenuClick,
    locked,
    is_dir,
    is_zip,
    nodeId,
    node_name
}: ActionMenuProps) => {
    // =========================== | STATE | =========================== //
    const [selected, setSelected] = useState<DocumentActionMenuType['type'] | null>(null);
    const [openDialog, setOpenDialog] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    // =========================== | REFS | =========================== //
    const [anchorEl, setAnchorEl] = useState<HTMLLIElement | null>(null);
    const [editAnchorEl, setEditAnchorEl] = useState<HTMLLIElement | null>(null);

    // =========================== | EVENTS | =========================== //
    const handleOpenSubMenu = useCallback((event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setAnchorEl(open === true ? null : event.currentTarget);
        setOpenEdit(false);
        setEditAnchorEl(null);
        setOpen((prev) => !prev);
    }, []);

    const handleSelectedSubMenu = useCallback(
        (selected: SubmenuItems) => {
            open === true && selected !== null && setOpenDialog(selected);
        },
        [open]
    );

    const handleCloseSubmenuDialog = useCallback(() => {
        setOpen(false);
        setOpenDialog(null);
        setEditAnchorEl(null);
        setOpenEdit(false);
        setAnchorEl(null);
    }, []);
    // EDIT SUBMENU
    const handleOpenEditSubMenu = useCallback((event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setEditAnchorEl(openEdit === true ? null : event.currentTarget);
        setOpen(false);
        setAnchorEl(null);
        setOpenEdit((prev) => !prev);
    }, []);

    const handleSelectedEditSubMenu = useCallback(
        (event: React.MouseEvent<HTMLLIElement, MouseEvent>, selected: DocumentActionMenuType['type']) => {
            setSelected(selected);
            handleMenuClick(event, selected);
            handleCloseEditSubMenu();
        },
        [openEdit]
    );
    const handleCloseEditSubMenu = useCallback(() => {
        setOpenEdit(false);
        setEditAnchorEl(null);
    }, []);

    // =========================== | EFFECTS | =========================== //

    useEffect(() => {
        selected === 'new_version' && setOpenDialog(selected);
    }, [selected]);

    useEffect(() => {
        return () => {
            setSelected(null);
            setOpen(false);
            setAnchorEl(null);
            setEditAnchorEl(null);
            setOpenEdit(false);
        };
    }, []);
    return (
        <>
            {/**
             * SUBMENU ITEMS
             * */}
            <EditMenuOption
                open={openEdit}
                is_dir={is_dir}
                is_zip={is_zip ?? false}
                locked={locked}
                anchorEl={editAnchorEl}
                handleSelectedSubMenu={handleSelectedEditSubMenu}
            />
            <AddMenuOption open={open} anchorEl={anchorEl} handleSelectedSubMenu={handleSelectedSubMenu} />
            <SubmenuDialog
                selected={openDialog}
                handleClose={handleCloseSubmenuDialog}
                uuid={nodeId}
                is_dir={is_dir}
                node_name={node_name}
            />
            {/**
             * MAIN MENU
             * */}
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'document-action-menu'
                }}
                open={contextMenu !== null}
                onClose={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    handleMenuClose(e);
                    setSelected(null);
                    setOpen(false);
                    setAnchorEl(null);
                    setOpenEdit(false);
                    setEditAnchorEl(null);
                }}
                anchorReference="anchorPosition"
                verticalOrigin="top"
                horizontalOrigin="left"
                anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
                disableAutoFocusItem={true}
            >
                <Typography component={Box} variant="caption" color="text.secondary" px={2} noWrap>
                    {node_name ?? 'Selected Document'}
                </Typography>
                <Divider variant="middle" />
                <MenuItem
                    selected={selected === 'open'}
                    onClick={(e) => {
                        setSelected('open');
                        handleMenuClick(e, 'open');
                    }}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <BsFolderPlus size={18} />
                        <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Open
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'copy'}
                    onClick={(e) => {
                        setSelected('copy');
                        handleMenuClick(e, 'copy');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <IoMdCopy size={20} />
                        <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Copy
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'cut'}
                    onClick={(e) => {
                        setSelected('cut');
                        handleMenuClick(e, 'cut');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <IoCutOutline size={20} />
                        <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Cut
                        </Typography>
                    </Stack>
                </MenuItem>
                <Divider sx={{ my: 0.2 }} variant="middle" />
                <MenuItem
                    selected={selected === 'edit'}
                    onClick={(e) => {
                        handleOpenEditSubMenu(e);
                    }}
                    disabled={locked}
                >
                    <Stack
                        height="max-content"
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={1}
                        p={0.3}
                        borderRadius={1}
                    >
                        <Stack spacing={1} width="max-content" direction="row">
                            <CiEdit size={21} />
                            <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                                Edit
                            </Typography>
                        </Stack>
                        {openEdit === true ? (
                            <BsCaretLeftFill color={theme.palette.common.black} />
                        ) : (
                            <BsCaretRightFill color={theme.palette.common.black} />
                        )}
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'permissions'}
                    onClick={(e) => {
                        setSelected('permissions');
                        handleMenuClick(e, 'permissions');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <MdSecurity size={18} color={theme.palette.info.main} />
                        <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Permissions
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'workflow'}
                    onClick={(e) => {
                        setSelected('workflow');
                        handleMenuClick(e, 'workflow');
                        setOpenDialog('workflow');
                    }}
                    disabled={locked}
                >
                    <Stack
                        height="max-content"
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={1}
                        p={0.3}
                        borderRadius={1}
                    >
                        <Stack spacing={1} width="max-content" direction="row">
                            <BsGear size={17} color={theme.palette.info.main} />
                            <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                                Start Workflow
                            </Typography>
                        </Stack>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'add'}
                    onClick={(e) => {
                        setSelected('add');
                        handleMenuClick(e, 'add');
                        handleOpenSubMenu(e);
                    }}
                    disabled={locked}
                >
                    <Stack
                        height="max-content"
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        spacing={1}
                        p={0.3}
                        borderRadius={1}
                    >
                        <Stack spacing={1} width="max-content" direction="row">
                            <IoIosAddCircle size={17} color={theme.palette.warning.main} />
                            <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                                Add
                            </Typography>
                        </Stack>
                        {open === true ? (
                            <BsCaretLeftFill color={theme.palette.common.black} />
                        ) : (
                            <BsCaretRightFill color={theme.palette.common.black} />
                        )}
                    </Stack>
                </MenuItem>

                <Divider sx={{ my: 0.2 }} variant="middle" />
                <MenuItem
                    selected={selected === 'moveToTrash'}
                    onClick={(e) => {
                        setSelected('moveToTrash');
                        handleMenuClick(e, 'moveToTrash');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        <BsTrash size={17} color={theme.palette.error.main} />
                        <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Move {is_dir ? 'folder' : 'file'} to Trash
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    selected={selected === 'delete'}
                    onClick={(e) => {
                        setSelected('delete');
                        handleMenuClick(e, 'delete');
                    }}
                    disabled={locked}
                >
                    <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                        {is_dir ? (
                            <RiFolderWarningLine size={17} color={theme.palette.error.main} />
                        ) : (
                            <RiFileWarningLine size={17} color={theme.palette.error.main} />
                        )}
                        <Typography variant="caption" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                            Delete {is_dir ? 'folder' : 'file'}
                        </Typography>
                    </Stack>
                </MenuItem>
            </StyledMenu>
        </>
    );
};

const AddMenuOption = memo(
    ({
        open,
        anchorEl,
        handleSelectedSubMenu
    }: {
        open: boolean;
        anchorEl: any;
        handleSelectedSubMenu: (selected: SubmenuItems) => void;
    }) => {
        // ======================== | STATE | ========================= //
        const [selected, setSelected] = useState<SubmenuItems>(null);

        // ======================== | EFFECTS | ========================= //

        useEffect(() => {
            return () => {
                // setSelectedFolders(null);
                setSelected(null);
            };
        }, []);
        useEffect(() => {
            if (open === false) return;
            setSelected(null);
            // setSelectedFolders(null);
        }, [open]);
        useEffect(() => {
            handleSelectedSubMenu(selected);
        }, [selected]);

        return (
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="right-start"
                transition
                sx={{ zIndex: zIndex.modal }}
                onMouseOver={(e) => e.preventDefault()}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper
                            sx={{
                                '& .MuiPaper-root': {
                                    borderRadius: 6,
                                    marginTop: theme.spacing(1),
                                    minWidth: selected === 'categories' ? 300 : 180,
                                    maxWidth: 200,
                                    oveflowY: 'auto',
                                    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
                                    boxShadow:
                                        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
                                }
                            }}
                        >
                            {selected === null && (
                                <List disablePadding>
                                    <ListItemButton onClick={() => setSelected('note')}>
                                        <ListItemIcon>
                                            <MdOutlinePostAdd size={18} color={theme.palette.warning.dark} />
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography variant="caption">Note</Typography>} />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => setSelected('keyword')}>
                                        <ListItemIcon>
                                            <BsKey size={18} color={theme.palette.warning.dark} />
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography variant="caption">Keyword</Typography>} />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => setSelected('categories')}>
                                        <ListItemIcon>
                                            <TbCategory2 size={18} color={theme.palette.warning.dark} />
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography variant="caption">Category</Typography>} />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => setSelected('metadata')}>
                                        <ListItemIcon>
                                            <BsDatabaseAdd size={18} color={theme.palette.warning.dark} />
                                        </ListItemIcon>
                                        <ListItemText disableTypography primary={<Typography variant="caption">Metadata</Typography>} />
                                    </ListItemButton>
                                </List>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        );
    }
);
const EditMenuOption = memo(
    ({
        open,
        anchorEl,
        is_zip,
        is_dir,
        locked,
        handleSelectedSubMenu
    }: {
        open: boolean;
        anchorEl: any;
        is_zip: boolean;
        is_dir: boolean;
        locked: boolean;
        handleSelectedSubMenu: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, selected: DocumentActionMenuType['type']) => void;
    }) => {
        return (
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="right-start"
                transition
                sx={{ zIndex: zIndex.modal }}
                onMouseOver={(e) => e.preventDefault()}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper
                            sx={{
                                '& .MuiPaper-root': {
                                    borderRadius: 6,
                                    marginTop: theme.spacing(1),
                                    minWidth: 180,
                                    maxWidth: 200,
                                    oveflowY: 'auto',
                                    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
                                    boxShadow:
                                        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
                                }
                            }}
                        >
                            <List disablePadding>
                                {/** @ts-expect-error expected */}
                                <ListItemButton onClick={(e) => handleSelectedSubMenu(e, 'rename')} disabled={locked}>
                                    <ListItemIcon>
                                        <CiEdit size={18} color={theme.palette.warning.dark} />
                                    </ListItemIcon>
                                    <ListItemText disableTypography primary={<Typography variant="caption">Rename</Typography>} />
                                </ListItemButton>
                                {/** @ts-expect-error expected */}
                                <ListItemButton onClick={(e) => handleSelectedSubMenu(e, 'new_version')} disabled={locked || is_dir}>
                                    <ListItemIcon>
                                        <BsFillFileEarmarkBreakFill size={15} color={theme.palette.warning.dark} />
                                    </ListItemIcon>
                                    <ListItemText
                                        disableTypography
                                        primary={<Typography variant="caption">Upload new version</Typography>}
                                    />
                                </ListItemButton>
                                {/** @ts-expect-error expected */}
                                <ListItemButton onClick={(e) => handleSelectedSubMenu(e, 'extract')} disabled={locked || is_dir || !is_zip}>
                                    <ListItemIcon>
                                        <MemorizedBsFillFileEarmarkUnZipFill size={15} />
                                    </ListItemIcon>
                                    <ListItemText disableTypography primary={<Typography variant="caption">Extract</Typography>} />
                                </ListItemButton>
                            </List>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        );
    }
);
const SubmenuDialog = memo(
    ({
        selected,
        handleClose,
        uuid,
        is_dir,
        node_name
    }: {
        selected: string | null;
        handleClose: () => void;
        uuid: string | null;
        is_dir: boolean;
        node_name?: string;
    }) => {
        // ======================== | STATE | ========================= //
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [selectedFolders, setSelectedFolders] = useState<string[] | null>(null);
        const [value, setValue] = useState<string | undefined>('TEXT');
        const [selectedWorkflow, setSelectedWorkflow] = useState('');
        const [form, setForm] = useState<IFormElementsComplex[] | null>(null);
        const [comment, setComment] = useState<string>('');
        const [file, setFile] = useState<File | null>(null);
        const [keyword, setKeyword] = useState<string>('');

        // ========================= | RTK: QUERY | ============================= //
        const [addToCategory] = useAddToCategoryMutation();
        const [removeFromCategory] = useRemoveFromCategoryMutation();
        const [getFileInfo, fileInfo] = useLazyGetFilePropertiesQuery();
        const [getFolderInfo, folderInfo] = useLazyGetFoldersPropertiesQuery();
        const [getProcessDefinitionForms, processDefinitionForms] = useLazyGetProcessDefinitionFormsQuery();
        const [getAllProcessDefinition, allProcessDefinitions] = useLazyFindAllProcessDefinitionsQuery();
        const [findTaskInstances, taskInstances] = useLazyFindTaskInstancesQuery();
        const [startTaskInstance] = useStartTaskInstanceMutation();
        const [checkout] = useLazyCheckoutQuery();
        const [cancelCheckout] = useForceCancelCheckoutMutation();

        // ========================= | MEMO | ============================= //
        const AcceptedTypes = useMemo(() => {
            const newObj = {} as AcceptedFilesType<MimeTypeConfigInterface>;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const [_, value] of Object.entries(MimeTypeConfig)) {
                newObj[value] = [];
            }
            return newObj;
        }, []);

        // ======================== | EVENTS | ========================= //
        const handleSelectCategory = useCallback(
            async (node: string) => {
                if (node === '/okm:categories') return;
                if (uuid === null) return;
                let isSelected;
                const catId = node;
                const nodeId = uuid;
                setSelectedFolders((selectedFolders) => {
                    if (!Array.isArray(selectedFolders)) return [node];
                    isSelected = selectedFolders.some((selectedFolder) => selectedFolder === node);
                    if (isSelected) {
                        return [...selectedFolders?.filter((selectedFolder) => selectedFolder !== node)];
                    } else {
                        return [...selectedFolders, node];
                    }
                });
                try {
                    if (isSelected) {
                        await removeFromCategory({
                            nodeId,
                            catId
                        }).unwrap();
                        enqueueSnackbar(`Category Removed`, { variant: 'success' });
                    } else {
                        await addToCategory({
                            nodeId: nodeId,
                            catId
                        }).unwrap();
                        enqueueSnackbar(`Category Added`, { variant: 'success' });
                    }
                } catch (error) {
                    enqueueSnackbar(`Failed to ${isSelected === true ? 'Remove' : 'Add'} Category`, { variant: 'error' });
                }
            },
            [uuid]
        );

        const handleChange = (event: SelectChangeEvent) => {
            setSelectedWorkflow(event.target.value);
        };
        const fileChangeHandler = (uploadedFile: File[]) => {
            setFile(uploadedFile[0]);
        };
        // ======================== | EFFECTS | ========================= //

        useEffect(() => {
            return () => {
                setSelectedFolders(null);
            };
        }, []);
        useEffect(() => {
            setSelectedFolders(null);
        }, [open]);
        useEffect(() => {
            if (is_dir === true) {
                if (folderInfo.data === null || folderInfo.data === undefined) return;
                const { categories: data } = folderInfo.data;
                const categories = Array.isArray(data) ? data.map((category) => category.path) : [];
                setSelectedFolders((selectedFolders) =>
                    Array.isArray(selectedFolders) && selectedFolders.length > 0
                        ? uniq([...selectedFolders, ...categories])
                        : [...categories]
                );
            } else {
                if (fileInfo.data === null || fileInfo.data === undefined) return;
                const { categories: data } = fileInfo.data;
                const categories = Array.isArray(data) ? data.map((category) => category.path) : [];
                setSelectedFolders((selectedFolders) =>
                    Array.isArray(selectedFolders) && selectedFolders.length > 0
                        ? uniq([...selectedFolders, ...categories])
                        : [...categories]
                );
            }
        }, [folderInfo, fileInfo]);
        useEffect(() => {
            if (uuid === null) return;
            setIsLoading(true);
            if (is_dir) {
                getFolderInfo({ fldId: uuid })
                    .then(() => setIsLoading(false))
                    .catch(() => setIsLoading(false));
            } else {
                getFileInfo({ docId: uuid })
                    .then(() => setIsLoading(false))
                    .catch(() => setIsLoading(false));
            }
        }, [selected, is_dir]);
        useEffect(() => {
            getAllProcessDefinition();
        }, []);
        useEffect(() => {
            if (selectedWorkflow === '') return;
            getProcessDefinitionForms({ pdId: selectedWorkflow });
            findTaskInstances({ piId: selectedWorkflow });
        }, [selectedWorkflow]);
        useEffect(() => {
            if (processDefinitionForms.data) {
                setForm(processDefinitionForms.data.processDefinitionForm[0].formElementsComplex);
            }
        }, [processDefinitionForms]);
        useEffect(() => {
            if (processDefinitionForms.data) {
                setForm(processDefinitionForms.data.processDefinitionForm[0].formElementsComplex);
            }
        }, [processDefinitionForms]);

        return (
            <Dialog
                sx={{
                    boxShadow: `inset 0 0 4px ${alpha(theme.palette.common.black, 0.09)}, 0 0 20px ${alpha(
                        theme.palette.common.black,
                        0.15
                    )} `,
                    borderRadius: 2
                }}
                open={selected !== null}
                onClose={() => handleClose()}
            >
                {selected === 'categories' && (
                    <Stack p={1} width="100%" height="100%">
                        <Typography variant="caption">Select category</Typography>
                        <Divider />
                        <Box minHeight={300} maxHeight={600} minWidth={300} maxWidth={400} overflow="auto" py={1}>
                            {isLoading === true && <LazyLoader align="center" width="50%" justify="center" height="100%" />}
                            {isLoading === false && (
                                <LeftSidebar
                                    standAlone
                                    root={UriHelper.REPOSITORY_GET_ROOT_CATEGORIES}
                                    customHandleClick={handleSelectCategory}
                                    selectedList={selectedFolders}
                                />
                            )}
                        </Box>
                    </Stack>
                )}
                {selected === 'workflow' && (
                    <Stack p={1} width="100%" height="100%">
                        <Typography variant="caption">Start workflow</Typography>
                        <Divider />
                        <Box minHeight={300} maxHeight={600} minWidth={300} maxWidth={400} overflow="auto" py={1}>
                            {isUndefined(allProcessDefinitions.data) ||
                                (isNull(allProcessDefinitions.data) && (
                                    <LazyLoader align="center" width="50%" justify="center" height="100%" />
                                ))}
                            <FormControl sx={{ minWidth: '100%' }} size="small">
                                <InputLabel id="demo-select-small-label">Select workflow</InputLabel>
                                <Select
                                    labelId="select-workflow-label"
                                    id="select-workflow"
                                    value={selectedWorkflow}
                                    label="workflow"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {[
                                        { id: 1, name: 'Motion tabling' },
                                        { id: 2, name: 'Create order paper' }
                                    ].map((prs) => (
                                        <MenuItem key={prs.id} value={prs.id}>
                                            {prs.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {selectedWorkflow && (
                                <Box>
                                    {
                                        [
                                            { id: 1, name: 'Motion tabling' },
                                            { id: 2, name: 'Create order paper' }
                                        ].find((x) => x.id === Number(selectedWorkflow))?.name
                                    }
                                </Box>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<BsGear />}
                            size="small"
                            sx={{ width: 'max-content', alignSelf: 'flex-end' }}
                            onClick={async () => {
                                try {
                                    if (uuid === null || selectedWorkflow === '' || form === null) throw new Error('Error');
                                    // await runProcessDefinition({ pdId: selectedWorkflow, uuid, values: form }).unwrap();
                                    await startTaskInstance({ tiId: selectedWorkflow }).unwrap();
                                    enqueueSnackbar('Workflow started', { variant: 'success' });
                                } catch (error) {
                                    enqueueSnackbar('Failed to start workflow', { variant: 'error' });
                                }
                            }}
                        >
                            Start workflow
                        </Button>
                    </Stack>
                )}
                {selected === 'new_version' && (
                    <Stack p={1} width="100%" height="100%">
                        <Typography variant="caption">Upload new version</Typography>
                        <Divider />
                        <Stack minHeight={300} minWidth={300} maxWidth={400} overflow="auto" py={1} rowGap={1}>
                            <TextField
                                variant="outlined"
                                placeholder="Add comment"
                                multiline
                                minRows={3}
                                maxRows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            {/* <TextField
                                variant="outlined"
                                type="number"
                                placeholder="Increment"
                                size="small"
                                inputProps={{ step: 0.1 }}
                                value={increment}
                                onChange={(e) => setIncrement(e.target.value)}
                            /> */}
                            <Dropzone onDrop={fileChangeHandler} accept={AcceptedTypes} maxFiles={1}>
                                {({ getRootProps, getInputProps }) => (
                                    <Box component="span">
                                        <Stack
                                            justifyContent="space-between"
                                            alignItems="center"
                                            component={Button}
                                            {...getRootProps({ className: 'dropzone' })}
                                            direction="row"
                                            columnGap={0.7}
                                            variant="outlined"
                                            startIcon={<BsFileArrowUp size={19} />}
                                        >
                                            <Typography variant="caption">Pick file</Typography>

                                            <input {...getInputProps()} />
                                        </Stack>
                                        {file && (
                                            <Typography variant="caption" color="primary">
                                                {file.name}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<BsFillFileEarmarkBreakFill />}
                            size="small"
                            sx={{ width: 'max-content', alignSelf: 'flex-end' }}
                            onClick={async () => {
                                try {
                                    if (uuid === null || comment === '' || file === null) throw Error('');

                                    const config: AxiosRequestConfig = {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                            Cookie: 'token=d0ce7166-59bc-455f-8fc8-dcf56e6c036d'
                                        }
                                    };
                                    const formData = new FormData();
                                    formData.set('content', file);
                                    formData.set('docId', uuid);
                                    formData.set('comment', comment);
                                    // formData.set('increment', increment ?? 0.1);
                                    await instance.get(`/${UriHelper.DOCUMENT_CHECKOUT}`, { params: { docId: uuid } });
                                    instance
                                        .post(`/${UriHelper.DOCUMENT_CHECKIN}`, formData, config)
                                        .then((res) => {
                                            if (res.status !== 200) return;
                                            cancelCheckout({ docId: uuid });
                                            enqueueSnackbar('Version Added', { variant: 'success' });
                                        })
                                        .catch(() => {
                                            cancelCheckout({ docId: uuid });
                                            enqueueSnackbar('Failed to upload version', { variant: 'error' });
                                        });
                                } catch (error) {
                                    enqueueSnackbar('Failed to upload version', { variant: 'error' });
                                }
                            }}
                        >
                            Upload new version
                        </Button>
                    </Stack>
                )}
                {selected === 'keyword' && (
                    <Stack p={1} width="100%" height="100%">
                        <Typography variant="caption">Add keyword</Typography>
                        <Divider />
                        <Box minHeight={300} maxHeight={600} minWidth={300} maxWidth={400} overflow="auto" py={1}>
                            <TextField placeholder="keyword" onChange={(e) => setValue(e.target.value)} value={value} />
                            <Button>Add Keyword</Button>
                        </Box>
                    </Stack>
                )}
                {selected === 'note' && (
                    <Stack p={1} width="100%" height="100%">
                        <Typography variant="caption">Create note</Typography>
                        <Divider />
                        <Box minHeight={300} maxHeight={600} minWidth={350} maxWidth={400} overflow="auto" py={1}>
                            <NoteTaker nodeId={uuid} node_name={node_name} onClose={() => handleClose()} />
                        </Box>
                    </Stack>
                )}
            </Dialog>
        );
    }
);
export default ActionMenu;
