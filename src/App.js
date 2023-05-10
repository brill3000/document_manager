// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { DndProvider } from 'react-dnd';
import { SnackbarProvider } from 'notistack';
import { FileUploaded } from 'ui-component/alerts/documents';
import { UserAuthContextProvider } from 'context/authContext';
import { TouchBackend } from 'react-dnd-touch-backend';
import "@fontsource/quicksand";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
    <SnackbarProvider
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        Components={{
            fileUploaded: FileUploaded
        }}
    >
        
        <UserAuthContextProvider>
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                <ThemeCustomization>
                    <ScrollTop>
                        <Routes />
                    </ScrollTop>
                </ThemeCustomization>
            </DndProvider>
        </UserAuthContextProvider>
    </SnackbarProvider>
);

export default App;
