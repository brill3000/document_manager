// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SnackbarProvider } from 'notistack';
import { FileUploaded } from 'ui-component/alerts/documents';

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
        <DndProvider backend={HTML5Backend}>
            <ThemeCustomization>
                <ScrollTop>
                    <Routes />
                </ScrollTop>
            </ThemeCustomization>
        </DndProvider>
    </SnackbarProvider>
);

export default App;
