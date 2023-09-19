import { useEffect, useState } from 'react';
import { Manager, Notifications, Template, templates } from '@twilio/flex-ui';
import {
  Heading,
  Flex,
  Label,
  Box,
  RadioButtonGroup,
  RadioButton,
  Input,
  Spinner,
  AlertDialog,
} from '@twilio-paste/core';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';
import { ProductFlexIcon } from '@twilio-paste/icons/esm/ProductFlexIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import { merge } from 'lodash';

import { StringTemplates } from '../../flex-hooks/strings';
import { AdminViewWrapper, FeatureCardWrapper } from './AdminView.Styles';
import { getFeatureFlagsUser } from '../../../../utils/configuration';
import FeatureCard from '../FeatureCard';
import AdminUiService from '../../utils/AdminUiService';
import { saveUserConfig, saveGlobalConfig, shouldShowFeature } from '../../utils/helpers';
import { subscribe, unsubscribe, publishMessage, SyncStreamEvent } from '../../utils/sync-stream';
import { AdminUiNotification } from '../../flex-hooks/notifications';

const AdminView = () => {
  const [configureFor, setConfigureFor] = useState('user');
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatedByOtherUser, setIsUpdatedByOtherUser] = useState(false);
  const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
  const [featureList, setFeatureList] = useState([] as string[]);
  const [config, setConfig] = useState({} as any);
  const [globalConfig, setGlobalConfig] = useState({} as any);
  const [userConfig, setUserConfig] = useState({} as any);

  const strings = Manager.getInstance().strings as any;
  const streamEvent = 'template-admin-update';

  useEffect(() => {
    initialize();
    return () => {
      Notifications.dismissNotificationById(AdminUiNotification.SAVE_DISABLED);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setFeatureList(Object.keys(globalConfig).sort());
  }, [globalConfig]);

  useEffect(() => {
    setConfig(configureFor === 'user' ? merge({}, globalConfig, userConfig) : globalConfig);
  }, [configureFor, globalConfig, userConfig]);

  const handleSyncMessage = (event: SyncStreamEvent) => {
    if (event.isLocal) return;

    if (event.message?.data?.event === streamEvent) {
      setIsUpdatedByOtherUser(true);
      setIsUpdatedModalOpen(true);
    }
  };

  const initialize = async () => {
    setIsUpdatedByOtherUser(false);
    setIsUpdatedModalOpen(false);
    setIsLoading(true);
    await subscribe(handleSyncMessage);
    await reloadGlobalConfig();
    reloadUserConfig();
    setIsLoading(false);
  };

  const reloadGlobalConfig = async () => {
    try {
      const newGlobalConfig = (await AdminUiService.fetchUiAttributes()).configuration.custom_data?.features || {};
      setGlobalConfig(newGlobalConfig);
    } catch (error) {
      console.log('admin-ui: Unable to load global config', error);
    }
  };

  const reloadUserConfig = () => {
    const featuresUser = getFeatureFlagsUser()?.features || {};
    setUserConfig(featuresUser);
  };

  const handleSave = async (feature: string, config: any, mergeFeature: boolean): Promise<boolean> => {
    if (configureFor === 'user') {
      const saveResult = await saveUserConfig(feature, config);

      if (saveResult) {
        reloadUserConfig();
        return true;
      }
    } else {
      if (isUpdatedByOtherUser) {
        // Pending reload from another update; prevent save
        return false;
      }

      const saveResult = await saveGlobalConfig(feature, config, mergeFeature);

      if (saveResult) {
        publishMessage({ event: streamEvent });
        setGlobalConfig(saveResult);
        return true;
      }
    }

    return false;
  };

  const handleDismissUpdatedModal = () => {
    setIsUpdatedModalOpen(false);
    Notifications.showNotification(AdminUiNotification.SAVE_DISABLED);
  };

  return (
    <AdminViewWrapper>
      <Flex vAlignContent="center" margin="space50" marginBottom="space0">
        <Flex minWidth="195px" width="310px">
          <Heading as="h2" variant="heading20" marginBottom="space0">
            <Template source={templates[StringTemplates.ADMIN_TITLE]} />
          </Heading>
        </Flex>
        <Flex grow hAlignContent="center">
          <Box width="size30" marginLeft="space30" marginRight="space30">
            <Input
              id="feature-filter"
              name="feature-filter"
              type="search"
              placeholder={strings[StringTemplates.FILTER_FEATURES]}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              insertBefore=<SearchIcon decorative={true} />
            />
          </Box>
        </Flex>
        <Flex vAlignContent="center" minWidth="310px">
          <Box marginRight="space30">
            <Label htmlFor="configure-for" marginBottom="space0">
              <Template source={templates[StringTemplates.CONFIG_FOR_TITLE]} />
            </Label>
          </Box>
          <RadioButtonGroup
            attached
            id="configure-for"
            name="configure-for"
            legend={<></>}
            value={configureFor}
            onChange={(value) => setConfigureFor(value)}
          >
            <RadioButton value="user">
              <UserIcon decorative={true} />
              <Template source={templates[StringTemplates.CONFIG_FOR_MYSELF]} />
            </RadioButton>
            <RadioButton value="global">
              <ProductFlexIcon decorative={true} />
              <Template source={templates[StringTemplates.CONFIG_FOR_EVERYONE]} />
            </RadioButton>
          </RadioButtonGroup>
        </Flex>
      </Flex>
      {isLoading ? (
        <Flex hAlignContent="center" marginTop="space90">
          <Spinner decorative={true} size="sizeIcon110" />
        </Flex>
      ) : (
        <>
          <Box margin="space30">
            <FeatureCardWrapper>
              {featureList
                .filter((feature) => shouldShowFeature(feature) && (!filter || feature.includes(filter)))
                .map((feature) => (
                  <FeatureCard
                    feature={feature}
                    configureFor={configureFor}
                    isUserModified={configureFor === 'user' && userConfig[feature] !== undefined}
                    config={config[feature]}
                    handleSave={handleSave}
                    key={feature}
                  />
                ))}
            </FeatureCardWrapper>
          </Box>
          <AlertDialog
            heading={strings[StringTemplates.UPDATED_MODAL_TITLE]}
            isOpen={isUpdatedModalOpen}
            onConfirm={initialize}
            onConfirmLabel={strings[StringTemplates.UPDATED_MODAL_RELOAD]}
            onDismiss={handleDismissUpdatedModal}
            onDismissLabel={templates.Cancel()}
          >
            <Template source={templates[StringTemplates.UPDATED_MODAL_DESC]} />
          </AlertDialog>
        </>
      )}
    </AdminViewWrapper>
  );
};

export default AdminView;
