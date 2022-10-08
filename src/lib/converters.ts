import { Timestamp, DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { Match } from "./models/match";
import { AppUser } from "./models/user";

export const matchConverter = {
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
                type: data.type,
                status: data.status,
                player1: data.player1,
                player2: data.player2,
                inProgressSet: data.inProgressSet,
                completedSets: data.completedSets,
                ...(data.id && { id: data.id }),
                ...(data.startTime && { startTime: data.startTime.toDate() }),
                ...(data.endTime && { endTime: data.endTime.toDate() }),
                ...(data.winner && { winner: data.winner })
            } as Match
        }
    }
}
export const userConverter = {
    toFirestore: (user: AppUser) => {
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoUrl,
            accessToken: user.accessToken
        }
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        if (data) {
            return {
                id: data.id,
                email: data.email,
                displayName: data.displayName,
                photoUrl: data.photoUrl,
                accessToken: data.accessToken
            } as AppUser
        }
    }
}

