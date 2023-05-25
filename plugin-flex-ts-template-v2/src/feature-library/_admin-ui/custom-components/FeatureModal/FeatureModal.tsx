import { useEffect, useState } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { Alert, Box, TextArea, Anchor, Label, Switch, Button, Input } from '@twilio-paste/core';
import { Form, FormControl } from '@twilio-paste/core/form';
import { useUID, useUIDSeed } from '@twilio-paste/core/uid-library';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { SkipBackIcon } from '@twilio-paste/icons/esm/SkipBackIcon';

import { StringTemplates } from '../../flex-hooks/strings';
import { formatName, formatDocsUrl } from '../../utils/helpers';

interface Props {
  feature: string;
  configureFor: string;
  isUserModified?: boolean;
  config: any;
  isOpen: boolean;
  handleClose: () => void;
  handleSave: (feature: string, config: any) => Promise<boolean>;
}

const FeatureModal = ({ feature, configureFor, isUserModified, config, isOpen, handleClose, handleSave }: Props) => {
  const [modifiedConfig, setModifiedConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);
  const modalHeadingID = useUID();
  const seed = useUIDSeed();

  useEffect(() => {
    if (isOpen) {
      setHasFailure(false);
      setModifiedConfig(config);
    }
  }, [isOpen]);

  const save = async () => {
    setHasFailure(false);
    setIsSaving(true);
    if (await handleSave(feature, modifiedConfig)) {
      handleClose();
    } else {
      setHasFailure(true);
    }
    setIsSaving(false);
  };

  const reset = async () => {
    setHasFailure(false);
    setIsResetting(true);
    if (await handleSave(feature, undefined)) {
      handleClose();
    } else {
      setHasFailure(true);
    }
    setIsResetting(false);
  };

  return (
    <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          <Template source={templates[StringTemplates.MODAL_SETTINGS_TITLE]} feature={formatName(feature)} />
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        {hasFailure && (
          <Box marginBottom="space70">
            <Alert variant="error">
              <Template source={templates[StringTemplates.SAVE_ERROR]} />
            </Alert>
          </Box>
        )}
        <Form>
          {Object.entries(config)
            .filter(([key]) => key !== 'enabled')
            .map(([key, value]) => {
              let controls;
              switch (typeof value) {
                case 'boolean':
                  controls = (
                    <Switch
                      checked={modifiedConfig[key]}
                      onChange={(e) =>
                        setModifiedConfig((modifiedConfig: any) => ({ ...modifiedConfig, [key]: e.target.checked }))
                      }
                    >
                      {formatName(key)}
                    </Switch>
                  );
                  break;
                case 'number':
                  controls = (
                    <>
                      <Label htmlFor={seed(`${feature}-${key}`)}>{formatName(key)}</Label>
                      <Input
                        id={seed(`${feature}-${key}`)}
                        name={seed(`${feature}-${key}`)}
                        type="number"
                        value={modifiedConfig[key].toString()}
                        onChange={(e) => {
                          const numValue = Number.parseFloat(e.target.value);
                          if (Number.isNaN(numValue)) return;

                          setModifiedConfig((modifiedConfig: any) => ({ ...modifiedConfig, [key]: numValue }));
                        }}
                      />
                    </>
                  );
                  break;
                case 'string':
                  controls = (
                    <>
                      <Label htmlFor={seed(`${feature}-${key}`)}>{formatName(key)}</Label>
                      <Input
                        id={seed(`${feature}-${key}`)}
                        name={seed(`${feature}-${key}`)}
                        type="text"
                        value={modifiedConfig[key]}
                        onChange={(e) =>
                          setModifiedConfig((modifiedConfig: any) => ({ ...modifiedConfig, [key]: e.target.value }))
                        }
                      />
                    </>
                  );
                  break;
                default:
                  controls = (
                    <>
                      <Label htmlFor={seed(`${feature}-${key}`)}>{formatName(key)}</Label>
                      <TextArea
                        id={seed(`${feature}-${key}`)}
                        name={seed(`${feature}-${key}`)}
                        value={JSON.stringify(modifiedConfig[key], null, 2)}
                        resize="vertical"
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            if (parsed && typeof parsed === 'object') {
                              setModifiedConfig((modifiedConfig: any) => ({ ...modifiedConfig, [key]: parsed }));
                            }
                          } catch (e) {}
                        }}
                      />
                    </>
                  );
                  break;
              }

              return <FormControl key={`${feature}-${key}-controls`}>{controls}</FormControl>;
            })}
        </Form>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions justify="start">
          {configureFor === 'user' && isUserModified === true && (
            <Button variant="destructive_secondary" onClick={reset} loading={isResetting}>
              <SkipBackIcon decorative={true} />
              <Template source={templates[StringTemplates.REVERT_WORKER_TO_GLOBAL]} />
            </Button>
          )}
          <Anchor href={formatDocsUrl(feature)} showExternal>
            <Template source={templates[StringTemplates.DOCS]} />
          </Anchor>
        </ModalFooterActions>
        <ModalFooterActions>
          <Button variant="secondary" onClick={handleClose}>
            <Template source={templates[StringTemplates.CANCEL]} />
          </Button>
          <Button variant="primary" onClick={save} loading={isSaving}>
            <Template source={templates[StringTemplates.SAVE]} />
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default FeatureModal;
