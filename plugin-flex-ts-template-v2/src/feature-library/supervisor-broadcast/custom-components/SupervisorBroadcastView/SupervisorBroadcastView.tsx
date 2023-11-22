import { useState } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { Worker } from 'twilio-taskrouter';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';

import { SupervisorBroadcastViewWrapper } from './SupervisorBroadcastView.Styles';
import PreviewBroadcastTargets from '../PreviewBroadcastTargets';
import BroadcastForm from '../BroadcastForm';
import { StringTemplates } from '../../flex-hooks/strings';

const SupervisorBroadcastView = () => {
  const [previewTargets, setPreviewTargets] = useState<Map<string, Worker> | undefined>(undefined);

  return (
    <SupervisorBroadcastViewWrapper>
      <Box margin="space50">
        <Heading as="h2" variant="heading20">
          <Template source={templates[StringTemplates.BROADCAST_VIEW_TITLE]} />
        </Heading>
      </Box>
      <Box margin="space50">
        <BroadcastForm targets={previewTargets} setPreviewTargets={setPreviewTargets} />
      </Box>
      <Box margin="space50">
        <PreviewBroadcastTargets targets={previewTargets} />
      </Box>
    </SupervisorBroadcastViewWrapper>
  );
};

export default SupervisorBroadcastView;
