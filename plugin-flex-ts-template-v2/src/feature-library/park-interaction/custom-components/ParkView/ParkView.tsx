import { useEffect, useState } from 'react';
import { Box, Table, THead, TBody, Tr, Th, Td, SkeletonLoader, Button } from '@twilio-paste/core';
import { ChatIcon } from '@twilio-paste/icons/esm/ChatIcon';
import { Actions, Manager, templates } from '@twilio/flex-ui';
import { Heading } from '@twilio-paste/core/heading';

import SyncHelper from '../../utils/SyncHelper.js';
// import Moment from 'react-moment';
import { StringTemplates } from '../../flex-hooks/strings';

const ParkView = () => {
  const [mapItems, setMapItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUnparking, setIsUnparking] = useState(false);

  useEffect(() => {
    const mapItemStateUpdate = async () => {
      const workerName = await Manager?.getInstance()?.workerClient?.name;
      const getSyncMapItems = await SyncHelper.getMapItems(workerName);

      if (getSyncMapItems.length === 0) {
        console.warn('Sync Map is empty.');
        setIsLoaded(true);
        return;
      }

      const formattedSyncMapItems = getSyncMapItems.map((mapItem: any) => {
        const formattedMapItem = mapItem.item.descriptor.data;
        formattedMapItem.mapKey = mapItem.item.descriptor.key;
        formattedMapItem.dateCreated = mapItem.item.descriptor.date_created;
        if (typeof formattedMapItem.taskAttributes === 'string')
          formattedMapItem.taskAttributes = JSON.parse(formattedMapItem.taskAttributes);
        return formattedMapItem;
      });

      setMapItems(formattedSyncMapItems);
      setIsLoaded(true);
    };

    mapItemStateUpdate();
    console.log('#### Interactions Details Component mounted');
  }, []);
  const resumeInteraction = async (ConversationSid: string, WebhookSid: string) => {
    setIsUnparking(true);
    try {
      await Actions.invokeAction('UnparkInteraction', { ConversationSid, WebhookSid });
    } catch (error) {
      console.error(error);
    }
    setIsUnparking(false);
  };

  const loadingRowsSkeleton = (rowsNumber: number = 3) => {
    return [...Array(rowsNumber)].map((_, rowIndex: number) => (
      <Tr key={`row-${rowIndex}`}>
        <Td>
          <SkeletonLoader width="35%" />
        </Td>
        <Td>
          <SkeletonLoader width="50%" />
        </Td>
        <Td>
          <SkeletonLoader width="50%" />
        </Td>
        <Td>
          <SkeletonLoader width="35%" />
        </Td>
        <Td>
          <SkeletonLoader width="35%" />
        </Td>
        <Td>
          <SkeletonLoader width="20%" />
        </Td>
      </Tr>
    ));
  };

  const emptyState = () => (
    <Tr>
      <Td textAlign="center" colSpan={6}>
        {templates[StringTemplates.NoItemsToList]()}
      </Td>
    </Tr>
  );

  return (
    <Box width="100%">
      <Box paddingTop="space40" paddingLeft="space60">
        <Heading as="h3" variant="heading30">
          {templates[StringTemplates.RecentInteractionList]()}
        </Heading>
      </Box>
      <Table scrollHorizontally>
        <THead>
          <Tr>
            <Th>{templates[StringTemplates.ColumnChannel]()}</Th>
            <Th>{templates[StringTemplates.ColumnPhoneEmail]()}</Th>
            <Th>{templates[StringTemplates.ColumnCustomerName]()}</Th>
            <Th>{templates[StringTemplates.ColumnDateAndTime]()}</Th>
            <Th>{templates[StringTemplates.ColumnQueue]()}</Th>
            <Th>{templates[StringTemplates.ColumnAction]()}</Th>
          </Tr>
        </THead>
        <TBody>
          {isLoaded &&
            mapItems.map((mapItem: any) => {
              // REMOVE THIS ANY
              return (
                <Tr key={mapItem.mapKey}>
                  <Td>{mapItem?.taskChannelUniqueName}</Td>
                  <Td>{mapItem?.taskAttributes?.customers?.phone || mapItem?.taskAttributes?.customers?.email}</Td>
                  <Td>{mapItem?.taskAttributes?.from}</Td>
                  <Td>{mapItem?.dateCreated}</Td>
                  <Td>{mapItem?.taskAttributes?.originalRouting?.queueName || '-'}</Td>
                  <Td>
                    <Button
                      variant="secondary_icon"
                      size="reset"
                      loading={isUnparking}
                      onClick={async () => resumeInteraction(mapItem.mapKey, mapItem.webhookSid)}
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
          {!isLoaded && loadingRowsSkeleton(3)}
          {isLoaded && !mapItems.length && emptyState()}
        </TBody>
      </Table>
    </Box>
  );
};

export default ParkView;
