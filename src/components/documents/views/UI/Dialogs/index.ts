import React from 'react';
import { FileViewerDialog as FileD } from './FileViewerDialog';
import { PermissionsDialog as PermissionD } from './PermissionsDialog';
import { SearchDialog as SearchD } from './SearchDialog';

const FileViewerDialog = React.memo(FileD);
const PermissionsDialog = React.memo(PermissionD);
const SearchDialog = React.memo(SearchD);

export { FileViewerDialog, PermissionsDialog, SearchDialog };
