import React from 'react';
import { FileViewerDialog as FileD } from './FileViewerDialog';
import { PermissionsDialog as PermissionD } from './PermissionsDialog';

const FileViewerDialog = React.memo(FileD);
const PermissionsDialog = React.memo(PermissionD);

export { FileViewerDialog, PermissionsDialog };
