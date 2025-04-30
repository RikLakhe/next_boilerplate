/* eslint-disable */
// @ts-nocheck

/**
 *  Store string record in the storage
 * @param {string} key
 * @param {string |array } value
 */
export const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    if (value && typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } else {
    return false;
  }
};

/**
 * Retrieve record from the storage using the key
 * @param {string} key
 */
export const getLocalStorage = (key: string, value?: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data!);
    } catch (e) {
      return data;
    }
  } else return false;
};

export const clearLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  } else return false;
};
