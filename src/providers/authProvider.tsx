import { getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, User, UserCredential } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
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

    const loadUser = async (googleUser: User) => {
        if (user) return

        const appUser = await handleGetUser(googleUser.uid)
        if (appUser) {
            setUser(appUser)
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(changedUser => {
            if (changedUser) {
                loadUser(changedUser)
            }
        })
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLoginResult = async (result: UserCredential | null) => {
        if (result) {
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
        }
    }

    useEffect(() => {
        getRedirectResult(auth)
            .then(async (result) => {
                if (result) {
                    setAuthenticating(true)
                    await handleLoginResult(result)
                    setAuthenticating(false)
                }
            })
            .catch(function (error) {
                console.error('Error authenticating user:', error)
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = async () => {
        setAuthenticating(true)
        if (isMobile) {
            signInWithRedirect(auth, provider)
            return
        } else {
            try {
                const result = await signInWithPopup(auth, provider)
                await handleLoginResult(result)
            } catch (error) {
                console.error('Error authenticating user:', error)
            }
        }
        setAuthenticating(false)
    }

    const handleLogout = async () => {
        await signOut(auth)
        setUser(null)
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
