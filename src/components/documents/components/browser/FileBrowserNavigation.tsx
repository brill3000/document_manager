import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip, { ChipProps } from '@mui/material/Chip';
// icons
import { MenuItem, Stack, Typography, IconButton, Tooltip, Badge, Grid } from '@mui/material';
import React from 'react';
import { DocumentType, FileBrowerClickEvent, FileBrowserNaviagationProps } from '../../Interface/FileBrowser';
import { FcOpenedFolder, FcRefresh } from 'react-icons/fc';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../Interface/Constants';
import { StyledMenu } from './UI/Menus/StyledMenu';
import { BsClipboard } from 'react-icons/bs';
import { useStore } from '../../data/global_state';
import { useBrowserStore } from '../../data/global_state/slices/BrowserMock';
import { MemorizedFcFolder } from './Document';

interface CustomChipProps extends ChipProps {
    doc?: DocumentType | undefined;
    handleClickMenu?: (event: FileBrowerClickEvent) => void;
}

const CustomChip = (props: CustomChipProps) => {
    const { actions } = useBrowserStore();

    const { doc, ...rest } = props;
    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.Folder, ItemTypes.File],
        drop: (item: DocumentType) => {
            try {
                if (doc !== undefined) {
                    // eslint-disable-next-line no-restricted-globals
                    const moveDoc = confirm(`You are about to move ${item.doc_name} to ${doc.doc_name}`);
                    if (moveDoc && actions.move !== undefined && item.parent !== doc.id) {
                        const moved = actions.move(item.id, doc.id);
                        if (moved !== true) {
                            throw moved;
                        }
                    }
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                } else {
                    console.log(e);
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
        // canDrop: (item) => {
        //   return item.id !== id && is_dir ? true : false
        // }
    }));
    return <StyledBreadcrumb ref={drop} isOver={isOver} {...rest} />;
};

const StyledBreadcrumb = styled(Chip, {
    shouldForwardProp: (props) => props !== 'isOver'
})<{ isOver: boolean }>(({ theme, isOver }) => {
    const backgroundColor: string = isOver
        ? theme.palette.grey[800]
        : theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800];
    return {
        backgroundColor,
        height: isOver ? theme.spacing(4) : theme.spacing(3),
        color: isOver ? theme.palette.primary.contrastText : theme.palette.text.primary,
        borderRadius: 5,
        fontWeight: theme.typography.fontWeightRegular,
        '& .MuiChip-icon': {
            color: 'white'
        },
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06)
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12)
        }
    };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

// { navHistory, select, fileMap }: FileBrowserNaviagationProps)

const FolderBrowserNavigation = React.forwardRef<HTMLInputElement, FileBrowserNaviagationProps>(function FolderBrowserNavigation(
    props,
    ref
) {
    const { history: navHistory, select } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { clipboard } = useStore();
    const open = Boolean(anchorEl);
    const { fileMap } = useBrowserStore();

    const handleClickMenu = (event: FileBrowerClickEvent) => {
        if (event) {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event: FileBrowerClickEvent, id: string | number) => {
        event.preventDefault();
        Array.isArray(navHistory) && navHistory[navHistory.length - 1] && navHistory[navHistory.length - 1] !== id && select(id);
    };
    return (
        <Grid
            container
            role="presentation"
            height="100%"
            width="100%"
            alignItems="center"
            px={3}
            py={0}
            ref={ref}
            direction="row"
            justifyContent="space-between"
        >
            <Grid item xs={11}>
                <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose} aria-labelledby="with-menu-demo-breadcrumbs">
                    {Array.isArray(navHistory) &&
                        navHistory
                            .filter((_: string | number, i: number) => i !== navHistory.length - 1 && i > 0)
                            .map((hist: string | number, index: number) => (
                                <RefactoredMenuItem
                                    key={hist}
                                    handleClose={handleClose}
                                    handleClick={handleClick}
                                    hist={hist}
                                    index={index}
                                    doc={fileMap.get(hist)}
                                />
                            ))
                            .reverse()}
                </StyledMenu>
                {Array.isArray(navHistory) ? (
                    <Breadcrumbs aria-label="breadcrumb">
                        <CustomChip
                            key={navHistory[0]}
                            doc={fileMap.get(navHistory[0])}
                            label={
                                <span
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {fileMap.get(navHistory[0]) && fileMap.get(navHistory[0])?.doc_name}
                                </span>
                            }
                            style={{ maxWidth: '150px' }}
                            onClick={(e) => handleClick(e, navHistory[0])}
                            icon={<FcRefresh size={15} />}
                        />
                        {navHistory.length > 3 && (
                            <CustomChip
                                sx={{
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}
                                label={<span>•••</span>}
                                style={{ maxWidth: '150px' }}
                                onClick={handleClickMenu}
                            ></CustomChip>
                        )}
                        {[...navHistory]
                            .filter((_, i) => i > 0)
                            .map((element, i: number) => {
                                return navHistory.length < 4 ? (
                                    <CustomChip
                                        key={element}
                                        doc={fileMap.get(element)}
                                        label={
                                            <span
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {fileMap.get(element) && fileMap.get(element)?.doc_name}
                                            </span>
                                        }
                                        style={{ maxWidth: '150px' }}
                                        onClick={(e) => handleClick(e, element)}
                                        icon={i === navHistory.length - 1 ? <FcOpenedFolder size={19} /> : <MemorizedFcFolder size={19} />}
                                    />
                                ) : (
                                    (i === navHistory.length - 1 || i === navHistory.length - 2) && (
                                        <CustomChip
                                            key={element}
                                            doc={fileMap.get(element)}
                                            label={
                                                <span
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {fileMap.get(element) && fileMap.get(element)?.doc_name}
                                                </span>
                                            }
                                            style={{ maxWidth: '150px' }}
                                            onClick={(e) => handleClick(e, element)}
                                            icon={
                                                i === navHistory.length - 1 ? <FcOpenedFolder size={19} /> : <MemorizedFcFolder size={19} />
                                            }
                                        />
                                    )
                                );
                            })}
                    </Breadcrumbs>
                ) : (
                    <></>
                )}
            </Grid>
            <Grid item xs={1} display="flex" justifyContent="end">
                <Tooltip title="Clipboard" arrow>
                    <Badge badgeContent={clipboard.size} color="primary">
                        <IconButton
                            sx={{
                                p: 0.7,
                                borderRadius: 1,
                                '&:hover': {
                                    color: (theme) => theme.palette.success.contrastText,
                                    bgcolor: (theme) => theme.palette.success.main
                                }
                            }}
                        >
                            <BsClipboard size={16} />
                        </IconButton>
                    </Badge>
                </Tooltip>
            </Grid>
            {/* <Typography>{Array.isArray(clipboard) && clipboard.length > 0 ? fileMap.get(clipboard[clipboard.length - 1]?.id)?.doc_name : ''}</Typography> */}
        </Grid>
    );
});

export default FolderBrowserNavigation;

interface RefactoredMenuItemInterface {
    handleClose: () => void;
    handleClick: (event: FileBrowerClickEvent, id: string | number) => void;
    hist: string | number;
    doc?: DocumentType | undefined;
    index: number;
}

function RefactoredMenuItem({ handleClose, handleClick, hist, index, doc }: RefactoredMenuItemInterface) {
    const { actions } = useBrowserStore();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.Folder, ItemTypes.File],
        drop: (item: DocumentType) => {
            try {
                if (doc !== undefined) {
                    // eslint-disable-next-line no-restricted-globals
                    const moveDoc = confirm(`You are about to move ${item.doc_name} to ${doc.doc_name}`);
                    if (moveDoc && actions.move !== undefined && item.parent !== doc.id) {
                        const moved = actions.move(item.id, doc.id);
                        if (moved !== true) throw moved;
                    }
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message);
                } else {
                    console.log(e);
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
        // canDrop: (item) => {
        //   return item.id !== id && is_dir ? true : false
        // }
    }));
    return (
        <MenuItem
            ref={drop}
            onClick={(e) => {
                handleClose();
                handleClick(e, hist);
            }}
            key={index}
            sx={{
                color: (theme) => (isOver ? theme.palette.primary.contrastText : theme.palette.text.secondary),
                bgcolor: (theme) => (isOver ? `${theme.palette.primary.main} !important` : 'inherit')
            }}
        >
            <Stack height="max-content" direction="row" spacing={1} p={0.3} borderRadius={1}>
                <MemorizedFcFolder size={18} />
                <Typography variant="body2" fontSize={12} color={(theme) => theme.palette.text.primary} noWrap>
                    {doc?.doc_name}
                </Typography>
            </Stack>
        </MenuItem>
    );
}
