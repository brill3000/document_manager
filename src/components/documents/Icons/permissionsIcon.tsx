import * as React from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill, BsShieldFillCheck, BsShieldFillX } from 'react-icons/bs';
import { PermissionTypes } from '../Interface/FileBrowser';
import { TbPencil, TbPencilOff, TbTrash, TbTrashOff } from 'react-icons/tb';
import { Theme } from '@mui/material';
const MemorizedRead = React.memo(BsFillEyeFill);
export const MemorizedReadDenied = React.memo(BsFillEyeSlashFill);
export const MemorizedWrite = React.memo(TbPencil);
export const MemorizedWriteDenied = React.memo(TbPencilOff);
export const MemorizedDelete = React.memo(TbTrash);
export const MemorizedDeleteDenied = React.memo(TbTrashOff);
export const MemorizedSecurity = React.memo(BsShieldFillCheck);
export const MemorizedSecurityDenied = React.memo(BsShieldFillX);

export interface PermissionIconProps {
    type: keyof PermissionTypes;
    permission: boolean;
    size?: number;
    file_icon_margin?: number;
    contrast?: string | null;
    theme: Theme;
}

export const permissionsIcon = ({ type, size, permission, theme, file_icon_margin, contrast }: PermissionIconProps) => {
    switch (type) {
        case 'read':
            return permission ? (
                <MemorizedRead
                    size={size !== undefined ? size : 30}
                    style={{
                        color: contrast ?? theme.palette.success.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            ) : (
                <MemorizedReadDenied
                    size={size !== undefined ? size : 30}
                    style={{
                        color: contrast ?? theme.palette.error.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
        case 'write':
            return permission ? (
                <MemorizedWrite
                    size={size !== undefined ? size * 1.2 : 33}
                    style={{
                        color: contrast ?? theme.palette.success.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            ) : (
                <MemorizedWriteDenied
                    size={size !== undefined ? size * 1.2 : 33}
                    style={{
                        color: contrast ?? theme.palette.error.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
        case 'delete':
            return permission ? (
                <MemorizedDelete
                    size={size !== undefined ? size * 1.2 : 33}
                    style={{
                        color: contrast ?? theme.palette.success.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            ) : (
                <MemorizedDeleteDenied
                    size={size !== undefined ? size * 1.2 : 33}
                    style={{
                        color: contrast ?? theme.palette.error.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
        case 'security':
        default:
            return permission ? (
                <MemorizedSecurity
                    size={size !== undefined ? size : 30}
                    style={{
                        color: contrast ?? theme.palette.success.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            ) : (
                <MemorizedSecurityDenied
                    size={size !== undefined ? size : 30}
                    style={{
                        color: contrast ?? theme.palette.error.main,
                        marginTop: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px',
                        marginBottom: file_icon_margin !== undefined && file_icon_margin !== null ? file_icon_margin : '9px'
                    }}
                />
            );
    }
};
