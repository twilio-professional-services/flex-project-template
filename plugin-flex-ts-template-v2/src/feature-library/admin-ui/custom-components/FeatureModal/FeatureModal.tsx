import { useEffect, useState } from 'react';
import { Actions, Template, templates } from '@twilio/flex-ui';
import { Alert, Box, TextArea, Anchor, Label, Switch, Button, Input, HelpText } from '@twilio-paste/core';
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
  handleSave: (feature: string, config: any, mergeFeature: boolean) => Promise<boolean>;
}

interface CustomComponentPayload {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
  component?: React.ComponentType;
  hideDefaultComponents?: boolean;
}

const FeatureModal = ({ feature, configureFor, isUserModified, config, isOpen, handleClose, handleSave }: Props) => {
  const [modifiedConfig, setModifiedConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [hasFailure, setHasFailure] = useState(false);
  const [invalidInputs, setInvalidInputs] = useState([] as string[]);
  const [customComponent, setCustomComponent] = useState<React.ComponentType | null>(null);
  const [customAllowSave, setCustomAllowSave] = useState(true);
  const [hideComponents, setHideComponents] = useState(false);
  const modalHeadingID = useUID();
  const seed = useUIDSeed();

  const handleCustomComponent = (payload: CustomComponentPayload) => {
    // Remove listener so that this function is not executed for other features
    Actions.removeListener('afterOpenFeatureSettings', handleCustomComponent);

    if (payload.feature !== feature) return;

    if (payload.component) {
      setCustomComponent(payload.component);
    }
    if (payload.hideDefaultComponents === true) {
      setHideComponents(true);
    }
  };

  const handleCustomComponentUpdate = (featureName: string, newConfig: any) => {
    if (featureName !== feature) return;

    setModifiedConfig(newConfig);
  };

  const handleCustomComponentAllowSave = (featureName: string, allowSave: boolean) => {
    if (featureName !== feature) return;

    setCustomAllowSave(allowSave);
  };

  useEffect(() => {
    if (isOpen) {
      setModifiedConfig(config);
      Actions.addListener('afterOpenFeatureSettings', handleCustomComponent);
      Actions.invokeAction('OpenFeatureSettings', {
        feature,
        initialConfig: config,
        setModifiedConfig: handleCustomComponentUpdate,
        setAllowSave: handleCustomComponentAllowSave,
      });
    } else {
      setCustomComponent(null);
      setHideComponents(false);
      setHasFailure(false);
      setInvalidInputs([]);
    }
  }, [isOpen]);

  const save = async () => {
    setHasFailure(false);
    setIsSaving(true);

    Object.entries(config).forEach(([key, value]) => {
      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
          break;
        default:
          // Parse JSON values that were edited and became strings
          if (typeof modifiedConfig[key] === 'string') {
            modifiedConfig[key] = JSON.parse(modifiedConfig[key]);
          }
          break;
      }
    });

    if (await handleSave(feature, modifiedConfig, false)) {
      handleClose();
    } else {
      setHasFailure(true);
    }
    setIsSaving(false);
  };

  const reset = async () => {
    setHasFailure(false);
    setIsResetting(true);
    if (await handleSave(feature, undefined, true)) {
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
          {!hideComponents &&
            Object.entries(config)
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
                          value={
                            typeof modifiedConfig[key] === 'string'
                              ? modifiedConfig[key]
                              : JSON.stringify(modifiedConfig[key], null, 2)
                          }
                          resize="vertical"
                          element="ADMIN_CODE_TEXTAREA"
                          hasError={invalidInputs.includes(key)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              if (parsed && typeof parsed === 'object') {
                                // valid JSON
                                if (invalidInputs.includes(key)) {
                                  setInvalidInputs((invalidInputs: string[]) =>
                                    invalidInputs.filter((feature) => feature !== key),
                                  );
                                }
                              } else if (!invalidInputs.includes(key)) {
                                setInvalidInputs((invalidInputs: string[]) => [...invalidInputs, key]);
                              }
                            } catch (error) {
                              if (!invalidInputs.includes(key)) {
                                setInvalidInputs((invalidInputs: string[]) => [...invalidInputs, key]);
                              }
                            }
                            // save as string to allow frustration-free edits, later parsed in save()
                            setModifiedConfig((modifiedConfig: any) => ({
                              ...modifiedConfig,
                              [key]: e.target.value,
                            }));
                          }}
                        />
                        {invalidInputs.includes(key) && (
                          <HelpText variant="error">
                            <Template source={templates[StringTemplates.INVALID_JSON]} />
                          </HelpText>
                        )}
                      </>
                    );
                    break;
                }

                return <FormControl key={`${feature}-${key}-controls`}>{controls}</FormControl>;
              })}
          {customComponent}
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
            <Template source={templates.Cancel} />
          </Button>
          <Button
            variant="primary"
            onClick={save}
            loading={isSaving}
            disabled={invalidInputs.length > 0 || !customAllowSave}
          >
            <Template source={templates.Save} />
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default FeatureModal;
