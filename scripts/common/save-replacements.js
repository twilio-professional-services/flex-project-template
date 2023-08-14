import shell from 'shelljs';

export default async (data, path) => {
  try {
    console.log(`Setting up ${path}...`);
    
    for (const key in data) {
      shell.sed('-i', new RegExp(`<YOUR_${key}>`, 'g'), data[key], path);
    }
  } catch (error) {
    console.error('Error saving environment variables', error);
    return null;
  }
}