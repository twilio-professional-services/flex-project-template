import { useEffect, useState } from 'react';
import { Manager, Notifications, Template, templates } from '@twilio/flex-ui';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { Box } from '@twilio-paste/core/box';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/core/heading';
import { Input } from '@twilio-paste/core/input';
import { Label } from '@twilio-paste/core/label';
import { RadioButton, RadioButtonGroup } from '@twilio-paste/core/radio-button-group';
import { Spinner } from '@twilio-paste/core/spinner';
import { Button } from '@twilio-paste/core/button';
import { Stack } from '@twilio-paste/core/stack';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';
import { ProductFlexIcon } from '@twilio-paste/icons/esm/ProductFlexIcon';
import { ProductSettingsIcon } from '@twilio-paste/icons/esm/ProductSettingsIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

const SupervisorBroadcastView = () => {
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    console.log('initialize');
  };

  return (
    <>
      <p>SupervisorBroadcastView</p>
    </>
  );
};

export default SupervisorBroadcastView;
