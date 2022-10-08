import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Login } from "../components/Login";
import { auth } from "../firebase";
import { AppUser } from "../lib/models/user";
import { useDatabase } from "./databaseProvider";

interface AuthProviderContextT {
    authenticating: boolean
    user: AppUser | null
    handleLogin: () => void
    handleLogout: () => void
}

export const AuthProviderContext = createContext<AuthProviderContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false)
    const [user, setUser] = useState<AppUser | null>(null)

    const provider = new GoogleAuthProvider()
    const { handleAddUser, handleGetUser } = useDatabase()

    const loadUser = async () => {
        console.log(auth.currentUser)
        if (auth.currentUser) {
            const appUser = await handleGetUser(auth.currentUser.uid)
            console.log(appUser)
            if (appUser) {
                setUser(appUser)
            }
        }
    }

    useEffect(() => {
        loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLogin = async () => {
        setAuthenticating(true)
        try {
            const result = await signInWithPopup(auth, provider)
            const googleUser = result.user;
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken || null;

            const existingUser = await handleGetUser(googleUser.uid)
            if (existingUser) {
                console.log('user exists')
                setUser(existingUser)
            } else {
                console.log('new user')
                const user = await handleAddUser(googleUser, token)
                setUser(user)
            }

        } catch (error) {
            console.error('Error authenticating user:', error)
        }
        setAuthenticating(false)
    }

    const handleLogout = () => {
        setUser(null)
        auth.updateCurrentUser(null)
    }

    const contextValue: AuthProviderContextT = {
        authenticating,
        user,
        handleLogin,
        handleLogout
    }

    return (
        <AuthProviderContext.Provider value={contextValue}>
            {user
                ? children
                : <Login />
            }
        </AuthProviderContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthProviderContext)
}
