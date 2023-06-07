import languages from '../../languages';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChangeLanguage = 'PSLocChangeLanguage',
  Languages = 'PSLocLanguages',
  CurrentLanguage = 'PSLocCurrentLanguage',
  ChangeLanguageDialog = 'PSLocChangeLanguageDialog',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ChangeLanguage]: 'Change language',
    [StringTemplates.Languages]: 'Languages',
    [StringTemplates.CurrentLanguage]: 'This is the current language',
    [StringTemplates.ChangeLanguageDialog]:
      'Are you sure you wish to change the language to {{newLanguage}}? Flex will automatically reload, dropping any active calls.',
  },
});

export const systemStringHook = () => {
  let systemStrings = {};

  languages.forEach((language) => {
    if (language.strings) {
      systemStrings = {
        ...systemStrings,
        [language.key]: language.strings,
      };
    }
  });

  return systemStrings;
};
