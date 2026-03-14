import type { Memory, Pet } from '../types';

const DB_NAME = 'pet-memory-db';
const DB_VERSION = 1;

interface DBSchema {
  pet: Pet;
  memories: Memory[];
  settings: Record<string, any>;
}

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains('pet')) {
        database.createObjectStore('pet', { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains('memories')) {
        database.createObjectStore('memories', { keyPath: 'id' });
      }
      
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings');
      }
    };
  });
};

export const idb = {
  async get<T>(storeName: keyof DBSchema, key: string): Promise<T | undefined> {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  async getAll<T>(storeName: keyof DBSchema): Promise<T[]> {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  async put<T>(storeName: keyof DBSchema, value: T): Promise<void> {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  async delete(storeName: keyof DBSchema, key: string): Promise<void> {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },

  async clear(storeName: keyof DBSchema): Promise<void> {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },
};

export default idb;
