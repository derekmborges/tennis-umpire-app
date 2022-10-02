import { addDoc, collection, getDocs, deleteDoc, doc, setDoc, Timestamp, DocumentSnapshot, SnapshotOptions, query, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { database } from "../firebase";
import { Match } from "../lib/types";

interface DatabaseProviderContextT {
    loading: boolean
    matches: Match[] | null
    handleAdd: (match: Match) => Promise<Match>
    handleUpdate: (match: Match) => void
    handleDelete: (match: Match) => void
}

export const DatabaseProviderContext = createContext<DatabaseProviderContextT>(null!)

export interface ProviderProps {
    children: React.ReactNode
}

const matchConverter = {
    toFirestore: (match: Match) => {
        return {
            ...(match.id && { id: match.id }),
            type: match.type,
            status: match.status,
            player1: match.player1,
            player2: match.player2,
            inProgressSet: match.inProgressSet,
            completedSets: match.completedSets,
            ...(match.startTime && { startTime: Timestamp.fromDate(match.startTime) }),
            ...(match.endTime && { endTime: Timestamp.fromDate(match.endTime) }),
            ...(match.winner && { winner: match.winner }),
        }
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        if (data) {
            return {
                ...(data.id && { id: data.id }),
                type: data.type,
                status: data.status,
                player1: data.player1,
                player2: data.player2,
                inProgressSet: data.inProgressSet,
                completedSets: data.completedSets,
                ...(data.startTime && { startTime: Date.parse(data.startTime) }),
                ...(data.endTime && { endTime: Date.parse(data.endTime) }),
                ...(data.winner && { winner: data.winner })
            } as Match
        }
    }
}

export const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [matches, setMatches] = useState<Match[] | null>(null)

    const matchesCollection = collection(database, "matches").withConverter(matchConverter)

    useEffect(() => {
        setLoading(true)
        const unsubscribe = onSnapshot(query(matchesCollection), (querySnapshot) => {
            const matches: Match[] = []
            querySnapshot.forEach((doc) => {
                const match = doc.data()
                if (match) {
                    matches.push(match)
                }
            });
            setMatches(matches)
            setLoading(false)
        });
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAdd = async (match: Match): Promise<Match> => {
        const docRef = await addDoc(matchesCollection, match)
        match.id = docRef.id
        await setDoc(docRef, match)
        return match
    }
    const handleUpdate = async (match: Match) => {
        if (match.id) {
            const matchRef = doc(database, "matches", match.id)
            await setDoc(matchRef, match)
        }
    }
    const handleDelete = async (match: Match) => {
        if (match.id) {
            await deleteDoc(doc(database, "matches", match.id))
        }
    }

    const contextValue: DatabaseProviderContextT = {
        loading,
        matches,
        handleAdd,
        handleUpdate,
        handleDelete
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