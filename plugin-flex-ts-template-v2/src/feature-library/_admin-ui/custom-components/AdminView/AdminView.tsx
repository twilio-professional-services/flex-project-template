import { useEffect, useState } from 'react';
import { Manager, Notifications, Template, templates } from '@twilio/flex-ui';
import { Heading, Flex, Box, RadioButtonGroup, RadioButton, Input, Spinner } from '@twilio-paste/core';
import { UserIcon } from '@twilio-paste/icons/esm/UserIcon';
import { ProductFlexIcon } from '@twilio-paste/icons/esm/ProductFlexIcon';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import Grid from '@material-ui/core/Grid';
import { merge } from 'lodash';

import { StringTemplates } from '../../flex-hooks/strings';
import { AdminViewWrapper } from './AdminView.Styles';
import { getFeatureFlagsUser } from '../../../../utils/configuration';
import FeatureCard from '../FeatureCard';
import AdminUiService from '../../utils/AdminUiService';
import { updateWorkerSetting, resetWorkerSetting } from '../../utils/helpers';
import { AdminUiNotification } from '../../flex-hooks/notifications';

const AdminView = () => {
  const [configureFor, setConfigureFor] = useState('user');
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [featureList, setFeatureList] = useState([] as string[]);
  const [config, setConfig] = useState({} as any);
  const [globalConfig, setGlobalConfig] = useState({} as any);
  const [userConfig, setUserConfig] = useState({} as any);

  const strings = Manager.getInstance().strings as any;

  useEffect(() => {
    reloadConfig();
  }, []);

  useEffect(() => {
    setFeatureList(Object.keys(globalConfig).sort());
  }, [globalConfig]);

  useEffect(() => {
    setConfig(configureFor === 'user' ? merge({}, globalConfig, userConfig) : globalConfig);
  }, [configureFor, globalConfig, userConfig]);

  const reloadConfig = async () => {
    setIsLoading(true);
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

  const handleSave = async (feature: string, config: any): Promise<boolean> => {
    if (configureFor === 'user') {
      try {
        if (config) {
          await updateWorkerSetting(feature, config);
        } else {
          await resetWorkerSetting(feature);
        }
        reloadUserConfig();
      } catch (error) {
        Notifications.showNotification(AdminUiNotification.SAVE_ERROR);
        console.log('admin-ui: Unable to update user config', error);
        return false;
      }
    } else {
      try {
        const updateResponse = await AdminUiService.updateUiAttributes(
          JSON.stringify({
            custom_data: {
              features: {
                [feature]: config,
              },
            },
          }),
        );
        if (updateResponse?.configuration?.custom_data?.features) {
          setGlobalConfig(updateResponse.configuration.custom_data.features);
        } else {
          Notifications.showNotification(AdminUiNotification.SAVE_ERROR);
          console.log('admin-ui: Unexpected response upon updating global config', updateResponse);
          return false;
        }
      } catch (error) {
        Notifications.showNotification(AdminUiNotification.SAVE_ERROR);
        console.log('admin-ui: Unable to update global config', error);
        return false;
      }
    }

    Notifications.showNotification(AdminUiNotification.SAVE_SUCCESS);

    return true;
  };

  return (
    <AdminViewWrapper>
      <Flex vAlignContent="center" margin="space50" marginBottom="space0">
        <Flex>
          <Heading as="h2" variant="heading20" marginBottom="space0">
            <Template source={templates[StringTemplates.ADMIN_TITLE]} />
          </Heading>
        </Flex>
        <Flex grow hAlignContent="center">
          <Box width="size30">
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
        <Flex>
          <RadioButtonGroup
            attached
            name="configure-for"
            legend={<Template source={templates[StringTemplates.CONFIG_FOR_TITLE]} />}
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
            <Grid container>
              {(filter ? featureList.filter((feature) => feature.includes(filter)) : featureList).map((feature) => (
                <FeatureCard
                  feature={feature}
                  configureFor={configureFor}
                  isUserModified={configureFor === 'user' && userConfig[feature] !== undefined}
                  config={config[feature]}
                  handleSave={handleSave}
                  key={feature}
                />
              ))}
            </Grid>
          </Box>
        </>
      )}
    </AdminViewWrapper>
  );
};

export default AdminView;
