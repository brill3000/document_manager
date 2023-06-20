import React from 'react';
import { StyledTableCell } from 'components/documents/views/UI/Tables';
import { MemorizedFcFolder } from '../views/item/GridViewItem';
import { Checkbox, Stack, Typography, useTheme } from '@mui/material';
import { isObject, isUndefined } from 'lodash';
import { getDateFromObject } from 'utils/constants/UriHelper';
import { FileIconProps, fileIcon } from '../Icons/fileIcon';
import { PermissionIconProps, permissionsIcon } from '../Icons/permissionsIcon';
import { PermissionTypes, RenderCustomProps } from '../Interface/FileBrowser';
import { StyledLinearProgress } from 'ui-component/CustomProgressBars';
import { RenameDocument } from '../views/item';
import { useHandleActionMenu } from 'utils/hooks';
import { useBrowserStore } from '../data/global_state/slices/BrowserMock';

export function RenderCustomCell({ rowSelected, document, disableDoubleClickFn, setContextMenu }: RenderCustomProps) {
    const theme = useTheme();
    const {
        doc_name,
        path,
        is_dir,
        mimeType,
        locked,
        isLoading,
        progress,
        newDoc,
        created,
        permissions,
        subscribed,
        isExtracting
    } = document;

    // ========================= | ICONS | =========================== //
    const memorizedFileIcon = React.useCallback((args: FileIconProps) => fileIcon({ ...args }), []);
    const memorizedPermissionsIcon = React.useCallback((args: PermissionIconProps) => permissionsIcon({ ...args }), []);
    const { renameTarget, isCreating, actions } = useBrowserStore();
    // ================================= | Action Menu | ============================= //
    const { renameFn, isRenaming } = useHandleActionMenu({
        is_dir,
        path,
        doc_name,
        setContextMenu,
        is_new: newDoc ?? false
    });

    React.useEffect(() => {
        if (isCreating && newDoc === true) {
            actions.setRenameTarget({ id: path, rename: is_dir, is_new: newDoc ?? false });
        }
    }, [newDoc, isCreating]);

    return (
        <>
            <StyledTableCell
                sx={{
                    width: 350,
                    position: 'sticky',
                    left: 0,
                    borderRight: `1px solid ${theme.palette.divider}`
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <Checkbox
                        size="small"
                        checked={rowSelected.path === path}
                        inputProps={{
                            'aria-labelledby': path
                        }}
                        sx={{ p: 0 }}
                    />
                    {is_dir ? <MemorizedFcFolder size={16} /> : memorizedFileIcon({ mimeType: mimeType, size: 18, file_icon_margin: 0 })}
                    {isRenaming ? (
                        <RenameDocument
                            rows={1}
                            topCloseIcon={0}
                            leftCloseIcon={-20}
                            renameFn={(val) => renameFn({ value: val, renameTarget })}
                            renameTarget={renameTarget}
                            is_new={newDoc ?? false}
                            name={renameTarget !== null && renameTarget !== undefined && renameTarget.id === path ? doc_name : ''}
                            disableDoubleClick={disableDoubleClickFn}
                        />
                    ) : (
                        <Typography variant="caption" noWrap maxWidth="80%">
                            {doc_name}
                        </Typography>
                    )}
                </Stack>
            </StyledTableCell>
            <StyledTableCell>
                {!isUndefined(progress) ? (
                    <StyledLinearProgress variant="determinate" value={progress ?? 0} />
                ) : !isUndefined(isExtracting) ? (
                    <StyledLinearProgress variant="indeterminate" />
                ) : (
                    getDateFromObject(created).toString()
                )}
            </StyledTableCell>

            {isObject(permissions) &&
                !isUndefined(permissions) &&
                Object.entries(permissions).map((p: [string, boolean]) => {
                    const perm = p[0] as keyof PermissionTypes;
                    return (
                        <StyledTableCell key={p[0]} sx={{ pl: 1.5 }}>
                            {memorizedPermissionsIcon({
                                type: perm,
                                permission: p[1],
                                theme: theme,
                                size: 10,
                                file_icon_margin: 0
                            })}
                        </StyledTableCell>
                    );
                })}
            <StyledTableCell>{String(subscribed)}</StyledTableCell>
        </>
    );
}
