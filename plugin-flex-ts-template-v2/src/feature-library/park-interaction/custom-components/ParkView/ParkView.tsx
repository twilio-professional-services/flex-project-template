import { useEffect, useState } from 'react';
import { Box } from '@twilio-paste/core';
import { Manager, templates } from '@twilio/flex-ui';
import { Heading } from '@twilio-paste/core/heading';

import SyncHelper from '../../utils/SyncHelper.js';
import { StringTemplates } from '../../flex-hooks/strings';
import ParkViewTable from './ParkViewTable';

const ParkView = () => {
  const [recentInteractionsList, setRecentInteractionsList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getRecentInteractionList = async () => {
      const workerName = Manager?.getInstance()?.workerClient?.name;
      const instanceLanguage = Manager?.getInstance().configuration.language;
      const getSyncMapItems = await SyncHelper.getMapItems(workerName);

      if (getSyncMapItems.length === 0) {
        console.warn('Sync Map is empty.');
        setIsLoaded(true);
        return;
      }

      const formattedSyncMapItems = getSyncMapItems.map((mapItem: any) => {
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

        return {
          key: mapItem.item.descriptor.key,
          channel: `${data.taskChannelUniqueName[0].toUpperCase()}${data.taskChannelUniqueName.slice(1)}`,
          phoneOrEmail: data.taskAttributes.customers?.phone || data.taskAttributes.customers?.email,
          customerName: data.taskAttributes?.from,
          parkingDate: new Intl.DateTimeFormat(instanceLanguage, { dateStyle: 'long', timeStyle: 'short' }).format(
            parkingDate,
          ),
          webhookSid: data.webhookSid,
        };
      });

      setRecentInteractionsList(formattedSyncMapItems);
      setIsLoaded(true);
    };

    getRecentInteractionList();
  }, []);

  return (
    <Box width="100%">
      <Box paddingTop="space40" paddingLeft="space60">
        <Heading as="h3" variant="heading30">
          {templates[StringTemplates.RecentInteractionList]()}
        </Heading>
      </Box>
      <ParkViewTable recentInteractionsList={recentInteractionsList} isLoaded={isLoaded} />
    </Box>
  );
};

export default ParkView;
