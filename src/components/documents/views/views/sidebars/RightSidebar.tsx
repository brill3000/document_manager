import * as React from 'react';
import { Box, Typography } from '@mui/material';
// import { FiHardDrive } from 'react-icons/fi';
import { useViewStore } from 'components/documents/data/global_state/slices/view';
import { useBrowserStore } from 'components/documents/data/global_state/slices/BrowserMock';
import { useGetFoldersPropertiesQuery } from 'store/async/dms/folders/foldersApi';
import { Error, GoogleLoader } from 'ui-component/LoadHandlers';
import { useGetFilePropertiesQuery } from 'store/async/dms/files/filesApi';
import { FolderDetailsList } from './DetailsList/FolderDetailsList';
import { FileDetailsList } from './DetailsList/FileDetailsList';
import { isEmpty } from 'lodash';

export default function RightSidebar() {
    const { browserHeight } = useViewStore();
    const { focused, splitScreen } = useBrowserStore();
    const {
        data: folderInfo,
        error: folderInfoError,
        isFetching: folderInfoIsFetching,
        isLoading: folderInfoIsLoading,
        isSuccess: folderInfoIsSuccess
    } = useGetFoldersPropertiesQuery(
        { fldId: focused.id !== null ? focused.id : '' },
        {
            skip: !focused.is_dir || focused.id === null || focused.id === undefined || isEmpty(focused.id)
        }
    );
    const {
        data: fileInfo,
        error: fileInfoError,
        isFetching: fileInfoIsFetching,
        isLoading: fileInfoIsLoading,
        isSuccess: fileInfoIsSuccess
    } = useGetFilePropertiesQuery(
        { docId: focused.id !== null ? focused.id : '' },
        {
            skip: focused.is_dir || focused.id === null || focused.id === undefined || isEmpty(focused.id)
        }
    );
    return (
        <>
            {folderInfoIsFetching || folderInfoIsLoading || fileInfoIsFetching || fileInfoIsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <GoogleLoader height={100} width={100} loop={true} />
                </Box>
            ) : folderInfoError || fileInfoError ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%" minWidth="100%">
                    <Error height={50} width={50} />
                </Box>
            ) : focused.is_dir ? (
                folderInfoIsSuccess && folderInfo !== null ? (
                    <FolderDetailsList splitScreen={splitScreen} browserHeight={browserHeight} folderInfo={folderInfo} />
                ) : (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="100%"
                        minWidth="100%"
                        sx={{
                            opacity: splitScreen ? 1 : 0,
                            transition: '0.2s all',
                            transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                        }}
                    >
                        <Typography>Nothing Selected</Typography>
                    </Box>
                )
            ) : fileInfoIsSuccess && fileInfo !== null ? (
                <FileDetailsList splitScreen={splitScreen} browserHeight={browserHeight} fileInfo={fileInfo} />
            ) : (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100%"
                    minWidth="100%"
                    sx={{
                        opacity: splitScreen ? 1 : 0,
                        transition: '0.2s all',
                        transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)'
                    }}
                >
                    <Typography>Nothing Selected</Typography>
                </Box>
            )}
        </>
    );
}
