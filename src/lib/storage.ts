import { set, get } from "idb-keyval";

export const save = async <T>(key: string, value: T) => {
  await set(key, value);
};

export const load = async <T>(key: string): Promise<T | undefined> => {
  return get<T>(key);
};