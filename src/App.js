// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { DndProvider } from 'react-dnd';
import { SnackbarProvider } from 'notistack';
import { FileUploaded } from 'ui-component/alerts/documents';
import { AppContextProvider } from 'context/appContext';
import { TouchBackend } from 'react-dnd-touch-backend';
import '@fontsource/montserrat';
import { ErrorBoundary } from 'react-error-boundary';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
function MyFallbackComponent({ error, resetErrorBoundary }) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}
// Error logging function
function logErrorToService(error, info) {
    // Use your preferred error logging service
    console.error('Caught an error:', error, info);
}
const App = () => {
    return (
        <ErrorBoundary
            FallbackComponent={MyFallbackComponent}
            onReset={() => {
                // reset the state of your app here
            }}
            onError={logErrorToService}
            resetKeys={['someKey']}
        >
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                Components={{
                    fileUploaded: FileUploaded
                }}
            >
                <AppContextProvider>
                    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                        <ThemeCustomization>
                            <ScrollTop>
                                <Routes />
                            </ScrollTop>
                        </ThemeCustomization>
                    </DndProvider>
                </AppContextProvider>
            </SnackbarProvider>
        </ErrorBoundary>
    );
};

export default App;
