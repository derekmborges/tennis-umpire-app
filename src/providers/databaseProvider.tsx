import { User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { createContext, useContext } from "react";
import { database } from "../firebase";
import { userConverter } from "../lib/converters";
import { Match } from "../lib/models/match";
import { AppUser } from "../lib/models/user";

interface DatabaseProviderContextT {
    handleAddUser: (user: User, accessToken: string | null) => Promise<AppUser>
    handleGetUser: (userId: string) => Promise<AppUser | undefined>
    handleAddMatch: (userId: string, match: Match) => Promise<Match>
    handleUpdateMatch: (userId: string, match: Match) => void
    handleDeleteMatch: (userId: string, match: Match) => void
}

export const DatabaseProviderContext = createContext<DatabaseProviderContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

export const COLLECTION_USERS = 'Users'
export const COLLECTION_MATCHES = 'Matches'

export const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {

    const handleGetUser = async (userId: string): Promise<AppUser | undefined> => {
        const userDoc = await getDoc(doc(database, "Users", userId).withConverter(userConverter))
        return userDoc.data()
    }

    const handleAddUser = async (user: User, accessToken: string | null): Promise<AppUser> => {
        const userDoc = doc(database, "Users", user.uid)
        const appUser: AppUser = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
            accessToken: accessToken
        }
        await setDoc(userDoc, appUser)
        return appUser
    }

    const handleAddMatch = async (userId: string, match: Match): Promise<Match> => {
        const userMatchCollection = collection(database, COLLECTION_USERS, userId, COLLECTION_MATCHES)
        const docRef = await addDoc(userMatchCollection, match)
        match.id = docRef.id
        await setDoc(docRef, match)
        return match
    }
    const handleUpdateMatch = async (userId: string, match: Match) => {
        if (match.id) {
            const matchRef = doc(database, COLLECTION_USERS, userId, COLLECTION_MATCHES, match.id)
            await setDoc(matchRef, match)
        }
    }
    const handleDeleteMatch = async (userId: string, match: Match) => {
        if (match.id) {
            await deleteDoc(doc(database, COLLECTION_USERS, userId, COLLECTION_MATCHES, match.id))
        }
    }

    const contextValue: DatabaseProviderContextT = {
        handleAddUser,
        handleGetUser,
        handleAddMatch,
        handleUpdateMatch,
        handleDeleteMatch,
    }

    return (
        <DatabaseProviderContext.Provider value={contextValue}>
            {children}
        </DatabaseProviderContext.Provider>
    )
}

export const useDatabase = () => {
    return useContext(DatabaseProviderContext)
}