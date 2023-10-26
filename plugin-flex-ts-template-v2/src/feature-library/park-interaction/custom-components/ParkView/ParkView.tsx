import { useEffect, useState } from 'react';
import { Box } from '@twilio-paste/core/box';
import { Manager, templates } from '@twilio/flex-ui';
import { Heading } from '@twilio-paste/core/heading';

import SyncHelper from '../../utils/SyncHelper.js';
import { StringTemplates } from '../../flex-hooks/strings';
import ParkViewTable from './ParkViewTable';
import { ParkedInteraction } from '../../utils/ParkInteractionService';

interface MapItem {
  item: MapItemItem;
}
interface MapItemItem {
  descriptor: MapItemDescriptor;
  dateUpdated: Date;
}

export interface MapItemDescriptor {
  key: string;
  date_created: Date;
  date_updated: Date;
  data: ParkedInteraction;
}

const ParkView = () => {
  const [recentInteractionsList, setRecentInteractionsList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deletedMapItem, setDeletedMapItem] = useState('');
  const workerSid = Manager?.getInstance()?.workerClient?.sid || '';

  const getParkedInteractions = async () => {
    setIsLoaded(false);
    const getSyncMapItems = await SyncHelper.getMapItems(`ParkedInteractions_${workerSid}`);

    if (getSyncMapItems.length === 0) {
      setRecentInteractionsList([]);
      setIsLoaded(true);
      return;
    }

    const formattedSyncMapItems = getSyncMapItems
      .filter((mapItem: MapItem) => {
        // Sometimes the item that was just deleted is still returned
        // So I included this fallback check
        return mapItem.item.descriptor.key !== deletedMapItem;
      })
      .map((mapItem: MapItem) => {
        const data = mapItem.item.descriptor.data;
        if (typeof data.taskAttributes === 'string') {
          data.taskAttributes = JSON.parse(data.taskAttributes);
        }
        let parkingDate;
        if (mapItem.item.descriptor.date_created) {
          parkingDate = new Date(mapItem.item.descriptor.date_created);
        } else {
          // Bug: right after sync map item created, the date_created attribute is not available in the object
          // So we need to use the date_updated, which is the same initially
          parkingDate = mapItem.item.dateUpdated;
        }

        // Use TaskRouter channel name as the main descriptor (e.g. "Chat"), and if channelType is set too - append that for
        // better identify types of interaction (e.g. "Chat (Messenger)")
        let channelDisplayText = `${data.taskChannelUniqueName[0].toUpperCase()}${data.taskChannelUniqueName.slice(1)}`;
        if (data.channelType && data.channelType !== data.taskChannelUniqueName) {
          channelDisplayText += ` (${data.channelType[0].toUpperCase()}${data.channelType.slice(1)})`;
        }

        return {
          key: mapItem.item.descriptor.key,
          channel: channelDisplayText,
          address: data.taskAttributes.customers?.phone || data.taskAttributes.customers?.email,
          customerName: data.taskAttributes?.from,
          parkingDate,
          webhookSid: data.webhookSid,
        };
      });
    const sortedSyncMapItemsByMostRecent = formattedSyncMapItems.sort(
      (a: any, b: any) => b.parkingDate - a.parkingDate,
    );

    setRecentInteractionsList(sortedSyncMapItemsByMostRecent);
    setDeletedMapItem('');
    setIsLoaded(true);
  };

  useEffect(() => {
    getParkedInteractions();
  }, []);

  return (
    <Box width="100%">
      <Box paddingTop="space40" paddingLeft="space60">
        <Heading as="h3" variant="heading30">
          {templates[StringTemplates.ParkedInteractions]()}
        </Heading>
      </Box>
      <ParkViewTable
        recentInteractionsList={recentInteractionsList}
        isLoaded={isLoaded}
        setDeletedMapItem={setDeletedMapItem}
        reloadTable={getParkedInteractions}
      />
    </Box>
  );
};

export default ParkView;
