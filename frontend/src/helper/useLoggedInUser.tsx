import {useEffect, useState} from "react";
import {User} from "../adapter/api/__generated";

export const useLoggedInUser = () => {
    const [user, setUser] = useState<User | null>(null);

    const setUserFromStorage = () => {
        const currentUser = JSON.parse(sessionStorage.getItem('user')!);
        if (currentUser) {
            setUser(currentUser.User);
        }
    }

    useEffect(() => {
        setUserFromStorage();
    }, []);

    return {user,setUserFromStorage, setUser};
}