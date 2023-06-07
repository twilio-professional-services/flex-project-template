import React, { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { EmojiIcon } from '@twilio-paste/icons/esm/EmojiIcon';
import { Button } from '@twilio-paste/core/button';
import Picker from '@emoji-mart/react';

import { EmojiPopover, EmojiWrapper } from './EmojiPicker.Styles';
import { getEmojiData } from '../../helpers/emojiHelper';
import { StringTemplates } from '../../flex-hooks/strings';

/** This component uses EmojiMart
 *  See license text at https://github.com/missive/emoji-mart/blob/main/LICENSE
 */

interface MesageInputProps {
  conversationSid?: string;
  disabledReason?: string;
}

const EmojiPicker = ({ conversationSid, disabledReason }: MesageInputProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});

  const inputState = Flex.useFlexSelector(
    (state) => state.flex.chat.conversationInput[conversationSid ?? '']?.inputText,
  );

  const addEmoji = (selectedEmoji: string) => {
    // get the current input from state and append this emoji to it
    let currentInput = inputState ?? '';

    if (currentInput.length > 0 && currentInput.charAt(currentInput.length - 1) !== ' ') {
      currentInput += ' ';
    }

    currentInput += selectedEmoji;

    Flex.Actions.invokeAction('SetInputText', {
      body: currentInput,
      conversationSid,
      selectionStart: currentInput.length,
      selectionEnd: currentInput.length,
    });
  };

  const togglePicker = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const fetchData = async () => {
    setData(await getEmojiData());
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedEmoji) return;

    addEmoji(selectedEmoji);

    // reset in case user selects same emoji twice
    setSelectedEmoji(null);
  }, [selectedEmoji]);

  useEffect(() => {
    if (!disabledReason || disabledReason === Flex.templates.SendMessageTooltip()) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [disabledReason]);

  return (
    <EmojiWrapper>
      <Button variant="reset" onClick={togglePicker} disabled={isDisabled} element="EMOJI_PICKER_BUTTON">
        <EmojiIcon decorative={false} title={Flex.templates[StringTemplates.InsertEmoji]()} />
      </Button>
      {isOpen && data && (
        <EmojiPopover>
          <Picker
            data={data}
            autoFocus={true}
            maxFrequentRows={2}
            navPosition="bottom"
            previewPosition="none"
            skinTonePosition="search"
            onEmojiSelect={(e: any) => {
              setSelectedEmoji(e.native);
              setIsOpen(false);
            }}
            onClickOutside={() => {
              setIsOpen(false);
            }}
          />
        </EmojiPopover>
      )}
    </EmojiWrapper>
  );
};

export default EmojiPicker;
