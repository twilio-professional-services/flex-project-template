import { TBody, THead, Table, Td, Th, Tr, Button } from '@twilio-paste/core';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { Actions, Manager, templates } from '@twilio/flex-ui';
import { useState } from 'react';

import { StringTemplates } from '../../flex-hooks/strings';
import ParkViewTableBodyWrapper from './ParkViewTableBodyWrapper';

interface ParkViewTableProps {
  recentInteractionsList: Array<any>;
  isLoaded: boolean;
  setDeletedMapItem: (mapItemKey: string) => void;
  reloadTable: () => void;
}

interface ParkViewItem {
  key: string;
  channel: string;
  address: string;
  customerName: string;
  parkingDate: Date;
  webhookSid: string;
}

const ParkViewTable = (props: ParkViewTableProps) => {
  const [isUnparkingSid, setIsUnparkingSid] = useState('');
  const instanceLanguage = Manager?.getInstance().configuration.language || 'en-US';

  const resumeInteraction = async (ConversationSid: string, WebhookSid: string) => {
    setIsUnparkingSid(ConversationSid);
    try {
      await Actions.invokeAction('UnparkInteraction', { ConversationSid, WebhookSid });
      props.setDeletedMapItem(ConversationSid);
      props.reloadTable();
    } catch (error) {
      console.error(error);
    }
    setIsUnparkingSid('');
  };

  const formatDate = (date: Date, language: string) => {
    return new Intl.DateTimeFormat(language, { dateStyle: 'long', timeStyle: 'short' }).format(date);
  };

  return (
    <Table scrollHorizontally>
      <THead>
        <Tr>
          <Th>{templates[StringTemplates.ColumnCustomerName]()}</Th>
          <Th>{templates[StringTemplates.ColumnAddress]()}</Th>
          <Th>{templates[StringTemplates.ColumnDateTimeParked]()}</Th>
          <Th>{templates[StringTemplates.ColumnChannel]()}</Th>
          <Th>{templates[StringTemplates.ColumnAction]()}</Th>
        </Tr>
      </THead>
      <ParkViewTableBodyWrapper isLoading={!props.isLoaded} isEmpty={!props.recentInteractionsList.length}>
        <TBody>
          {props.isLoaded &&
            props.recentInteractionsList.map((interaction: ParkViewItem) => {
              return (
                <Tr key={interaction.key}>
                  <Td>{interaction.customerName}</Td>
                  <Td>{interaction.address}</Td>
                  <Td>{formatDate(interaction.parkingDate, instanceLanguage)}</Td>
                  <Td>{interaction.channel}</Td>
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
