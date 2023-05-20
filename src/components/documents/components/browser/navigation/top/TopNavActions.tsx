import * as React from 'react';
import Divider from '@mui/material/Divider';
import { BsFolderPlus, BsFileArrowUp, BsGrid, BsViewStacked, BsPencilSquare, BsTrashFill } from 'react-icons/bs';
import { alpha, ButtonBase, darken, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Dropzone from 'react-dropzone';
import { DocumentType, Units } from 'components/documents/Interface/FileBrowser';
import { HtmlTooltip } from 'components/documents/components/browser/UI/Poppers/CustomPoppers';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useViewStore } from 'components/documents/data/global_state/slices/view';

interface TopNavActionProps {
    doc: DocumentType | undefined;
}

export default function TopNavActions({ doc }: TopNavActionProps) {
    const { toogleView, view } = useViewStore();
    const [isDeleteHovered, setIsDeleteHovered] = React.useState<boolean>(false);
    const minWidth = 'max-content';
    const tooltipDelay = 200;
    const theme = useTheme();
    const { actions } = useBrowserStore();

    const changeHandler = (files: File[]) => {
        try {
            if (doc !== undefined) {
                const uploadedFiles = files.map((file: File, i: number) => ({
                    id: `${i} ${file.name}`,
                    doc_name: file.name,
                    is_dir: false,
                    size: file.size,
                    size_units: Units.Kb,
                    is_archived: false,
                    custom_attributes: {},
                    parent: doc.id,
                    children: null,
                    type: file.type
                }));
                const uploaded = actions.uploadFiles(doc.id, uploadedFiles);
                if (uploaded !== true) {
                    throw uploaded;
                }
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            } else {
                console.log(e);
            }
        }
    };

    const md = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div>
            <Stack
                sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.text.secondary, 0.01),
                    color: 'text.primary',
                    transition: 'all .2s',
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
                            columnGap={0.7}
                        >
                            <BsFolderPlus size={19} />
                            <Typography fontSize={10.5} display={md ? 'none' : 'block'}>
                                Create Folder
                            </Typography>
                        </Stack>
                    </HtmlTooltip>

                    <Dropzone onDrop={changeHandler}>
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
                                transition: 'all .1s',
                                transitionTimingFunction: 'ease-in-out',
                                width: minWidth,
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
                                transition: 'all .1s',
                                transitionTimingFunction: 'ease-in-out',
                                width: minWidth,
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
                                    Delete file/folder
                                </Typography>
                                <Typography fontSize={10.5}>his button allows you to delete the selected file/folder</Typography>
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
                                height: '100%'
                            }}
                            justifyContent="space-between"
                            alignItems="center"
                            component={ButtonBase}
                            onMouseOver={() => setIsDeleteHovered(true)}
                            onMouseLeave={() => setIsDeleteHovered(false)}
                            direction="row"
                            columnGap={0.7}
                        >
                            <BsTrashFill size={19} color={isDeleteHovered ? theme.palette.error.contrastText : theme.palette.error.main} />
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
