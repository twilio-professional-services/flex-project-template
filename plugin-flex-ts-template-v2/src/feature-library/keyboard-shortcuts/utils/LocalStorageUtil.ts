import logger from '../../../utils/logger';

export const readFromLocalStorage = (key: string) => {
  if (!key || typeof key !== 'string') {
    throw new Error(`${key} is an invalid key.`);
  }

  try {
    return localStorage.getItem(key);
  } catch (error: any) {
    logger.error(`[keyboard-shortcuts] Unable to read ${key} from localStorage.`, error);
    throw new Error(`Unable to read ${key} from localStorage.`);
  }
};

export const writeToLocalStorage = (key: string, value: string | object) => {
  if (!key || typeof key !== 'string') {
    throw new Error(`${key} is an invalid key.`);
  }

  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error: any) {
    logger.error(`[keyboard-shortcuts] Unable to add ${key} to localStorage.`, error);
    throw new Error(`Unable to add ${key} to localStorage.`);
  }
};

export const deleteFromLocalStorage = (key: string) => {
  if (!key || typeof key !== 'string') {
    throw new Error(`${key} is an invalid key.`);
  }

  try {
    localStorage.removeItem(key);
  } catch (error: any) {
    logger.error(`[keyboard-shortcuts] Unable to delete ${key} from localStorage.`, error);
    throw new Error(`Unable to delete ${key} from localStorage.`);
  }
};

export const deleteMultipleFromLocalStorage = (key: string[]) => {
  if (!key || key.length === 0 || !Array.isArray(key)) {
    throw new Error(`${key} is an invalid array.`);
  }

  try {
    const keyArray: string[] = key;
    keyArray.forEach((key: string) => localStorage.removeItem(key));
  } catch (error: any) {
    logger.error(`[keyboard-shortcuts] Unable to delete ${key} from localStorage.`, error);
    throw new Error(`Unable to delete ${key} from localStorage.`);
  }
};
