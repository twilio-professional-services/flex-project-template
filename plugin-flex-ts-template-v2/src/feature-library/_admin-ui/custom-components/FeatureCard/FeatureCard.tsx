import { useState } from 'react';
import { Manager, Template, templates } from '@twilio/flex-ui';
import { Heading, Flex, Box, Stack, Card, Switch, Button, Anchor } from '@twilio-paste/core';
import { SkipBackIcon } from '@twilio-paste/icons/esm/SkipBackIcon';
import { ProductSettingsIcon } from '@twilio-paste/icons/esm/ProductSettingsIcon';

import { StringTemplates } from '../../flex-hooks/strings';
import FeatureModal from '../FeatureModal';
import { formatName, formatDocsUrl } from '../../utils/helpers';

interface Props {
  feature: string;
  configureFor: string;
  isUserModified?: boolean;
  config: any;
  handleSave: (feature: string, config: any) => Promise<boolean>;
}

const FeatureCard = ({ feature, configureFor, isUserModified, config, handleSave }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasMoreSettings = Object.keys(config).filter((key) => key !== 'enabled').length > 0;
  const strings = Manager.getInstance().strings as any;

  const handleReset = async () => {
    setIsSaving(true);
    await handleSave(feature, undefined);
    setIsSaving(false);
  };

  const handleEnabledChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSaving(true);
    await handleSave(feature, { enabled: e.target.checked });
    setIsSaving(false);
  };

  return (
    <Box margin="space30">
      <Card padding="space50">
        <Flex vAlignContent="center" marginBottom="space30">
          <Flex>
            <Heading as="h4" variant="heading40" marginBottom="space0">
              {formatName(feature)}
            </Heading>
          </Flex>
          <Flex grow marginLeft="space90" hAlignContent="right">
            <Anchor href={formatDocsUrl(feature)} showExternal>
              <Template source={templates[StringTemplates.DOCS]} />
            </Anchor>
          </Flex>
        </Flex>
        <Flex vAlignContent="center">
          <Flex>
            {Object.keys(config).includes('enabled') && (
              <Switch checked={config.enabled} onChange={handleEnabledChanged} disabled={isSaving}>
                {config.enabled ? (
                  <Template source={templates[StringTemplates.ENABLED]} />
                ) : (
                  <Template source={templates[StringTemplates.DISABLED]} />
                )}
              </Switch>
            )}
          </Flex>
          <Flex grow marginLeft="space90" hAlignContent="right">
            <Stack orientation="horizontal" spacing="space30">
              {configureFor === 'user' && isUserModified === true && (
                <Button variant="destructive_secondary" size="circle" onClick={handleReset} disabled={isSaving}>
                  <SkipBackIcon decorative={false} title={strings[StringTemplates.REVERT_WORKER_TO_GLOBAL]} />
                </Button>
              )}
              <Button
                variant="secondary"
                size="circle"
                disabled={!hasMoreSettings}
                onClick={() => setIsModalOpen(true)}
              >
                <ProductSettingsIcon
                  decorative={false}
                  title={
                    hasMoreSettings ? strings[StringTemplates.MORE_SETTINGS] : strings[StringTemplates.NO_MORE_SETTINGS]
                  }
                />
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Card>
      <FeatureModal
        feature={feature}
        configureFor={configureFor}
        isUserModified={isUserModified}
        config={config}
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default FeatureCard;
