import * as React from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification
} from "firebase/auth";
import { auth } from "firebase-config";
import { useLocalStorage } from "./useLocalStorage";

const userAuthContext = React.createContext();

export const UserAuthContextProvider = ({ children }) => {


    const [user, setUser] = useLocalStorage('user', null)
    const signUp = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password);
    }
    const updateUserName = async (name) => {
        return await updateProfile(auth.currentUser, {displayName: name})
    }
    const login = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    } 
    const sendVerification = async() => {
        return await sendEmailVerification(auth.currentUser)
    }
    const logout = async () => {
        return await signOut(auth);
    }
    React.useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    },[])
    return <userAuthContext.Provider value={{user, signUp, login, logout, updateUserName, sendVerification}}>{children}</userAuthContext.Provider>
}

export const useUserAuth = () => React.useContext(userAuthContext)