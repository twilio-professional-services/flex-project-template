import logger from '../../../utils/logger';

let data: any = null;

const fetchData = async () => {
  // fetch emoji data
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

    data = await response.json();
  } catch (error: any) {
    logger.error('[emoji-picker] Failed to fetch emoji data', error);
  }
};

export const getEmojiData = async () => {
  if (!data) {
    await fetchData();
  }

  return data;
};
