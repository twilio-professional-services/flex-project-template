import { TBody, THead, Table, Td, Th, Tr, Button } from '@twilio-paste/core';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { Actions, templates } from '@twilio/flex-ui';
import { useState } from 'react';

import { StringTemplates } from '../../flex-hooks/strings';
import ParkViewTableBodyWrapper from './ParkViewTableBodyWrapper';

interface ParkViewTableProps {
  recentInteractionsList: Array<any>;
  isLoaded: boolean;
}

interface ParkViewItem {
  key: string;
  channel: string;
  phoneOrEmail: string;
  customerName: string;
  parkingDate: string;
  webhookSid: string;
}

const ParkViewTable = (props: ParkViewTableProps) => {
  const [isUnparkingSid, setIsUnparkingSid] = useState('');

  const resumeInteraction = async (ConversationSid: string, WebhookSid: string) => {
    setIsUnparkingSid(ConversationSid);
    try {
      await Actions.invokeAction('UnparkInteraction', { ConversationSid, WebhookSid });
    } catch (error) {
      console.error(error);
    }
    setIsUnparkingSid('');
  };

  return (
    <Table scrollHorizontally>
      <THead>
        <Tr>
          <Th>{templates[StringTemplates.ColumnChannel]()}</Th>
          <Th>{templates[StringTemplates.ColumnPhoneEmail]()}</Th>
          <Th>{templates[StringTemplates.ColumnCustomerName]()}</Th>
          <Th>{templates[StringTemplates.ColumnParkingDateAndTime]()}</Th>
          <Th>{templates[StringTemplates.ColumnAction]()}</Th>
        </Tr>
      </THead>
      <ParkViewTableBodyWrapper isLoading={!props.isLoaded} isEmpty={!props.recentInteractionsList.length}>
        <TBody>
          {props.isLoaded &&
            props.recentInteractionsList.map((interaction: ParkViewItem) => {
              return (
                <Tr key={interaction.key}>
                  <Td>{interaction.channel}</Td>
                  <Td>{interaction.phoneOrEmail}</Td>
                  <Td>{interaction.customerName}</Td>
                  <Td>{interaction.parkingDate}</Td>
                  <Td>
                    <Button
                      variant="secondary_icon"
                      size="reset"
                      disabled={Boolean(isUnparkingSid && isUnparkingSid !== interaction.key)}
                      loading={isUnparkingSid === interaction.key}
                      onClick={async () => resumeInteraction(interaction.key, interaction.webhookSid)}
                    >
                      <ChatIcon
                        decorative={false}
                        size="sizeIcon40"
                        title={templates[StringTemplates.ResumeInteraction]()}
                      />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
        </TBody>
      </ParkViewTableBodyWrapper>
    </Table>
  );
};

export default ParkViewTable;
