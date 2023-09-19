import React from 'react';
import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import TeamsViewDataTiles from '../../custom-components/TeamsViewDataTiles/TeamsViewDataTiles';
import { TeamsViewWrapper } from './TeamsViewTiles.Styles';

export const componentName = FlexComponent.TeamsView;
export const componentHook = function addaddTeamsViewTiles(flex: typeof Flex) {
  flex.TeamsView.Content.addWrapper((OriginalComponent) => (originalProps) => {
    const updatedProps = { ...originalProps };
    return (
      <TeamsViewWrapper>
        <TeamsViewDataTiles />
        <OriginalComponent {...updatedProps} />
      </TeamsViewWrapper>
    );
  });
};
