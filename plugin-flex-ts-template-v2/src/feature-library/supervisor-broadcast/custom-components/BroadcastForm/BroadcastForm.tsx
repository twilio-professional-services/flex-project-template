import React, { useState } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { Worker } from 'twilio-taskrouter';
import { Box } from '@twilio-paste/core/box';
import { Form, FormControl } from '@twilio-paste/core/form';
import { Input } from '@twilio-paste/core/input';
import { TextArea } from '@twilio-paste/core/textarea';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';
import { Button } from '@twilio-paste/core/button';
import debounce from 'lodash/debounce';

import { StringTemplates } from '../../flex-hooks/strings';
import { fetchWorkers } from '../../utils/taskrouter-workspace';

interface Props {
  targets: Map<string, Worker> | undefined;
  setPreviewTargets: React.Dispatch<React.SetStateAction<Map<string, Worker> | undefined>>;
}

const BroadcastForm = ({ targets, setPreviewTargets }: Props) => {
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

          {Boolean(targets) && (
            <>
              <FormControl>
                <Label htmlFor="compose_message">
                  <Template source={templates[StringTemplates.BROADCAST_FORM_COMPOSEMESSAGE_LABEL]} />
                </Label>
                <TextArea id="compose_message" name="compose_message" />
                <HelpText id="compose_message_help_text">
                  <Template source={templates[StringTemplates.BROADCAST_FORM_COMPOSEMESSAGE_HELP_TEXT]} />
                </HelpText>
              </FormControl>
              <Button variant="primary">Send Broadcast</Button>
            </>
          )}
        </Box>
      </Form>
    </>
  );
};

export default BroadcastForm;
