import { useEffect, useState } from 'react';
import { Box, Table, THead, TBody, Tr, Th, Td, SkeletonLoader } from '@twilio-paste/core';
import { Actions, IconButton, Manager } from '@twilio/flex-ui';
import { Heading } from '@twilio-paste/core/heading';

import SyncHelper from '../../utils/SyncHelper.js';
// import Moment from 'react-moment';

const ParkView = () => {
  const [mapItems, setMapItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [syncEmpty, setSyncEmpty] = useState(false);

  useEffect(() => {
    const mapItemStateUpdate = async () => {
      const workerName = await Manager?.getInstance()?.workerClient?.name;
      const getSyncMapItems = await SyncHelper.getMapItems(workerName);

      if (getSyncMapItems.length === 0) {
        console.warn('Sync Map is empty.');
        setSyncEmpty(true);
        setLoaded(true);
        return;
      }

      console.log('getSyncMapItems', getSyncMapItems);
      const formattedSyncMapItems = getSyncMapItems.map((mapItem: any) => {
        const formattedMapItem = mapItem.item.descriptor.data;
        formattedMapItem.mapKey = mapItem.item.descriptor.key;
        formattedMapItem.dateCreated = mapItem.item.descriptor.date_created;
        if (typeof formattedMapItem.taskAttributes === 'string')
          formattedMapItem.taskAttributes = JSON.parse(formattedMapItem.taskAttributes);
        return formattedMapItem;
      });

      setMapItems(formattedSyncMapItems);
      console.log('formattedSyncMapItems', formattedSyncMapItems);
      setLoaded(true);
    };

    mapItemStateUpdate();
    console.log('#### Interactions Details Component mounted');
  }, []);
  const resumeInteraction = async (ConversationSid: string, WebhookSid: string) => {
    setLoaded(false);
    await Actions.invokeAction('UnparkInteraction', { ConversationSid, WebhookSid });
    setLoaded(true);
  };

  const rowLoadingSkeleton = (rowsNumber: number = 3) => {
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

  return (
    <Box width="100%">
      <Box paddingTop="space40" paddingLeft="space60">
        <Heading as="h3" variant="heading30">
          Recent Interaction List
        </Heading>
      </Box>
      <Table scrollHorizontally>
        <THead>
          <Tr>
            <Th>Channel</Th>
            <Th>Phone/Email</Th>
            <Th>Customer Name</Th>
            <Th>Date & Time</Th>
            <Th>Queue</Th>
            <Th>Action</Th>
          </Tr>
        </THead>
        <TBody>
          {loaded &&
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
                    <IconButton
                      icon={'Message'}
                      title="Resume Interaction"
                      onClick={async () => resumeInteraction(mapItem.mapKey, mapItem.webhookSid)}
                    />
                  </Td>
                </Tr>
              );
            })}
          {!loaded && rowLoadingSkeleton(3)}
        </TBody>
      </Table>
    </Box>
  );
};

export default ParkView;
