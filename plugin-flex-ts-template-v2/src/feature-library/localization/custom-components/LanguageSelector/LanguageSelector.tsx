import { useState } from 'react';
import { Actions, Template, templates } from '@twilio/flex-ui';
import { MenuButton, MenuGroup, useMenuState, Menu, MenuItem } from '@twilio-paste/core/menu';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { Flex } from '@twilio-paste/core/flex';
import { TranslationIcon } from '@twilio-paste/icons/esm/TranslationIcon';

import languages from '../../languages';
import { Language } from '../../types/Language';
import { getUserLanguage } from '../../../../utils/configuration';
import { StringTemplates } from '../../flex-hooks/strings';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null as Language | null);
  const menu = useMenuState();
  const currentLanguage = getUserLanguage();

  const handleClose = () => setSelectedLanguage(null);

  const setLanguage = async () => {
    if (!selectedLanguage) {
      return;
    }

    await Actions.invokeAction('SetWorkerAttributes', {
      attributes: { language: selectedLanguage?.key },
      mergeExisting: true,
    });
    location.reload();
  };

  return (
    <Flex hAlignContent="center" vAlignContent="center">
      <MenuButton {...menu} variant="reset" element={menu.visible ? 'LANG_SELECT_BUTTON_OPEN' : 'LANG_SELECT_BUTTON'}>
        <TranslationIcon decorative={false} title={templates[StringTemplates.ChangeLanguage]()} />
      </MenuButton>
      <Menu {...menu} aria-label={templates[StringTemplates.Languages]()}>
        <MenuGroup label={templates[StringTemplates.ChangeLanguage]()}>
          {languages.map((language) => (
            <MenuItem
              {...menu}
              onClick={async () => setSelectedLanguage(language)}
              key={language.key}
              disabled={language.key === currentLanguage}
              title={language.key === currentLanguage ? templates[StringTemplates.CurrentLanguage]() : ''}
            >
              {language.name}
            </MenuItem>
          ))}
        </MenuGroup>
      </Menu>
      <AlertDialog
        heading={templates[StringTemplates.ChangeLanguage]()}
        isOpen={selectedLanguage !== null}
        onConfirm={async () => setLanguage()}
        onConfirmLabel={templates.ConfirmableDialogConfirmButton()}
        onDismiss={handleClose}
        onDismissLabel={templates.ConfirmableDialogCancelButton()}
      >
        <Template source={templates[StringTemplates.ChangeLanguageDialog]} newLanguage={selectedLanguage?.name} />
      </AlertDialog>
    </Flex>
  );
};

export default LanguageSelector;
