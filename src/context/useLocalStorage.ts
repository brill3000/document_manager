import { useState } from 'react';

export const useLocalStorage = <T>(keyName: string, defaultValue: T) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });
    const setValue = (newValue: T) => {
        try {
            console.log(newValue, 'NEW VALUE');
            console.log(JSON.stringify(newValue), 'STRINGIFY');
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {}
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
};
