import React, { useState, useEffect } from 'react';
import { Actions, TaskContext } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/text';
import { Menu, MenuButton, MenuItem, MenuGroup, useMenuState } from '@twilio-paste/core/menu';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';

import {
  CannedResponse,
  CannedResponseCategories,
  ResponseCategory,
} from '../../../../feature-library/canned-responses/types/CannedResponses';
import CannedResponsesService from '../../../../feature-library/canned-responses/utils/CannedResponsesService';
import { ErrorText, TextCopy } from '../../../../feature-library/canned-responses/utils/constants';

const CannedResponsesDropdown: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [responseCategories, setResponseCategories] = useState<undefined | CannedResponseCategories>(undefined);

  const insertMessage = (conversationSid: string | undefined, text: any) => {
    if (!conversationSid) return;
    Actions.invokeAction('SetInputText', { body: text, conversationSid });
  };

  const menu = useMenuState();

  useEffect(() => {
    async function getResponses() {
      try {
        const responses = await CannedResponsesService.fetchCannedResponses();
        setResponseCategories(responses.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }

    getResponses();
  }, []);

  return (
    <Box paddingBottom="space60" margin="auto">
      <TaskContext.Consumer>
        {(context) => (
          <>
            {isLoading ? (
              <SkeletonLoader color="textPrimary" />
            ) : !!responseCategories ? (
              <>
                <MenuButton {...menu} variant="primary" fullWidth={true}>
                  <ChatIcon decorative /> {TextCopy.HEADING}
                </MenuButton>
                <Menu {...menu} aria-label="Preferences">
                  {responseCategories.categories.map((category: ResponseCategory) => (
                    <div key={category.section}>
                      <MenuGroup {...menu} label={category.section}>
                        {category.responses.map((response: CannedResponse) => (
                          <MenuItem
                            {...menu}
                            key={response.text}
                            onClick={() => {
                              insertMessage(context.conversation?.source?.sid, response.text);
                              menu.hide();
                            }}
                          >
                            {response.text}
                          </MenuItem>
                        ))}
                      </MenuGroup>
                    </div>
                  ))}
                </Menu>
              </>
            ) : (
              <Text as="p">{ErrorText.LOADING_ERROR}</Text>
            )}
          </>
        )}
      </TaskContext.Consumer>
    </Box>
  );
};

export default CannedResponsesDropdown;
