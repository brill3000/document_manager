// import * as React from 'react';
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     sendEmailVerification
// } from 'firebase/auth';
// import { auth } from 'firebase-config';
// import { useLocalStorage } from './useLocalStorage';

// const userAuthContext = React.createContext();

// export const UserAuthContextProvider = ({ children }) => {
//     const [user, setUser] = useLocalStorage('user', null);
//     const [workflows, setWorkflows] = useLocalStorage('workflows', null);
//     const [forms, setForms] = useLocalStorage('workflows', null);
//     const [tasks, setTasks] = useLocalStorage('tasks', null);

//     const [userName, setUserName] = useLocalStorage('userName', null);

//     const signUp = async (email, password) => {
//         return await createUserWithEmailAndPassword(auth, email, password);
//     };
//     const updateUserName = async (name) => {
//         return setUserName(name);
//     };
//     const login = async (email, password) => {
//         return await signInWithEmailAndPassword(auth, email, password);
//     };
//     const sendVerification = async () => {
//         return await sendEmailVerification(auth.currentUser);
//     };
//     const handleAddWorkflow = (workflow) => {
//         console.log(workflow);
//     };
//     const handleAddTask = (workflow) => {
//         console.log(workflow);
//     };
//     const logout = async () => {
//         return await signOut(auth);
//     };
//     React.useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser);
//         });
//         return () => {
//             unsubscribe();
//         };
//     }, []);
//     return (
//         <userAuthContext.Provider value={{ user, userName, signUp, login, logout, updateUserName, sendVerification, handleAddWorkflow }}>
//             {children}
//         </userAuthContext.Provider>
//     );
// };

// export const useAppContext = () => React.useContext(userAuthContext);
import { createContext, ReactElement, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const login = async (username: string) => {
    // return await signInWithEmailAndPassword(auth, email, password);
};
const logout = async () => {
    // return await signOut(auth);
};
const user: string | null = null;

const drawerIsOpen: boolean = true;
const openDrawer = () => {};
const closeDrawer = () => {};

const AppContext = createContext({
    user,
    drawerIsOpen,
    login,
    logout,
    closeDrawer,
    openDrawer
});

export const AppContextProvider = ({ children }: { children: ReactElement }) => {
    const [user, setUser] = useLocalStorage<string | null>('user', null);
    const [drawerIsOpen, setDrawerOpen] = useLocalStorage<boolean | null>('drawerIsOpen', true);
    const login = async (username: string) => {
        setUser(username);
    };
    const logout = async () => {
        setUser(null);
    };
    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);
    return <AppContext.Provider value={{ user, login, logout, closeDrawer, openDrawer, drawerIsOpen }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
