// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  InsertEmoji = 'PSEmojiPickerInsertEmoji',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.InsertEmoji]: 'Insert emoji',
  },
});
