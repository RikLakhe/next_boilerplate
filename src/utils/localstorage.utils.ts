export const getLocalStorage = (key?: string): string => {
    if (!key) {
        return "";
    }

    if (typeof window !== "undefined") {
        let retrunValue = "";
        const localData: string | null = localStorage.getItem(key);

        if (localData) {
            retrunValue = localData;
        }

        return retrunValue;
    }

    return "";
};

export const setLocalStorage = (key: string, value: string): void => {
    if (!key && !value) {
        return;
    }

    localStorage.setItem(key, value);
};

export const cleanLocalStorage = (key?: string): void => {
    if (!key) {
        localStorage.clear();
        return;
    }

    setLocalStorage(key, "");
};
