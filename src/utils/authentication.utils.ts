import { NEXT_APP_AUTH } from "@/constants";
import {
    cleanLocalStorage,
    getLocalStorage,
    setLocalStorage,
} from "./localstorage.utils";

export const isAuthenticated = (): boolean => {
    const localAuthValue: string | undefined = getLocalStorage(NEXT_APP_AUTH);

    return !!localAuthValue;
};

export const authenticateUser = () => {
    setLocalStorage(NEXT_APP_AUTH, "TRUE");
};

export const deauthenticateUser = () => {
    cleanLocalStorage();
};
