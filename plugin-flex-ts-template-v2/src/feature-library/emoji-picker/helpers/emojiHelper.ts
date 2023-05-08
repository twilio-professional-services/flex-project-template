let data: any = null;

const fetchData = async () => {
  // fetch emoji data
  const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');

  data = await response.json();
};

export const getEmojiData = async () => {
  if (!data) {
    await fetchData();
  }

  return data;
};
