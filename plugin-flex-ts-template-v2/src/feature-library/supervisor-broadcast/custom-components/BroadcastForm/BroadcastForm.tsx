import React, { useState } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { Worker } from 'twilio-taskrouter';
import { Box } from '@twilio-paste/core/box';
import { Form, FormControl } from '@twilio-paste/core/form';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import debounce from 'lodash/debounce';

import { StringTemplates } from '../../flex-hooks/strings';
import { fetchWorkers } from '../../utils/taskrouter-workspace';

interface Props {
  setPreviewTargets: React.Dispatch<React.SetStateAction<Map<string, Worker> | undefined>>;
}

const BroadcastForm = ({ setPreviewTargets }: Props) => {
  const handleTargetWorkerExpressionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setPreviewTargets(undefined);
      return;
    }
    const workers = await fetchWorkers(event.target.value);
    setPreviewTargets(workers);
  };
  const debouncedTargetWorkerExpressionChange = debounce(handleTargetWorkerExpressionChange, 1000);

  return (
    <>
      <Form maxWidth="size70">
        <Box display="flex" flexDirection="column">
          <FormControl>
            <Label htmlFor="target_worker_expression">
              <Template source={templates[StringTemplates.BROADCAST_FORM_TARGETWORKEREXPRESSION_LABEL]} />
            </Label>
            <Input
              id="target_worker_expression"
              name="target_worker_expression"
              type="text"
              onChange={debouncedTargetWorkerExpressionChange}
            />
            <HelpText id="target_worker_expression_help_text">
              <Template source={templates[StringTemplates.BROADCAST_FORM_TARGETWORKEREXPRESSION_HELP_TEXT]} />
            </HelpText>
          </FormControl>
        </Box>
      </Form>
    </>
  );
};

export default BroadcastForm;
