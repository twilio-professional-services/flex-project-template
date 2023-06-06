import { useState } from 'react';
import { Actions, Manager, Template, templates } from '@twilio/flex-ui';
import { Flex, MenuButton, MenuGroup, useMenuState, Menu, MenuItem, AlertDialog } from '@twilio-paste/core';
import { TranslationIcon } from '@twilio-paste/icons/esm/TranslationIcon';

import languages from '../../languages';
import { Language } from '../../types/Language';
import { getUserLanguage } from '../../../../utils/configuration';
import { StringTemplates } from '../../flex-hooks/strings';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null as Language | null);
  const menu = useMenuState();
  const currentLanguage = getUserLanguage();
  const strings = Manager.getInstance().strings as any;

  const handleClose = () => setSelectedLanguage(null);

  const setLanguage = async () => {
    if (!selectedLanguage) {
      return;
    }

    await Actions.invokeAction('SetWorkerAttributes', {
      attributes: { custom_data: { language: selectedLanguage?.key } },
      mergeExisting: true,
    });
    location.reload();
  };

  return (
    <Flex hAlignContent="center" vAlignContent="center">
      <MenuButton {...menu} variant="reset" element={menu.visible ? 'LANG_SELECT_BUTTON_OPEN' : 'LANG_SELECT_BUTTON'}>
        <TranslationIcon decorative={false} title={strings[StringTemplates.ChangeLanguage]} />
      </MenuButton>
      <Menu {...menu} aria-label={strings[StringTemplates.Languages]}>
        <MenuGroup label={strings[StringTemplates.ChangeLanguage]}>
          {languages.map((language) => (
            <MenuItem
              {...menu}
              onClick={async () => setSelectedLanguage(language)}
              key={language.key}
              disabled={language.key === currentLanguage}
              title={language.key === currentLanguage ? strings[StringTemplates.CurrentLanguage] : ''}
            >
              {language.name}
            </MenuItem>
          ))}
        </MenuGroup>
      </Menu>
      <AlertDialog
        heading={strings[StringTemplates.ChangeLanguage]}
        isOpen={selectedLanguage !== null}
        onConfirm={async () => setLanguage()}
        onConfirmLabel={strings[StringTemplates.Change]}
        onDismiss={handleClose}
        onDismissLabel={strings[StringTemplates.Cancel]}
      >
        <Template source={templates[StringTemplates.ChangeLanguageDialog]} newLanguage={selectedLanguage?.name} />
      </AlertDialog>
    </Flex>
  );
};

export default LanguageSelector;
