import { Dispatch, SetStateAction, useState } from 'react';

function useStorage<T>(storageContainer: Storage, key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storageContainerValue, setStorageContainerValue] = useState<T>(() => {
    try {
      const item = storageContainer.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: any) {
      console.error(error);
      return initialValue;
    }
  });

  const storageContainerSetter = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storageContainerValue) : value;
      setStorageContainerValue(valueToStore);
      storageContainer.setItem(key, JSON.stringify(valueToStore));
    } catch (error: any) {
      console.error(error);
    }
  };

  return [storageContainerValue, storageContainerSetter];
}

export const useLocalStorage = <T>(key: string, initialValue: T) => useStorage(window.localStorage, key, initialValue);
export const useSessionStorage = <T>(key: string, initialValue: T) => useStorage(window.sessionStorage, key, initialValue);
