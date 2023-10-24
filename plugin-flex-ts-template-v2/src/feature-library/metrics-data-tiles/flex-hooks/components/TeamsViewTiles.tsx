import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import TeamsViewDataTiles from '../../custom-components/TeamsViewDataTiles/TeamsViewDataTiles';
import { TeamsViewWrapper } from './TeamsViewTiles.Styles';
import { isTaskSummaryEnabled, isTeamActivityEnabled } from '../../config';

export const componentName = FlexComponent.TeamsView;
export const componentHook = function addTeamsViewTiles(flex: typeof Flex) {
  if (isTaskSummaryEnabled() || isTeamActivityEnabled()) {
    flex.TeamsView.Content.addWrapper((OriginalComponent) => (originalProps) => {
      const updatedProps = { ...originalProps };
      return (
        <TeamsViewWrapper>
          <TeamsViewDataTiles />
          <OriginalComponent {...updatedProps} />
        </TeamsViewWrapper>
      );
    });
  }
};
