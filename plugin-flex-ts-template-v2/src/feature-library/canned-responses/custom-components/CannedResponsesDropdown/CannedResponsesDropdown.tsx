import React, { useState, useEffect } from 'react';
import { ITask, templates } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Tooltip } from '@twilio-paste/tooltip';
import { Menu, MenuButton, MenuGroup, useMenuState } from '@twilio-paste/core/menu';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';
import { Button } from '@twilio-paste/button';

import { CannedResponseCategories, ResponseCategory } from '../../types/CannedResponses';
import CannedResponsesService from '../../utils/CannedResponsesService';
import { StringTemplates } from '../../flex-hooks/strings';
import CategorySubMenu from './CategorySubMenu';

interface CannedResponsesDropdownProps {
  task: ITask;
  disabledReason?: string;
}

const CannedResponsesDropdown: React.FunctionComponent<CannedResponsesDropdownProps> = ({ task, disabledReason }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [responseCategories, setResponseCategories] = useState<undefined | CannedResponseCategories>(undefined);

  const menu = useMenuState({
    placement: 'top-start',
    wrap: 'horizontal',
    modal: true,
  });

  useEffect(() => {
    async function getResponses() {
      try {
        const responses = await CannedResponsesService.fetchCannedResponses();
        setResponseCategories(responses.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        setError(true);
      }
    }

    getResponses();
  }, []);

  useEffect(() => {
    if (!disabledReason || disabledReason === templates.SendMessageTooltip()) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [disabledReason]);

  return (
    <Box>
      {isLoading && <SkeletonLoader />}
      {Boolean(responseCategories) && !isLoading && (
        <>
          <MenuButton {...menu} variant="reset" disabled={isDisabled} element="CANNED_RESPONSES_MENU_BUTTON">
            <ChatIcon decorative title={templates[StringTemplates.CannedResponses]()} />
          </MenuButton>
          <Menu {...menu} aria-label="canned-responses">
            <MenuGroup label={templates[StringTemplates.CannedResponses]()} element="CANNED_RESPONSES_MENU">
              {responseCategories?.categories.map((category: ResponseCategory) => (
                <CategorySubMenu category={category} menu={menu} task={task} key={category.section} />
              ))}
            </MenuGroup>
          </Menu>
        </>
      )}
      {error && (
        <Tooltip text={templates[StringTemplates.ErrorFetching]()}>
          <Button variant={'destructive_icon'}>
            <ErrorIcon decorative />
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default CannedResponsesDropdown;
