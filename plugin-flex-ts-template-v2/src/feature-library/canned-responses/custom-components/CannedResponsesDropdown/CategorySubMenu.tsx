import React from 'react';
import { Actions, ITask, useFlexSelector } from '@twilio/flex-ui';
import { Menu, MenuItem, useMenuState, SubMenuButton } from '@twilio-paste/core/menu';

import { CannedResponse, ResponseCategory } from '../../types/CannedResponses';
import { replaceStringAttributes } from '../../utils/helpers';

export interface OwnProps {
  category: ResponseCategory;
  menu: any;
  task: ITask;
}

const CategorySubMenu = ({ category, menu, task }: OwnProps) => {
  const submenu = useMenuState();
  const conversationSid = task.attributes.conversationSid ?? task.attributes.channelSid;
  const inputState = useFlexSelector((state) => state.flex.chat.conversationInput[conversationSid]?.inputText);

  const onClickInsert = (text: string) => {
    menu.hide();

    if (!conversationSid) return;
    let currentInput = inputState;
    if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
      currentInput += ' ';
    }
    currentInput += replaceStringAttributes(text, task);
    Actions.invokeAction('SetInputText', {
      body: currentInput,
      conversationSid,
      selectionStart: currentInput.length,
      selectionEnd: currentInput.length,
    });
  };

  return (
    <>
      <SubMenuButton {...submenu}>{category.section}</SubMenuButton>
      <Menu {...submenu} aria-label={category.section} element="CANNED_RESPONSES_MENU">
        {category.responses.map((response: CannedResponse) => (
          <MenuItem {...submenu} key={response.text} onClick={() => onClickInsert(response.text)}>
            {response.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CategorySubMenu;
