import React from 'react';
import FileBrowser from './components/FileBrowser';
import '@fontsource/quicksand';
import './Themes/Sass/App.css';
import { useGetUsersQuery } from 'store/async/dms/auth/authApi';
const FolderView = ({ title }: { title: string }) => {
    const { data, error, isLoading } = useGetUsersQuery({});
    React.useEffect(() => {
        if (error) {
            console.log(error, 'ERROR');
        }
        console.log(data, 'DATA');
    }, [isLoading, error]);
    return <FileBrowser title={title} height="80vh" width="100%" />;
};

export default FolderView;
